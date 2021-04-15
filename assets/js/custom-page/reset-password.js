import {resetPassword} from "../request/auth.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";

const resetPass = async (email, newPassword) => {
    try {
        const result = await resetPassword(email, newPassword);
        document.getElementsByName("email")[0].value = "";
        document.getElementsByName("newPassword")[0].value = "";
        document.getElementsByName("confirmPassword")[0].value = "";
        alertSuccess(result.message);
    } catch(error) {
        alertFailed(error, false);
    }
}

document.getElementById("reset-password").onsubmit = function(event) {
    let email = document.getElementsByName("email")[0].value;
    let newPassword = document.getElementsByName("newPassword")[0].value;
    let confirmPassword = document.getElementsByName("confirmPassword")[0].value;

    if (newPassword !== confirmPassword) {
        alertFailed("Konfirmasi password tidak sama. Mohon ulangi.", false)
    } else {
        resetPass(email, newPassword);
    }

    event.preventDefault();
}