const express = require("express");
const user = require("../service/users.service.js");

const router = express.Router();

router.post("/signup", user.signUp);
router.post("/verify", user.verification);
router.post("/resend", user.resendOtp);
router.post("/signin", user.signIn);
router.post("/resetpassword", user.resetPassword);
router.post("/fetchprofile", user.fetchprofile);
router.put("/setprofile", user.setProfile);
router.delete("/logout", user.logout);
router.get("/chat", user.retrieveUsername);

module.exports = router;
