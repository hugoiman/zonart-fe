import {baseURL, token} from "../general/env.js";

function deleteRekening(idToko, idRekening) {
    let result = $.ajax({
        url: `${baseURL}/api/rekening/${idToko}/${idRekening}`,
        type: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export default deleteRekening;