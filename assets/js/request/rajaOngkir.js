import {baseURL} from "../general/env.js";

function getAllCity() {
    let result = $.ajax({
        url: `${baseURL}/api/getKota`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export default getAllCity;