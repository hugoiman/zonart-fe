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

function getOrders() {
    let result = $.ajax({
        url: `${baseURL}/api/order`,
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

function getOrdersToko(idToko) {
    let result = $.ajax({
        url: `${baseURL}/api/order-toko/${idToko}`,
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

function tolakPesanan(idToko, idOrder, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/order-tolak/${idToko}/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
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

function setujuiHasilOrder(idOrder) {
    let result = $.ajax({
        url: `${baseURL}/api/order-setujui/${idOrder}`,
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

function uploadHasilOrder(idToko, idOrder, formData) {
    let result = $.ajax({
        url: `${baseURL}/api/order-hasil/${idToko}/${idOrder}`,
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

function konfirmasiPembayaranOrder(idToko, idOrder, idPembayaran) {
    let result = $.ajax({
        url: `${baseURL}/api/pembayaran-konfirmasi/${idToko}/${idOrder}/${idPembayaran}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function cancelOrder(idOrder) {
    let result = $.ajax({
        url: `${baseURL}/api/order-batal/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function inputResi(idToko, idOrder, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/resi/${idToko}/${idOrder}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function createOrder(idToko, idProduk, formData) {
    let result = $.ajax({
        url: `${baseURL}/api/order/${idToko}/${idProduk}`,
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

const order = {
    getOrder, getOrders, getOrderToko, getOrdersToko, prosesPesanan, tolakPesanan, selesaikanPesanan, setujuiHasilOrder, setWaktuPengerjaan, 
    uploadHasilOrder, setPenanganOrder, sendRevisi, konfirmasiPembayaranOrder, cancelOrder, inputResi, createOrder,
}

export default order;