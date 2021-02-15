import {baseURL, token} from "../general/env.js";

function getKaryawan(toko, idKaryawan) {
    let result = $.ajax({
        url: `${baseURL}/api/karyawan/${toko}/${idKaryawan}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function getAllKaryawan(toko) {
    let result = $.ajax({
        url: `${baseURL}/api/karyawan/${toko}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {getKaryawan, getAllKaryawan};