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

function updateToko(idToko, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/toko/${idToko}`,
        type: "PUT",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {getToko, createToko, updateToko};