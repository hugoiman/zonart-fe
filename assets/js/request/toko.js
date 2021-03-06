import {baseURL, token} from "../general/env.js";

function getToko(id) {
    let result = $.ajax({
        url: `${baseURL}/api/toko/${id}`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function createToko(jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/toko`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function updateToko(idToko, formData) {
    let result = $.ajax({
        url: `${baseURL}/api/toko/${idToko}`,
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

function getTokos() {
    let result = $.ajax({
        url: `${baseURL}/api/toko`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {getToko, getTokos, createToko, updateToko};