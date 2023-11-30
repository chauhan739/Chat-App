const forgetPasswordForm = document.getElementById("forget-password-form");
const emailForgetPassword = document.getElementById("email-forget-password");
const sendOTPButton = document.getElementById("send-otp-button");
const otpContainer = document.getElementById("otp-container");
const otpInputContainer = document.getElementById("otp-input-container");
const otpInputs = Array.from(document.querySelectorAll(".otp-input"));
const verifyOTPButton = document.getElementById("verify-otp-button");
const resendOTPButton = document.getElementById("resend-otp-button");
const newPasswordContainer = document.getElementById("new-password-container");
const newPassword = document.getElementById("new-password");
const resetPasswordButton = document.getElementById("reset-password");

function resetForgetPasswordForm() {
    [emailForgetPassword].forEach((input) => {
        input.value = "";
        input.disabled = false;
    });

    sendOTPButton.disabled = false;

    otpContainer.style.display = "none";
    [otpInputs].forEach((input) => {
        input.value = "";
        input.disabled = false;
    });
    otpButtons.style.display = "none";

    newPasswordContainer.style.display = "none";
    document.getElementById("new-password").value = "";
}

emailForgetPassword.addEventListener("input", () => {
    toggleButtonState(sendOTPButton, [emailForgetPassword]);
});

function toggleButtonState(button, inputs) {
    const allFilled = inputs.every((input) => input.value.trim() !== "");
    button.disabled = !allFilled;
}

function resendOTP() {
    fetch("/user/resend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailForgetPassword.value }),
    }).then((res) => {
        if (res.status == 200) {
            alert("OTP sent");
            emailForgetPassword.disabled = true;
            otpContainer.style.display = "block";
            // sendOTPButton.disabled = true;
            sendOTPButton.innerText = "Resend OTP";
            newPasswordContainer.style.display = "block";
        } else if (res.status == 500) {
            alert("Internal server problem. Plase try again later!!");
            return;
        } else if (res.status == 404) {
            alert("Invalid email");
            return;
        }
    });
}

function resetPassword() {
    let otp = "";
    otpInputs.forEach((input) => {
        otp += input.value;
    });

    const resetPasswordData = {
        email: emailForgetPassword.value,
        newpassword: newPassword.value,
        enteredotp: otp,
    };

    console.log(resetPasswordData);

    fetch("/user/resetpassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resetPasswordData),
    })
        .then((res) => {
            if (res.status == 404) alert("No otp is linked with the email");
            else if (res.status == 403) alert("Incorrect OTP");
            else if (res.status == 200) {
                alert(
                    "Password updated successfully. Please proceed to sign in"
                );
                window.location.href = "welcome.html";
            }

            return res.json();
        })
        .then((data) => console.log(data));
}
