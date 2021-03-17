import {baseURL, token} from "../general/env.js";

function getInvoice(idInvoice) {
    let result = $.ajax({
        url: `${baseURL}/api/invoice/${idInvoice}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const invoice = {
    getInvoice,
}

export default invoice