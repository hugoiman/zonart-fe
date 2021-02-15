import {getCustomer} from "../request/customer.js";
import {baseURL} from "../general/env.js";
import {alertFailed} from "../general/swalert.js";

const getData = async () => {
    try {
        const data = await getCustomer();
        window.location.href = "/pengaturan";
    } catch {
        console.log("belum login");
    }
}

getData();

document.getElementById("login").onsubmit = function(event) {
    let username = document.getElementsByName("username")[0].value;
    let password = document.getElementsByName("password")[0].value;

    let jsonData = JSON.stringify({
        username,
        password,
    });

    $.ajax({
        url: `${baseURL}/api/login`,
        type: "POST",
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {
            Cookies.set("token", resp.token, { expires: 7, path: "/" });
            window.location.href = "/pengaturan";
        },
        error: function (error) {
            alertFailed(error.responseText, false);
        },
    });

    event.preventDefault();
}
