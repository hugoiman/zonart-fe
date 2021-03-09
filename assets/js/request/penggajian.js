import {baseURL, token} from "../general/env.js";

function getDaftarGaji(idToko) {
    let result = $.ajax({
        url: `${baseURL}/api/gaji/${idToko}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function createGaji(idToko, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/gaji/${idToko}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function deleteGaji(idToko, idGaji) {
    let result = $.ajax({
        url: `${baseURL}/api/gaji/${idToko}/${idGaji}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const gaji = {
    getDaftarGaji,
    createGaji,
    deleteGaji,
}

export default gaji;