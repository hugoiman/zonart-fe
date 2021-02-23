import loadMainStore from "../../general/mainStore.js";
import {alertFailed} from "../../general/swalert.js";
import {updateFaq} from "../../request/faq.js";

const loadFaq = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-faq").addClass("active");
        const slugToko = await getUrlPath(2);
        document.getElementById('faq-list').href = `/faq/${slugToko}`;
        const idFaq = await getUrlPath(3);
        let result = await getFaq(idFaq);
        
        $('#select-kategori').val(`${result.idFaq}`).trigger('change');
        document.getElementById("pertanyaan").value = result.pertanyaan;
        $('#jawaban').summernote('code', result.jawaban);
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

const editFaq = async () => {
    try {
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
        let result = await updateFaq(idToko, jsonData);
        alertSuccess(result.message);
    } catch(error) {
        alertFailed(error, false);
    }
}

window.displayCustom = displayCustom;
window.displaySelect = displaySelect;
window.editFaq = editFaq;