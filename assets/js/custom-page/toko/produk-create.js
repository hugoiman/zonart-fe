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

const buatProduk = async () => {
    try {
        let idToko = document.getElementById("idToko").value;
        let slugToko = await getUrlPath(1);
        let namaProduk = document.getElementById("namaProduk").value;
        let berat = parseInt(document.getElementById("berat-cetak").value.replace(".", ""));
        let hargaWajah = parseInt(document.getElementById("hargaWajah").value.replace(".", ""));
        let deskripsi = document.getElementById("deskripsi").value;
        let catatan = document.getElementById("catatan").value;
        let status = "aktif";
        let jenisPemesanan = [
            {"idJenisPemesanan" : 1, "harga" : parseInt(document.getElementById("harga-cetak").value.replace(".", "")), "status" : document.getElementById("status-cetak").checked},
            {"idJenisPemesanan" : 2, "harga" : parseInt(document.getElementById("harga-softcopy").value.replace(".", "")), "status" : document.getElementById("status-softcopy").checked}
        ]

        let formData = new FormData();
        let image = $("#foto")[0].files[0];
        formData.append("file", image);
        formData.append("folder", "zonart/produk");
        var allowedExtensions =  /(\.jpg|\.jpeg|\.png)$/i;
        let validasiGambar = await validateFile(document.getElementById("foto"), allowedExtensions);
        let resultUpload = await cloudinary.uploadFile(formData);
        let gambar = resultUpload.data["secure_url"];

        let jsonData = JSON.stringify({
            namaProduk, berat, gambar, deskripsi, catatan, hargaWajah, status, jenisPemesanan,
        });
        let result = await createProduk(idToko, jsonData);
        alertSuccess(result.message);
        await setTimeout(() => {
            window.location.href = `/${slugToko}/produk/${result.produk}`
        }, 4000);
        
    } catch(error) {
        alertFailed(error, false)
    }
}

window.toggleCetak = toggleCetak;
window.toggleSoftCopy = toggleSoftCopy;
window.buatProduk = buatProduk;