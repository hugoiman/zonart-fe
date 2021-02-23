import {baseURL, token} from "../general/env.js";

function getDaftarFaq(toko) {
    let result = $.ajax({
        url: `${baseURL}/api/faq/${toko}`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function createFaq(toko, jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/faq/${toko}`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function deleteFaq(toko, idFaq) {
    let result = $.ajax({
        url: `${baseURL}/api/faq/${toko}/${idFaq}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {getDaftarFaq, createFaq, deleteFaq};