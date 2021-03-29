import {baseURL, token} from "../general/env.js";

function createPembayaran(idOrder, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/pembayaran/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const pembayaran = {
    createPembayaran,
}

export default pembayaran;