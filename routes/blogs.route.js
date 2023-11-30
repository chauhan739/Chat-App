const express = require("express");
const blog = require("../service/blogs.service.js");
const path = require("path");

const router = express.Router();


router.post("/createpost", blog.createPost);
router.put("/editpost", blog.editPost);
router.get(
    "/allposts",
    // (req, res, next) => {
    //     res.sendFile(path.join(__dirname, "../public/blog.html"));
    //     next();
    // },
    blog.allPosts
);
router.delete("/deletepost", blog.deletePost);
router.get("/myposts", blog.myPosts);
router.post("/comment", blog.comment);
router.put("/like", blog.like);

module.exports = router;
