import {baseURL, token} from "../general/env.js";

function createBiayaTambahan(idToko, idOrder, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/biaya-tambahan/${idToko}/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function deleteBiayaTambahan(idToko, idOrder, idBiayaTambahan) {
    let result = $.ajax({
        url: `${baseURL}/api/biaya-tambahan/${idToko}/${idOrder}/${idBiayaTambahan}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const bt = {
    createBiayaTambahan,
    deleteBiayaTambahan,
}

export default bt;
