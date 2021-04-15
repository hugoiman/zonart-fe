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
    maxFilesize: 5,
    maxFiles: 10,
    parallelUploads: 10,
    acceptedFiles: "image/*",
    url: cloudinary.CLOUDINARY_URL,
});
  
dropzone.on('sending', function (file, xhr, formData) {
    formData.append("folder", "zonart/galeri");
    formData.append('upload_preset', cloudinary.CLOUDINARY_UPLOAD_PRESET);
});

dropzone.on('success', async function (file, response) {
    try {
        let idToko = document.getElementById("idToko").value;
        let idProduk = parseInt(document.getElementById("kategori").value);
        let gambar = response.secure_url;
        let jsonData = JSON.stringify({
            idProduk, gambar,
        });
        let result = await createGaleri(idToko, jsonData);
        alertSuccess(result.message);
    } catch(error) {
        alertFailed(error, false)
    }
});

dropzone.on('error', function (file, response) {
    $(file.previewElement).find('.dz-error-message').text(response);
    alertFailed(response);
});

const addGaleri = async () => {
    try {
        let idProduk = parseInt(document.getElementById("kategori").value);
        if (isNaN(idProduk)) {
            throw "Silahkan pilih kategori produk.";
        } else if (dropzone.files.length === 0) {
            throw "Silahkan masukan gambar.";
        }
        dropzone.processQueue();
    } catch (error) {
        alertFailed(error, false)
    }
}

window.addGaleri = addGaleri;