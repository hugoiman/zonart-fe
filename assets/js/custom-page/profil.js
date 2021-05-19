import loadMain from "../general/main.js";
import {getCustomer, updateCustomer} from "../request/customer.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";

const loadProfil = async () => {
    try {
        const loadmain = await loadMain();
        const data = await getCustomer();
        document.getElementsByName("nama")[0].value = data.nama;
        document.getElementsByName("username")[0].value = data.username;
        document.getElementsByName("email")[0].value = data.email;
    } catch(error) {
        alertFailed(error);
    }
}
loadProfil();

const updateProfil = async (username, email, nama) => {
    let originalBtnUpdate = $('#btn-update').html();
    try {
        $('#btn-update').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`).prop("disabled", true);
        const result = await updateCustomer(username, email, nama);
        alertSuccess(result.message);
    } catch(error) {
        alertFailed(error);
    } finally {
        $('#btn-update').html(originalBtnUpdate).prop('disabled', false);
    }
}

document.getElementById("update-profil").onsubmit = function(event) {
    let nama = document.getElementsByName("nama")[0].value;
    let username = document.getElementsByName("username")[0].value;
    let email = document.getElementsByName("email")[0].value;

    updateProfil(username, email, nama);

    event.preventDefault();
}