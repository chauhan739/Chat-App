const express = require("express");
const utility = require("../utils/Utility.js");
const path = require("path");
const userRoute = require("./UsersRoute.js");
const blog = require("./BlogsRoute.js");

const router = express.Router();

router.get("/", async (req, res) => {
    if (req.session.token) {
        const { result } = await utility.isSignedIn(req.session.token);
        if (result) res.sendFile(path.join(__dirname, "../views/Blog.html"));
        else res.sendFile(path.join(__dirname, "../views/Welcome.html"));
    } else res.sendFile(path.join(__dirname, "../views/Welcome.html"));
});

router.use("/user", userRoute);
router.use("/blog", blog);

module.exports = router;
