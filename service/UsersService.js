const client = require("../data_access/DbConnection.js");
const dbQuery = require("../data_access/DbQueries.js");
const utility = require("../utils/Utility.js");

async function signUp(req, res) {
    const { username, email, password } = req.body;
    const hashedPassword = utility.encrypt(password);

    try {
        const existingUser = await client.query(dbQuery.SELECT_USER_QUERY, [email]);

        if (existingUser.rows.length > 0) {
            if (existingUser.rows[0].verified == false) {
                await client.query(dbQuery.DELETE_OTP_QUERY, [email]);

                await client.query(dbQuery.DELETE_USER_QUERY, [
                    email,
                ]);
            } else return res.status(409).json({ error: "Email already in use" });
        }

        await client.query(dbQuery.INSERT_USER_QUERY, [email, username, hashedPassword, false]);
        console.log("User inserted in DB");

        const otp = utility.genOtp();
        await client.query(dbQuery.INSERT_OTP_QUERY, [otp, email]);
        console.log(email + " " + otp);

        return res.status(201).json({ message: "User registered." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function verification(req, res) {
    const { otp, email } = req.body;

    try {
        const userRecord = await client.query(dbQuery.SELECT_USER_AND_OTP_QUERY, [email]);

        const dbOtp = userRecord.rows[0].otp;

        if (otp == dbOtp) {
            await client.query(dbQuery.SET_USER_AS_VERIFIED, [email]);

            await client.query(dbQuery.DELETE_OTP_QUERY, [email]);

            return res.status(200).json({
                message: "User verified successfully.",
            });
        } else {
            return res.status(403).json({
                message: "Incorrect OTP.",
            });
        }
    } catch (error) {
        const userRecord = await client.query(dbQuery.SELECT_EMAIL_AND_VERIFIED_QUERY, [email]);

        if (userRecord.rows[0].verified == true) {
            return res.status(409).json({ error: "User Already Verified" });
        } else {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

async function resendOtp(req, res) {
    const { email } = req.body;

    try {
        const user = await client.query(dbQuery.SELECT_EMAIL_AND_VERIFIED_QUERY, [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const otpField = await client.query(dbQuery.SELECT_EMAIL_FROM_OTP_QUERY, [email]);
        const newOTP = utility.genOtp();

        if (otpField.rows.length === 0) {
            await client.query(dbQuery.INSERT_OTP_QUERY, [newOTP, email]);
        } else {
            await client.query(dbQuery.UPDATE_OTP_QUERY, [newOTP, email,]);
        }

        return res.status(200).json({ message: "OTP Sent" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const user = await client.query(dbQuery.SELECT_USER_AND_PFP_QUERY, [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const hashedPassword = user.rows[0].password;
        const dbIsVerfied = user.rows[0].verified;
        const username = user.rows[0].username;
        const pfp = user.rows[0].pfp;

        if (dbIsVerfied == false) {
            return res.status(403).json({ error: "User not verified" });
        }

        if (!utility.checkPwd(password, hashedPassword)) {
            return res.status(401).json({ error: "Incorrect Password" });
        }

        const token = utility.createToken(email);
        res.setHeader("Authorization", token);
        req.session.token = token;
        console.log(token);
        console.log(pfp);

        return res
            .status(200)
            .json({ message: "User Signed In", username: username, pfp: pfp });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function resetPassword(req, res) {
    const { email, newpassword, enteredotp } = req.body;

    try {
        const validation = await utility.isValidEmail(email);
        if (!validation.result) {
            return res
                .status(validation.status)
                .json({ error: validation.message });
        }

        const userRecordFromOtps = await client.query(dbQuery.SELECT_EMAIL_AND_OTP_QUERY, [email]);

        if (userRecordFromOtps.rows.length === 0) {
            return res.status(404).json({
                error: "No otp is linked with the email",
            });
        }

        const dbOtp = userRecordFromOtps.rows[0].otp;
        const hashedPassword = utility.encrypt(newpassword);

        if (enteredotp == dbOtp) {
            await client.query(dbQuery.UPDATE_PASSWORD_QUERY, [hashedPassword, email]);

            await client.query(dbQuery.DELETE_OTP_QUERY, [email]);

            return res.status(200).json({
                message: "Password updated successfully",
            });
        } else {
            return res.status(403).json({
                message: "Incorrect OTP.",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function retrieveUsername(req, res) {
    console.log(req.header("Authorization"));
    const { email } = await service.isSignedIn(req.header("Authorization"));
    console.log("Email: " + email);
    console.log(req.session.token);

    if (email) {
        const user = await client.query(dbQuery.SELECT_USERNAME_QUERY, [email]);
        // console.log(user);
        return res.status(200).json({ username: user.rows[0].username });
    }
}

async function setProfile(req, res) {
    const { email, status } = await utility.isSignedIn(
        req.header("Authorization")
    );
    if (status === 401) {
        return res.status(status).json({ message: "Session Expired" });
    }

    try {
        const { company, designation, dob, sex, blood_group, pfp } = req.body;

        await client.query(dbQuery.DELETE_USERINFO_QUERY, [email]);

        await client.query(dbQuery.INSERT_USERINFO_QUERY, [company, designation, dob, email, sex, blood_group, pfp]);
        res.status(200).json({ message: "Profile setup completed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function fetchprofile(req, res) {
    const { email } = req.body;

    try {
        const validation = await utility.isValidEmail(email);
        if (!validation.result) {
            return res
                .status(validation.status)
                .json({ error: validation.message });
        }

        const userinfo = await client.query(dbQuery.SELECT_USERPROFILE_QUERY, [email]);

        return res.status(200).json({ userinfo: userinfo.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

function logout(req, res) {
    if (req.session.token) {
        delete req.session.token;
        req.session.destroy();

        return res.status(200).json({ message: "Token removed successfully" });
    } else {
        return res.status(400).json({ message: "No token in the session" });
    }
}

module.exports = {
    signIn,
    verification,
    resendOtp,
    signUp,
    resetPassword,
    retrieveUsername,
    setProfile,
    fetchprofile,
    logout,
};
