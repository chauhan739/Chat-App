const date = Date().slice(4, 15);
const heading = document.getElementById("heading");
const headerImg = document.getElementById("header-img");
const blogTabButton = document.getElementById("blog-tab");
const chatTabButton = document.getElementById("chat-tab");
const blogForm = document.getElementById("blog-form");
const chat = document.getElementById("chat-container");
const postArea = document.getElementById("post-area");
const totalPosts = document.getElementById("total-posts");

const postsData = JSON.parse(localStorage.getItem("postsData"));
const postsArray = postsData.allPosts;
const commentsArray = postsData.comments;
const likesArray = postsData.likes;

var receiver;

heading.innerHTML = `<h1>Welcome ${localStorage.username}</h1>`;
headerImg.innerHTML = `<img src="${localStorage.pfp}" class= "blog-owner-img" />`;

blogTabButton.addEventListener("click", () => {
    blogForm.style.display = "block";
    chat.style.display = "none";
    blogTabButton.style.backgroundColor = "#0c8e06";
    chatTabButton.style.backgroundColor = "";
});

chatTabButton.addEventListener("click", () => {
    openAlert("Select user from Online Users list to chat");
});

console.log(postsArray);
console.log(commentsArray);
console.log(likesArray);

totalPosts.innerHTML = `<h4>Total Posts: ${postsArray.length}</h4>`;

for (let i = 0; i < postsArray.length; i++) {
    const blogContainer = document.createElement("div");
    blogContainer.classList.add("blog-container");
    blogContainer.innerHTML = `
                  <div style="display: flex; flex-direction: row;">
                    <h1 class="blog-title">${postsArray[i].title}</h1>
                    <a href="#" onclick="fetchprofile('${postsArray[i].email}')"><img src="${postsArray[i].user_pfp}" class="blog-owner-img" /></a>
                  </div>
                  <p class="blog-meta">Published by <a href="#" onclick="fetchprofile('${postsArray[i].email}')">${postsArray[i].post_from}</a> on ${postsArray[i].date_created} | Category: ${postsArray[i].category}</p>
                  <p class="blog-description">${postsArray[i].description}</p>
                  <img class="blog-image" src="${postsArray[i].image_url}" alt="Blog Image">
                  <div style="display: flex; justify-content: space-between; margin-top: 10px;margin-bottom: 10px">
                    <input type="text" id="post-id-${postsArray[i].postid}" placeholder="Add a comment for ${postsArray[i].post_from}'s post" style="margin-bottom: auto; margin-top: auto"></input>
                    <button type="button" onclick=comment(${postsArray[i].postid}) style="margin-left: 10px; margin-bottom: auto; margin-top: auto;">Comment</button>
                  </div>
                  <div style="display:flex; flex-direction:row; justify-content: space-between;">
                    <div class="comments-area" id="comments-area-${postsArray[i].postid}" style="margin-left:10px; margin-bottom:auto; margin-top:auto; width:80%; position: relative">
                      <div style="display: inline; position: absolute; top: 0; right: 0; background-color: white; padding: 5px; font-size: 12px">
                        Total Comments: ${postsArray[i].comments}
                      </div>
                    </div>
                    <div style="display:flex; flex-direction:column; justify-content: space-between; text-align:center;">
                      <label style="font-size:11px">Likes: ${postsArray[i].likes}</label>
                      <button type="button" id="like-post-button-${postsArray[i].postid}" onclick="like(${postsArray[i].postid})" style="width:100%; margin-bottom:5px">Like</button>
                      <button type="button" id="delete-post-button-${postsArray[i].postid}" onclick="deletePost(${postsArray[i].postid})" style="width:100%">Delete Post</button>
                    </div>
                  </div>
                `;

    postArea.appendChild(blogContainer);
    document.getElementById(
        "delete-post-button-" + postsArray[i].postid
    ).disabled = !(localStorage.email == postsArray[i].email);
}

printComments();

for (let i = 0; i < likesArray.length; i++) {
    document.getElementById(
        "like-post-button-" + likesArray[i].postid
    ).innerText = "Dislike";
}

function submitPost() {
    const blogData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        image_url: document.getElementById("img-url").value,
        category: document.getElementById("category").value,
    };

    fetch("/blog/createpost", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.authToken}`,
        },
        body: JSON.stringify(blogData),
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
        });

    location.reload();
}

function fetchprofile(email) {
    fetch("/user/fetchprofile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.authToken}`,
        },
        body: JSON.stringify({ email: email }),
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            openProfile(data.userinfo[0]);
        });
}

function openProfile(userinfo) {
    const popup = document.getElementById("popup");
    popup.style.display = "flex";

    const isMyProfile = localStorage.email == userinfo.email;

    const popupHeading = document.getElementById("popupHeading");
    const popupUsername = document.getElementById("popupUsername");
    const popupEmail = document.getElementById("popupEmail");
    const popupDOB = document.getElementById("popupDOB");
    const popupGender = document.getElementById("popupGender");
    const popupCompany = document.getElementById("popupCompany");
    const popupDesignation = document.getElementById("popupDesignation");
    const popupBG = document.getElementById("popupBG");
    const popupTP = document.getElementById("popupTP");
    const popupTL = document.getElementById("popupTL");

    document.getElementById("displayPFP").src = userinfo.pfp;
    document.getElementById("popupPfpUrl").value = userinfo.pfp;

    popupHeading.innerText = `${userinfo.username}`;

    popupUsername.innerText = userinfo.username;
    popupEmail.innerText = userinfo.email;
    popupDOB.value = userinfo.dob;
    popupGender.value = userinfo.sex;
    popupCompany.value = userinfo.company;
    popupDesignation.value = userinfo.designation;
    popupBG.value = userinfo.blood_group;
    popupTP.innerText = userinfo.post_count;
    popupTL.innerText = userinfo.total_likes;

    popupDOB.disabled = !isMyProfile;
    popupGender.disabled = !isMyProfile;
    popupCompany.disabled = !isMyProfile;
    popupDesignation.disabled = !isMyProfile;
    popupBG.disabled = !isMyProfile;

    if (isMyProfile) {
        document.getElementById("updateProfileButton").style.display = "block";
        document.getElementById("upload-pfp").style.display = "block";
    }
}

