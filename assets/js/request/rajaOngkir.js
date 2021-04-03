import {baseURL, token} from "../general/env.js";

function getAllCity() {
    let result = $.ajax({
        url: `${baseURL}/api/raja-ongkir/city`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function getCost(jsonData) {
    let result = $.ajax({
        url: `${baseURL}/api/raja-ongkir/cost`,
        type: "POST",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

const rajaOngkir = {
    getAllCity, getCost,
}

export default rajaOngkir;