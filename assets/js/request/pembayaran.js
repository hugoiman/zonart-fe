import {baseURL, token} from "../general/env.js";

function createPembayaran(idOrder, formData) {
    let result = $.ajax({
        url: `${baseURL}/api/pembayaran/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: formData,
        processData: false,
        contentType: false,
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const pembayaran = {
    createPembayaran,
}

export default pembayaran;