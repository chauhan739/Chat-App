const signinTab = document.getElementById("sign-in-tab");
const signupTab = document.getElementById("sign-up-tab");
const signinForm = document.getElementById("sign-in-form");
const signupForm = document.getElementById("sign-up-form");
const signinEmail = document.getElementById("email-signin");
const signinPassword = document.getElementById("password-signin");
const signupUsername = document.getElementById("username");
const signupEmail = document.getElementById("email-signup");
const signupPassword = document.getElementById("password-signup");
const signinButton = document.getElementById("signin-button");
const sendOTPButton = document.getElementById("send-otp-button");
const otpContainer = document.getElementById("otp-container");
const otpInputs = document.querySelectorAll(".otp-input");
const verifyOTPButton = document.getElementById("verify-otp-button");
const resendOTPButton = document.getElementById("resend-otp-button");

const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
        popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
});

signinTab.addEventListener("click", () => {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
    signinTab.style.backgroundColor = "#3498db";
    signupTab.style.backgroundColor = "";
    resetForms();
});

signupTab.addEventListener("click", () => {
    signinForm.style.display = "none";
    signupForm.style.display = "block";
    signupTab.style.backgroundColor = "#3498db";
    signinTab.style.backgroundColor = "";
    resetForms();
});

otpInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
        // Move to the next input field when a digit is entered
        if (index < otpInputs.length - 1 && event.target.value) {
            otpInputs[index + 1].focus();
        }
    });

    // Move to the previous input field when backspace is pressed
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && index > 0 && !event.target.value) {
            otpInputs[index - 1].focus();
        }
    });
});

function validatePassword() {
    // Define your password requirements
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    const password = signupPassword.value;

    // Check if password meets the criteria
    const isPasswordValid = uppercaseRegex.test(password) &&
        digitRegex.test(password) &&
        specialCharRegex.test(password);

    // Enable or disable the button based on password validity
    sendOTPButton.disabled = !isPasswordValid;
}

function resetForms() {
    [
        signinEmail,
        signinPassword,
        signupUsername,
        signupEmail,
        signupPassword,
    ].forEach((input) => {
        input.value = "";
        input.disabled = false;
    });

    [signinButton, sendOTPButton].forEach((button) => {
        button.disabled = true;
    });

    otpInputs.forEach((input) => {
        input.value = "";
    });

    otpContainer.style.display = "none";
    verifyOTPButton.disabled = true;
}

[signinEmail, signinPassword].forEach((input) => {
    input.addEventListener("input", () => toggleButtonState(signinButton));
});

[signupUsername, signupEmail, signupPassword].forEach((input) => {
    input.addEventListener("input", () => toggleButtonState(sendOTPButton));
});

function toggleButtonState(button) {
    const isSignin = button === signinButton;
    const inputs = isSignin
        ? [signinEmail, signinPassword]
        : [signupUsername, signupEmail, signupPassword];
    const allFilled = inputs.every((input) => input.value.trim() !== "");
    button.disabled = !allFilled;
}

function sendOTP() {
    const signupData = {
        username: signupUsername.value,
        email: signupEmail.value,
        password: signupPassword.value,
    };

    fetch("/user/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
    }).then((res) => {
        if (res.status == 409) {
            openAlert("Email already in use. Please Sign-In");
            return;
        } else if (res.status == 201) openAlert("OTP Sent!!");
        else if (res.status == 500) {
            openAlert("Internal server problem. Plase try again later!!");
            return;
        }
    });

    signupUsername.disabled = true;
    signupEmail.disabled = true;
    signupPassword.disabled = true;
    sendOTPButton.disabled = true;

    otpContainer.style.display = "flex";
    verifyOTPButton.disabled = false;
}

function verifyOTP() {
    let otp = "";
    otpInputs.forEach((input) => {
        otp += input.value;
    });

    const verifyData = {
        otp: otp,
        email: signupEmail.value,
    };

    fetch("/user/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyData),
    }).then((res) => {
        if (res.status == 200) {
            openAlert("OTP Verified. Please Sign-In");
            otpInputs.forEach((input) => {
                input.disabled = true;
            });
        } else if (res.status == 403) {
            openAlert("Incorrect OTP");
            otpInputs.forEach((input) => {
                input.value = "";
            });
        } else if (res.status == 500) {
            openAlert("Internal server problem. Plase try again later!!");
            return;
        }
    });

    // resetForms();
}

function resendOTP() {
    fetch("/user/resend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailForgetPassword.value }),
    }).then((res) => {
        if (res.status == 200) openAlert("OTP sent");
        else if (res.status == 500) {
            openAlert("Internal server problem. Plase try again later!!");
            return;
        } else if (res.status == 404) {
            openAlert("Invalid email");
            return;
        }
    });
}

function signIn() {
    var signInSuccess = false;

    const signinData = {
        email: signinEmail.value,
        password: signinPassword.value,
    };

    fetch("/user/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(signinData),
    })
        .then(async (res) => {
            if (res.status == 404)
                openAlert("No user found with this email. First register yourself");
            else if (res.status == 403)
                openAlert("Registration process is incomplete. Verify yourself");
            else if (res.status == 401) {
                await Toast.fire({
                    icon: 'error',
                    title: 'Incorrect Password'
                });
            }
            else if (res.status == 200) {
                // openAlert("Logged In successfully");

                localStorage.email = signinEmail.value;

                signinEmail.disabled = true;
                signinPassword.disabled = true;
                signinButton.disabled = true;

                signInSuccess = true;

                // document.querySelector(".container").style.display = "none";

                // await Swal.fire({
                //     icon: 'success',
                //     title: 'Logged In Successfully',
                //     showDenyButton: false,
                //     showCancelButton: false,
                //     showConfirmButton: false,
                //     allowOutsideClick: false,
                //     allowEscapeKey: false,
                //     allowEnterKey: false,
                //     footer: '<a href="/blog.html">Go to posts</a>'
                // });

                await Toast.fire({
                    icon: 'success',
                    title: 'Logged In'
                });
            } else if (res.status == 500) {
                openAlert("Internal server problem. Plase try again later!!");
            }
            localStorage.authToken = res.headers.get("Authorization");

            return res.json();
        })
        .then((data) => {
            if (signInSuccess) {
                console.log(data.message);
                localStorage.username = data.username;
                localStorage.pfp = data.pfp;

                allPosts()
            }
        });
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
            window.location.href = "../blog.html";
        });
}

// function myPosts() {
//     fetch("/blog/myposts", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `${localStorage.authToken}`,
//         },
//     })
//         .then((res) => {
//             return res.json();
//         })
//         .then((data) => {
//             console.log(data);
//             localStorage.postsData = JSON.stringify(data);
//             window.location.href = "blog.html";
//         });
// }
