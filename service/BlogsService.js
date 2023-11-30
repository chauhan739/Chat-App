const client = require("../data_access/DbConnection.js");
const dbQuery = require("../data_access/DbQueries.js")
const service = require("../utils/Utility.js");

async function createPost(req, res) {
    const { email, status } = await service.isSignedIn(
        req.header("Authorization")
    );
    console.log("createPost ", email, status);
    if (status === 401) {
        return res.status(status).json({ message: "Session Expired" });
    }
    const { title, description, image_url, category } = req.body;

    try {
        await client.query(dbQuery.INSERT_POST_QUERY, [email, title, description, image_url, category, false]);

        return res
            .status(201)
            .json({ message: "Post saved successfully in DB" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// async function editPost(req, res) {
//     const { email, postid } = req.body;

//     try {
//         const user = isValidEmail(email);
//         if (user.status === 404) {
//             return res.status(user.status).json({ error: user.message });
//         }
//         if (user.status === 403) {
//             return res.status(user.status).json({ error: user.message });
//         }

//         const posts = await client.query(dbQuery.SELECT_EMAIL_AND_POSTID_QUERY,[email, postid]);

//         if (posts.rows.length === 0) {
//             return res
//                 .status(404)
//                 .json({ error: "PostId do not belong to the User" });
//         }

//         await client.query(
//             "UPDATE posts SET likes = likes + 5, comments = comments + 5 WHERE postid = $1 AND email = $2",
//             [postid, email]
//         );

//         return res
//             .status(201)
//             .json({ message: "Post updated successfully in DB" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }

async function allPosts(req, res) {
    const { email, status } = await service.isSignedIn(
        req.header("Authorization")
    );
    if (status === 401) {
        return res.status(status).json({ message: "Session Expired" });
    }

    try {
        const posts = await client.query(dbQuery.SELECT_POST_USERNAME_AND_PFP_QUERY);
        const comments = await client.query(dbQuery.SELECT_COMMENTS_AND_USERNAME_QUERY);
        const likes = await client.query(dbQuery.SELECT_POSTID_FROM_LIKE_QUERY, [email]);

        return res.status(200).json({
            allPosts: posts.rows,
            comments: comments.rows,
            likes: likes.rows,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function deletePost(req, res) {
    const { email, status } = await service.isSignedIn(
        req.header("Authorization")
    );
    if (status === 401) {
        return res.status(status).json({ message: "Session Expired" });
    }

    const { postid } = req.body;

    try {
        const posts = await client.query(dbQuery.SELECT_EMAIL_AND_POSTID_QUERY, [email, postid]);

        if (posts.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "PostId do not belong to the User" });
        }

        await client.query(dbQuery.DELETE_POST_QUERY, [postid, email]);

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function myPosts(req, res) {
    const { email, status } = await service.isSignedIn(
        req.header("Authorization")
    );
    if (status === 401) {
        return res.status(status).json({ message: "Session Expired" });
    }

    try {
        const myPosts = await client.query(dbQuery.SELECT_MYPOST_QUERY, [email]);
        const comments = await client.query(dbQuery.SELECT_COMMENTS_AND_USERNAME_QUERY);

        return res
            .status(200)
            .json({ allPosts: myPosts.rows, comments: comments.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function comment(req, res) {
    const { email, status } = await service.isSignedIn(
        req.header("Authorization")
    );
    if (status === 401) {
        return res.status(status).json({ message: "Session Expired" });
    }

    try {
        const { postid, comment, date } = req.body;
        const postRow = await client.query(dbQuery.SELECT_POSTID_FROM_POST_QUERY, [postid]);

        if (postRow.rows.length === 0) {
            return res.status(404).json({ error: "No post found" });
        }

        await client.query(dbQuery.INSERT_COMMENT_QUERY, [postid, email, comment, date]);

        return res.status(200).json({ message: "Commented successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function like(req, res) {
    const { email, status } = await service.isSignedIn(
        req.header("Authorization")
    );
    if (status === 401) {
        return res.status(status).json({ message: "Session Expired" });
    }

    try {
        const { postid } = req.body;
        const postRow = await client.query(dbQuery.SELECT_POSTID_FROM_POST_QUERY, [postid]);

        if (postRow.rows.length === 0) {
            return res.status(404).json({ error: "No post found" });
        }

        const likedata = await client.query(dbQuery.SELECT_LIKEID_FROM_LIKE_QUERY, [email]);

        if (likedata.rows.length === 0) {
            await client.query(dbQuery.INSERT_LIKE_QUERY, [postid, email]);
            return res.status(200);
        } else {
            await client.query(dbQuery.DELETE_LIKE_QUERY, [postid, email]);
            return res.status(204);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    createPost,
    // editPost,
    allPosts,
    deletePost,
    myPosts,
    comment,
    like,
};