function updateProfile() {
    const popupDOB = document.getElementById("popupDOB");
    const popupGender = document.getElementById("popupGender");
    const popupCompany = document.getElementById("popupCompany");
    const popupDesignation = document.getElementById("popupDesignation");
    const popupBG = document.getElementById("popupBG");
    const pfp = document.getElementById("popupPfpUrl");

    const profileData = {
        company: popupCompany.value,
        designation: popupDesignation.value,
        dob: popupDOB.value,
        sex: popupGender.value,
        blood_group: popupBG.value,
        pfp: pfp.value,
    };

    fetch("/user/setprofile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.authToken}`,
        },
        body: JSON.stringify(profileData),
    })
        .then((res) => {
            if (res.status == 200) {
                openAlert("Profile Updated Successfully");
                localStorage.pfp = pfp.value;
            }

            return res.json();
        })
        .then((data) => {
            console.log(data);
        });
}

function closePopup() {
    const popupUsername = document.getElementById("popupUsername");
    const popupEmail = document.getElementById("popupEmail");
    const popupDOB = document.getElementById("popupDOB");
    const popupGender = document.getElementById("popupGender");
    const popupCompany = document.getElementById("popupCompany");
    const popupDesignation = document.getElementById("popupDesignation");
    const popupBG = document.getElementById("popupBG");
    const popupTP = document.getElementById("popupTP");
    const popupTL = document.getElementById("popupTL");

    popupUsername.value = "";
    popupEmail.value = "";
    popupDOB.value = "";
    popupGender.value = "";
    popupCompany.value = "";
    popupDesignation.value = "";
    popupBG.value = "";
    popupTP.value = "";
    popupTL.value = "";

    document.getElementById("updateProfileButton").style.display = "none";
    document.getElementById("upload-pfp").style.display = "none";

    const popup = document.getElementById("popup");
    popup.style.display = "none";
}

function comment(postid) {
    const commentText = document.getElementById("post-id-" + postid);
    const commentdata = {
        postid: postid,
        comment: commentText.value,
        date: date,
    };

    const newComment = {
        postid: postid,
        comment: commentText.value,
        date_created: date,
        comment_from: localStorage.username,
        email: localStorage.email,
    };
    // commentsArray.push(newComment);
    postsData.comments.push(newComment);

    fetch("/blog/comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.authToken}`,
        },
        body: JSON.stringify(commentdata),
    })
        .then((res) => {
            if (res.status == 200) {
                openAlert("Commented Successfully");
                const emitData = {
                    postid: postid,
                    username: localStorage.username,
                    latestComment: newComment,
                };
                socket.emit("commented", emitData);
            }
            commentText.value = "";
            return res.json();
        })
        .then((data) => {
            console.log(data);
        });
}

function like(postid) {
    fetch("/blog/like", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.authToken}`,
        },
        body: JSON.stringify({ postid: postid }),
    }).then((res) => {
        if (res.status == 200) {
            document.getElementById("like-post-button-" + postid).innerText =
                "Dislike";
            console.log("Post (" + postid + ") liked");
        } else if (res.status == 204) {
            document.getElementById("like-post-button-" + postid).innerText =
                "Like";
            console.log("Post (" + postid + ") disliked");
        }
    });
}

function deletePost(postid) {
    fetch("/blog/deletepost", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.authToken}`,
        },
        body: JSON.stringify({ postid: postid }),
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
        });
}

function chatting(chatter) {
    chat.style.display = "flex";
    blogForm.style.display = "none";
    chatTabButton.style.backgroundColor = "#0c8e06";
    blogTabButton.style.backgroundColor = "";
    document
        .getElementById("input-message")
        .setAttribute("placeholder", `Send message to ${chatter}`);
    receiver = chatter;
    // alert(chatter);
}

function printComments() {
    for (let i = 0; i < commentsArray.length; i++) {
        const commentsAreaId = "comments-area-" + commentsArray[i].postid;
        const commentsContainer = document.getElementById(commentsAreaId);
        const comment = document.createElement("div");
        comment.innerHTML = `
                    ${commentsArray[i].comment} - <h4 style="display:inline;">${commentsArray[i].comment_from}</h4>
                `;
        comment.style.marginLeft = "8px";
        comment.style.marginBottom = "8px";
        comment.style.fontSize = "12px";
        commentsContainer.appendChild(comment);
    }
}

function allPosts() {
    fetch("/blog/allposts", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.authToken}`,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            localStorage.postsData = JSON.stringify(data);
            location.reload();
        });
}

function myPosts() {
    fetch("/blog/myposts", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.authToken}`,
        },
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            localStorage.postsData = JSON.stringify(data);
            location.reload();
        });
}

function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    localStorage.removeItem("username");

    fetch("/user/logout", {
        method: "DELETE",
        header: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (res.status == 200) {
                openAlert("Logged out successfully");
                location.href = "/";
            } else if (res.status == 400) {
                openAlert("Session Timed Out. Close the browser");
            }

            return res.json();
        })
        .then((data) => {
            console.log(data);
        });
}
