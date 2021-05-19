import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed} from "../../general/swalert.js";
import {createFaq} from "../../request/faq.js";

const loadFaq = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-faq").addClass("active");
    } catch(error) {
        alertFailed(error);
    }
}
loadFaq();

function displayCustom() {
    $('.comp-select').hide();
    document.getElementById("select-kategori").selectedIndex = 0;
    $(".comp-custom:hidden").show();
}

function displaySelect() {
    $('.comp-select').show();
    document.getElementById("kategori").value = "";
    $(".comp-custom").hide();
}

const addFaq = async () => {
    let originalBtn = $('#btn-create-faq').html();
    try {
        $('#btn-create-faq').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`).prop("disabled", true);
        let idToko = document.getElementById("idToko").value;
        let kategori = document.getElementsByName("kategori")[0].value;
        if (kategori == "") {
            kategori = document.getElementsByName("kategori")[1].value
        }
        let pertanyaan = document.getElementById("pertanyaan").value;
        let jawaban = document.getElementById("jawaban").value;
        let jsonData = JSON.stringify({
            kategori, pertanyaan, jawaban,
        });
        let result = await createFaq(idToko, jsonData);
        alertSuccess(result.message);
        $('#select-kategori').val('').trigger('change');
        document.getElementsByName("kategori")[1].value = '';
        document.getElementById("pertanyaan").value = '';
        $('#jawaban').summernote('reset');
        
    } catch(error) {
        alertFailed(error, false);
    } finally {
        $('#btn-create-faq').html(originalBtn).prop('disabled', false)
    }
}

window.displayCustom = displayCustom;
window.displaySelect = displaySelect;
window.addFaq = addFaq;