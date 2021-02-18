import {verificationResetPassword} from "../request/auth.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {getUrlParameter} from "../general/general.js";

const verificationResetPass = async () => {
    try {
        let token = await getUrlParameter('token');
        const result = await verificationResetPassword(token);
        await alertSuccess(result.message);
    } catch(error) {
        await alertFailed(error);
    }

    setTimeout(() => {
        window.location.href = "/login";
    }, 5000)
}

verificationResetPass();