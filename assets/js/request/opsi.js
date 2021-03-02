import {baseURL, token} from "../general/env.js";

function deleteOpsi(idToko, idGrupOpsi, idOpsi) {
    let result = $.ajax({
        url: `${baseURL}/api/opsi/${idToko}/${idGrupOpsi}/${idOpsi}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export default deleteOpsi;