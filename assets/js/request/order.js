import {baseURL, token} from "../general/env.js";

function getOrder(idOrder) {
    let result = $.ajax({
        url: `${baseURL}/api/order/${idOrder}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function getOrderToko(idToko, idOrder) {
    let result = $.ajax({
        url: `${baseURL}/api/order-toko/${idToko}/${idOrder}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function prosesPesanan(idToko, idOrder) {
    let result = $.ajax({
        url: `${baseURL}/api/order-proses/${idToko}/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function selesaikanPesanan(idToko, idOrder) {
    let result = $.ajax({
        url: `${baseURL}/api/order-selesai/${idToko}/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function setWaktuPengerjaan(idToko, idOrder, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/order-waktu/${idToko}/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function uploadHasilOrder(idOrder, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/order-hasil/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function setPenanganOrder(idToko, idOrder, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/penangan/${idToko}/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function sendRevisi(idOrder, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/revisi/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const order = {
    getOrder, getOrderToko, prosesPesanan, selesaikanPesanan, setWaktuPengerjaan, uploadHasilOrder,
    setPenanganOrder, sendRevisi,
}

export default order;