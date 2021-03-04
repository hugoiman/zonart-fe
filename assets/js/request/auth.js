import {baseURL} from "../general/env.js";

function login(jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/login`,
        type: "POST",
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });

    return result;
}

function register(username, email, nama, password) {
    let jsonData = JSON.stringify({
        username,
        email,
        nama,
        password,
    });
    let result = $.ajax({
        url: `${baseURL}/api/register`,
        type: "POST",
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function resetPassword(email, newPassword) {
    let jsonData = JSON.stringify({
        email,
        newPassword,
    });
    let result = $.ajax({
        url: `${baseURL}/api/reset-password`,
        type: "POST",
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function verificationResetPassword(token) {
    let jsonData = JSON.stringify({
        token,
    });
    let result = $.ajax({
        url: `${baseURL}/api/verification-reset-password`,
        type: "POST",
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {login, register, resetPassword, verificationResetPassword};