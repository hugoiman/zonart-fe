import {baseURL, token} from "../general/env.js";

function getDaftarPembukuan(idToko) {
    let result = $.ajax({
        url: `${baseURL}/api/pembukuan/${idToko}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function createPembukuan(idToko, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/pembukuan/${idToko}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function deletePembukuan(idToko, idPembukuan) {
    let result = $.ajax({
        url: `${baseURL}/api/pembukuan/${idToko}/${idPembukuan}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const pembukuan = {
    getDaftarPembukuan,
    createPembukuan,
    deletePembukuan,
}

export default pembukuan;