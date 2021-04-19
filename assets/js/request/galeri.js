import {baseURL, token} from "../general/env.js";

function getDaftarGaleri(toko) {
    let result = $.ajax({
        url: `${baseURL}/api/galeri/${toko}`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function createGaleri(toko, formData) {
    let result = $.ajax({
        url: `${baseURL}/api/galeri/${toko}`,
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

function deleteGaleri(toko, idGaleri) {
    let result = $.ajax({
        url: `${baseURL}/api/galeri/${toko}/${idGaleri}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {getDaftarGaleri, createGaleri, deleteGaleri};