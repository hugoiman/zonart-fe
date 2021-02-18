import {register} from "../request/auth.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";

const registerCustomer = async (username, email, nama, password) => {
    try {
        const result = await register(username, email, nama, password);
        document.getElementsByName("nama")[0].value = "";
        document.getElementsByName("username")[0].value = "";
        document.getElementsByName("email")[0].value = "";
        document.getElementsByName("password")[0].value = "";
        document.getElementsByName("password2")[0].value = "";
        alertSuccess(result.message, 3000);
        window.location.href = "/login";
    } catch(error) {
        alertFailed(error);
    }
}

document.getElementById("register").onsubmit = function(event) {
    let nama = document.getElementsByName("nama")[0].value;
    let username = document.getElementsByName("username")[0].value;
    let email = document.getElementsByName("email")[0].value;
    let password = document.getElementsByName("password")[0].value;
    let password2 = document.getElementsByName("password2")[0].value;

    if (password !== password2) {
        alertFailed("Konfirmasi password tidak sama. Mohon ulangi.")
    } else {
        registerCustomer(username, email, nama, password);
    }

    event.preventDefault();

}