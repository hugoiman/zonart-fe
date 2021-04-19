import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed} from "../../general/swalert.js";
import {createProduk} from "../../request/produk.js";
import cloudinary from "../../request/cloudinary.js";
import validateFile from "../../general/validateFile.js";
import {getUrlPath} from "../../general/general.js";

const loadForm = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-produk").addClass("active");

        $.uploadPreview({
            input_field: "#foto",   // Default: .image-upload
            preview_box: "#image-preview",  // Default: .image-preview
            label_field: "#image-label",    // Default: .image-label
            label_default: "Choose File",   // Default: Choose File
            label_selected: "Change File",  // Default: Change File
            no_label: false,                // Default: false
            success_callback: null          // Default: null
        });

        $('.currency').toArray().forEach(function(field){
                new Cleave(field, {
                numeral: true,
                numeralDecimalMark: 'thousand',
                delimiter: '.',
            })
        });
        

    } catch(error) {
        alertFailed(error, failed);
    }
}
loadForm();

function toggleCetak() {
    var x = document.getElementById("form-cetak");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    $('#harga-cetak').val(0);
    $('#berat-cetak').val(0);
}

function toggleSoftCopy() {
    var x = document.getElementById("form-softcopy");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    $('#harga-softcopy').val(0);
}

let originalBtn = $('#btn-create-produk').html();
const buatProduk = async () => {
    try {
        $('#btn-create-produk').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`).prop("disabled", true);
        let idToko = document.getElementById("idToko").value;
        let slugToko = await getUrlPath(1);
        let namaProduk = document.getElementById("namaProduk").value;
        let berat = parseInt(document.getElementById("berat-cetak").value.replaceAll(".", ""));
        let hargaWajah = parseInt(document.getElementById("hargaWajah").value.replaceAll(".", ""));
        let deskripsi = document.getElementById("deskripsi").value;
        let catatan = document.getElementById("catatan").value;
        let status = "aktif";
        let jenisPemesanan = [
            {"idJenisPemesanan" : 1, "harga" : parseInt(document.getElementById("harga-cetak").value.replaceAll(".", "")), "status" : document.getElementById("status-cetak").checked},
            {"idJenisPemesanan" : 2, "harga" : parseInt(document.getElementById("harga-softcopy").value.replaceAll(".", "")), "status" : document.getElementById("status-softcopy").checked}
        ]

        let formData = new FormData();
        let image = $("#foto")[0].files[0];
        formData.append('gambar', image);
        formData.append('payload', JSON.stringify({
            namaProduk, berat, deskripsi, catatan, hargaWajah, status, jenisPemesanan,
        }));

        let result = await createProduk(idToko, formData);
        alertSuccess(result.message);
        await setTimeout(() => {
            window.location.href = `/${slugToko}/produk/${result.produk}`
        }, 4000);
        
    } catch(error) {
        alertFailed(error, false)
    } finally {
        $('#btn-create-produk').html(originalBtn).prop('disabled', false)
    }
}

window.toggleCetak = toggleCetak;
window.toggleSoftCopy = toggleSoftCopy;
window.buatProduk = buatProduk;