import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed} from "../../general/swalert.js";
import {getDaftarProduk} from "../../request/produk.js";
import cloudinary from "../../request/cloudinary.js";
import {createGaleri} from "../../request/galeri.js";

const loadFormGaleri = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-galeri").addClass("active");
        let idToko = document.getElementById("idToko").value;
        const produks = await getDaftarProduk(idToko);
        let htmlKategori = `<option value=""></option>`;
        produks.produk.forEach(v => {
            htmlKategori += `<option value="${v.idProduk}">${v.namaProduk}</option>`;
        })
        document.getElementById("kategori").innerHTML = htmlKategori;
    } catch(error) {
        alertFailed(error);
    }
}
loadFormGaleri();

var dropzone = new Dropzone("#mydropzone", {
    autoProcessQueue: false,
    // maxFilesize: 2,
    // maxFiles: 10,
    // parallelUploads: 10,
    acceptedFiles: "image/*",
    // url: cloudinary.CLOUDINARY_URL,
});
  
dropzone.on('sending', function (file, xhr, formData) {
    formData.append('gambar', file);
    // formData.append("folder", "zonart/galeri");
    // formData.append('upload_preset', cloudinary.CLOUDINARY_UPLOAD_PRESET);
});

// dropzone.on('success', async function (file, response) {
//     try {
//         let idToko = document.getElementById("idToko").value;
//         let idProduk = parseInt(document.getElementById("kategori").value);
//         let gambar = response.secure_url
//         let result = await createGaleri(idToko, jsonData);
//         alertSuccess(result.message);
//     } catch(error) {
//         alertFailed(error, false)
//     }
// });

// dropzone.on('error', function (file, response) {
//     $(file.previewElement).find('.dz-error-message').text(response);
//     // dropzone.removeFile(file);
//     alertFailed(response, false);
// });

// dropzone.on('complete',  function (file) {
//     if (dropzone.getUploadingFiles().length === 0 && dropzone.getQueuedFiles().length === 0) {
//     }
// });

const addGaleri = async () => {
    let originalBtn = $('#btn-create-galeri').html();
    try {
        // add spinner to button
        $('#btn-create-galeri').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`).prop("disabled", true);
        let idProduk = parseInt(document.getElementById("kategori").value);
        let idToko = document.getElementById("idToko").value;
        // dropzone.processQueue();
        let formData = new FormData();
        formData.append('payload', JSON.stringify({"idKategori":idProduk}))
        var images = dropzone.files.length;
        for (var i = 0; i < images; i++) {
            formData.append("gambar", dropzone.files[i]);
        }
        let resp = await createGaleri(idToko, formData)
        alertSuccess(resp.message)
    } catch (error) {
        alertFailed(error, false)
    } finally {
        dropzone.removeAllFiles(true)
        $('#btn-create-galeri').html(originalBtn).prop('disabled', false)
    }
}

window.addGaleri = addGaleri;