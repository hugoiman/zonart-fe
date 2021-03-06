import {baseURL, token} from "../general/env.js";

function getNotifikasi() {
    let result = $.ajax({
        url: `${baseURL}/api/notifikasi`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });

    return result;
}

function readNotifikasi() {
    let result = $.ajax({
        url: `${baseURL}/api/notifikasi`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {getNotifikasi, readNotifikasi};