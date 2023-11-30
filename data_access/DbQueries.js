const dbConstants = require("./DbConstants.js")

module.exports.DELETE_OTP_QUERY = "DELETE FROM otps WHERE email = $1";
module.exports.DELETE_USER_QUERY = "DELETE FROM users WHERE email = $1";
module.exports.DELETE_USERINFO_QUERY = "DELETE FROM userinfo WHERE email = $1";
module.exports.DELETE_POST_QUERY = "DELETE FROM posts WHERE postid = $1 AND email = $2";
module.exports.DELETE_LIKE_QUERY = "DELETE FROM likes WHERE postid = $1 AND email = $2";

module.exports.INSERT_USER_QUERY = "INSERT INTO users (email, username, password, verified) VALUES ($1, $2, $3, $4)";
module.exports.INSERT_OTP_QUERY = "INSERT INTO otps (otp, email) VALUES ($1, $2)";
module.exports.INSERT_USERINFO_QUERY = "INSERT INTO userinfo (company, designation, dob, email, sex, blood_group, pfp) VALUES ($1, $2, $3, $4, $5, $6, $7)";
module.exports.INSERT_POST_QUERY = "INSERT INTO posts (email, title, description, image_url, category, verified) VALUES ($1, $2, $3, $4, COALESCE($5, 'general'), $6)";
module.exports.INSERT_LIKE_QUERY = "INSERT INTO likes (postid, email) VALUES ($1, $2)";
module.exports.INSERT_COMMENT_QUERY = "INSERT INTO comments (postid, email, comment, date_created) VALUES ($1, $2, $3, $4)";

module.exports.SELECT_USER_QUERY = "SELECT * FROM users WHERE email = $1";
module.exports.SELECT_USER_AND_OTP_QUERY = "SELECT users.email, otps.otp FROM users JOIN otps ON users.email = otps.email WHERE users.email = $1";
module.exports.SELECT_EMAIL_AND_VERIFIED_QUERY = "SELECT email, verified FROM users WHERE email = $1";
module.exports.SELECT_EMAIL_FROM_OTP_QUERY = "SELECT email FROM otps WHERE email = $1";
module.exports.SELECT_USER_AND_PFP_QUERY = "SELECT users.*, userinfo.pfp FROM users JOIN userinfo ON users.email = userinfo.email WHERE users.email = $1";
module.exports.SELECT_EMAIL_AND_OTP_QUERY = "SELECT email, otp FROM otps WHERE email = $1";
module.exports.SELECT_USERNAME_QUERY = "SELECT username FROM users WHERE email = $1";
module.exports.SELECT_USERPROFILE_QUERY = "SELECT userinfo.*, users.username, COUNT(posts.postid) AS post_count, SUM(posts.likes) AS total_likes FROM userinfo JOIN users ON userinfo.email = users.email LEFT JOIN posts ON userinfo.email = posts.email WHERE userinfo.email = $1 GROUP BY  userinfo.email,  userinfo.company, userinfo.designation, userinfo.dob, userinfo.pfp, userinfo.sex, userinfo.blood_group, users.username;";
module.exports.SELECT_EMAIL_AND_POSTID_QUERY = "SELECT email, postid FROM posts WHERE email = $1 AND postid = $2";
module.exports.SELECT_POSTID_FROM_LIKE_QUERY = "SELECT postid FROM likes WHERE email = $1";
module.exports.SELECT_POST_USERNAME_AND_PFP_QUERY = "SELECT posts.*, users.username AS post_from, userinfo.pfp AS user_pfp FROM posts JOIN users ON posts.email = users.email JOIN userinfo ON users.email = userinfo.email ORDER BY postid DESC;";
module.exports.SELECT_COMMENTS_AND_USERNAME_QUERY = "SELECT comments.*, users.username AS comment_from FROM comments JOIN users ON comments.email = users.email";
module.exports.SELECT_MYPOST_QUERY = "SELECT * FROM posts WHERE email = $1 ORDER BY postid DESC";
module.exports.SELECT_POSTID_FROM_POST_QUERY = "SELECT postid FROM posts WHERE postid = $1";
module.exports.SELECT_LIKEID_FROM_LIKE_QUERY = "SELECT likeid FROM likes WHERE email = $1";

module.exports.SET_USER_AS_VERIFIED = "UPDATE users SET verified = true WHERE email = $1";

module.exports.UPDATE_OTP_QUERY = "UPDATE otps SET otp = $1 WHERE email = $2";
module.exports.UPDATE_PASSWORD_QUERY = "UPDATE users SET password = $1 WHERE email = $2";
