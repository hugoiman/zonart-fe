import {baseURL, token} from "../general/env.js";

function getSambunganGrupOpsi(idToko, idGrupOpsi) {
    let result = $.ajax({
        url: `${baseURL}/api/grup-opsi-produk/${idToko}/${idGrupOpsi}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function getSambunganGrupOpsiByProduk(idToko, idProduk) {
    let result = $.ajax({
        url: `${baseURL}/api/grup-opsi-produk-by-produk/${idToko}/${idProduk}`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function hubungkanGrupOpsi(idToko, idGrupOpsi, idProduk) {
    let result = $.ajax({
        url: `${baseURL}/api/grup-opsi/${idToko}/${idGrupOpsi}/${idProduk}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function putusSambunganGrupOpsi(idToko, idGrupOpsi, idProduk) {
    let result = $.ajax({
        url: `${baseURL}/api/grup-opsi/${idToko}/${idGrupOpsi}/${idProduk}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const grupOpsiProduk = {
    getSambunganGrupOpsi,
    getSambunganGrupOpsiByProduk,
    hubungkanGrupOpsi,
    putusSambunganGrupOpsi,
}

export default grupOpsiProduk;