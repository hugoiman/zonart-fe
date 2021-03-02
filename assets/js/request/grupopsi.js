import {baseURL, token} from "../general/env.js";

function getDaftarGrupOpsi(toko) {
    let result = $.ajax({
        url: `${baseURL}/api/grup-opsi/${toko}`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function getGrupOpsi(idToko, idGrupOpsi) {
    let result = $.ajax({
        url: `${baseURL}/api/grup-opsi/${idToko}/${idGrupOpsi}`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function createGrupOpsi(idToko, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/grup-opsi/${idToko}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function updateGrupOpsi(idToko, idGrupOpsi, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/grup-opsi/${idToko}/${idGrupOpsi}`,
        type: "PUT",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function deleteGrupOpsi(toko, idGrupOpsi) {
    let result = $.ajax({
        url: `${baseURL}/api/grup-opsi/${toko}/${idGrupOpsi}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const grupOpsi = {
    getDaftarGrupOpsi,
    getGrupOpsi,
    createGrupOpsi, 
    updateGrupOpsi,
    deleteGrupOpsi, 
}
export default grupOpsi;