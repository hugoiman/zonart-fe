import loadMain from "../general/main.js";
import {changePassword} from "../request/customer.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";

const loadPassword = async () => {
    try {
        const loadmain = await loadMain();
    } catch(error) {
        alertFailed(error);
    }
}
loadPassword();

const gantiPassword = async (oldPassword, newPassword) => {
    try {
        const result = await changePassword(oldPassword, newPassword);
        document.getElementsByName("oldPassword")[0].value = "";
        document.getElementsByName("newPassword")[0].value = "";
        document.getElementsByName("confirmPassword")[0].value = "";
        alertSuccess(result.message);
    } catch(error) {
        alertFailed(error);
    }
}

document.getElementById("change-password").onsubmit = function(event) {
    let oldPassword = document.getElementsByName("oldPassword")[0].value;
    let newPassword = document.getElementsByName("newPassword")[0].value;
    let confirmPassword = document.getElementsByName("confirmPassword")[0].value;

    if (newPassword !== confirmPassword) {
        alertFailed("Konfirmasi password tidak sama. Mohon ulangi.")
    } else {
        gantiPassword(oldPassword, newPassword);
    }

    event.preventDefault();
}