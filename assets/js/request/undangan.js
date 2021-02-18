import {baseURL, token} from "../general/env.js";

function getUndangan(idUndangan) {
    let result = $.ajax({
        url: `${baseURL}/api/undangan/${idUndangan}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function getDaftarUndangan(toko) {
    let result = $.ajax({
        url: `${baseURL}/api/daftar-undangan/${toko}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function batalkanUndangan(toko, idUndangan) {
    let result = $.ajax({
        url: `${baseURL}/api/undangan-batal/${toko}/${idUndangan}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function tolakUndangan(idUndangan) {
    let result = $.ajax({
        url: `${baseURL}/api/undangan-tolak/${idUndangan}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function terimaUndangan(idUndangan) {
    let result = $.ajax({
        url: `${baseURL}/api/undangan-terima/${idUndangan}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {getUndangan, getDaftarUndangan, batalkanUndangan, tolakUndangan, terimaUndangan};