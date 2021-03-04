import {getCustomer} from "../request/customer.js";
import {alertFailed} from "../general/swalert.js";
import {login} from "../request/auth.js";

const getData = async () => {
    try {
        const data = await getCustomer();
        window.location.href = "/pengaturan";
    } catch {
        console.log("belum login");
    }
}

getData();

const signin = async () => {
    try {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        let jsonData = JSON.stringify({
            username,
            password,
        });

        let result = await login(jsonData);
        Cookies.set("token", result.token, { expires: 7, path: "/" });
        window.location.href = "/pengaturan";
    } catch(error) {
        alertFailed(error, false);
    }
}

window.signin = signin;
