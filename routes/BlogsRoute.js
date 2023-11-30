const express = require("express");
const blog = require("../service/BlogsService.js");
const path = require("path");

const router = express.Router();


router.post("/createpost", blog.createPost);
// router.put("/editpost", blog.editPost);
router.get("/allposts", blog.allPosts);
router.delete("/deletepost", blog.deletePost);
router.get("/myposts", blog.myPosts);
router.post("/comment", blog.comment);
router.put("/like", blog.like);

module.exports = router;
