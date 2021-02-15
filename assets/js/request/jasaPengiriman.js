import {baseURL} from "../general/env.js";

function getAllKurir() {
    let result = $.ajax({
        url: `${baseURL}/api/kurir`,
        type: "GET",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export default getAllKurir;