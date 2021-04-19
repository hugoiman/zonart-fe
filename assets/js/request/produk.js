import {baseURL, token} from "../general/env.js";

function getProduk(toko, idProduk) {
    let result = $.ajax({
        url: `${baseURL}/api/produk/${toko}/${idProduk}`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function getDaftarProduk(toko) {
    let result = $.ajax({
        url: `${baseURL}/api/produk/${toko}`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function createProduk(toko, formData) {
    let result = $.ajax({
        url: `${baseURL}/api/produk/${toko}`,
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

function updateProduk(toko, idProduk, formData) {
    let result = $.ajax({
        url: `${baseURL}/api/produk/${toko}/${idProduk}`,
        type: "PUT",
        headers: { Authorization: `Bearer ${token}`},
        data: formData,
        processData: false,
        contentType: false,
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function deleteProduk(toko, idProduk) {
    let result = $.ajax({
        url: `${baseURL}/api/produk/${toko}/${idProduk}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {getProduk, getDaftarProduk, createProduk, updateProduk, deleteProduk};