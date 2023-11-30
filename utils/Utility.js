const client = require("../data_access/DbConnection.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret_key = "aryan-secret-key";

function genOtp() {
    var min = 100000,
        max = 999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function isValidEmail(email) {
    const user = await client.query(
        "SELECT email, verified FROM users WHERE email = $1",
        [email]
    );

    if (user.rows.length === 0) {
        return {
            result: false,
            status: 404,
            message: "User not found",
        };
    }

    if (user.rows[0].verified == false) {
        return {
            result: false,
            status: 403,
            message: "User not verified",
        };
    }

    return { result: true };
}

function encrypt(password, saltRounds = 10) {
    return bcrypt.hashSync(password, saltRounds);
}

function checkPwd(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function createToken(email) {
    return jwt.sign({ email: email }, jwt_secret_key, { expiresIn: "1d" });
}

async function isSignedIn(token) {
    try {
        var result;
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, jwt_secret_key, (err, decoded) => {
                if (err) {
                    result = false;
                    reject(err);
                } else {
                    result = true;
                    resolve(decoded);
                }
            });
        });

        const user = await client.query(
            "SELECT username FROM users where email = $1",
            [decoded.email]
        );
        return {
            status: 200,
            result: result,
            email: decoded.email,
            username: user.rows[0].username,
        };
    } catch (error) {
        return {
            status: 401,
            result: false,
            email: undefined,
            username: undefined,
        };
    }
}

module.exports = {
    genOtp,
    isValidEmail,
    encrypt,
    checkPwd,
    createToken,
    isSignedIn,
    jwt_secret_key,
};
