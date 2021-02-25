import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed} from "../../general/swalert.js";
import {getProduk, updateProduk} from "../../request/produk.js";
import cloudinary from "../../request/cloudinary.js";
import validateFile from "../../general/validateFile.js";
import {getUrlPath} from "../../general/general.js";

const loadForm = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-produk").addClass("active");
        let idToko = await document.getElementById("idToko").value;
        let produk = await getUrlPath(3);
        let result = await getProduk(idToko, produk)
        document.getElementById('idProduk').value = result.idProduk;
        document.getElementById('namaProduk').value = result.namaProduk;
        document.getElementById('berat-cetak').value = result.berat;
        document.getElementById('harga-cetak').value = result.jenisPemesanan[0].harga;
        document.getElementById('harga-softcopy').value = result.jenisPemesanan[1].harga;
        document.getElementById('hargaWajah').value = result.hargaWajah;
        $('#deskripsi').summernote('code',result.deskripsi);
        $('#catatan').summernote('code',result.catatan);
        let htmlImage = `<img src="${result.gambar}" id="image" class="rounded mx-auto d-block" width="200" alt="...">`;
        document.getElementById("display-image").innerHTML = htmlImage;
        document.getElementById('status-cetak').checked = result.jenisPemesanan[0].status;
        document.getElementById('status-softcopy').checked = result.jenisPemesanan[1].status;
        $('#status').val(result.status).selectric('refresh');
        
        var formCetak = document.getElementById('form-cetak');
        if (result.jenisPemesanan[0].status === true) {
            formCetak.style.display = "block";
        }

        var formSoftCopy = document.getElementById('form-softcopy');
        if (result.jenisPemesanan[1].status === true) {
            formSoftCopy.style.display = "block";
        }

        $('.currency').toArray().forEach(function(field){
                new Cleave(field, {
                numeral: true,
                numeralDecimalMark: 'thousand',
                delimiter: '.',
            })
        });
    } catch(error) {
        alertFailed(error, false);
    }
}
loadForm();

var loadImage = function(event) {
	var image = document.getElementById('image');
	image.src = URL.createObjectURL(event.target.files[0]);
};

function toggleCetak() {
    var x = document.getElementById("form-cetak");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function toggleSoftCopy() {
    var x = document.getElementById("form-softcopy");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

const ubahProduk = async () => {
    try {
        let idToko = document.getElementById("idToko").value;
        let slugToko = await getUrlPath(2);
        let idProduk = document.getElementById("idProduk").value;
        let namaProduk = document.getElementById("namaProduk").value;
        let berat = parseInt(document.getElementById("berat-cetak").value.replace(".", ""));
        let hargaWajah = parseInt(document.getElementById("hargaWajah").value.replace(".", ""));
        let deskripsi = document.getElementById("deskripsi").value;
        let catatan = document.getElementById("catatan").value;
        let status = document.getElementById("status").value;
        let gambar = "";
        let jenisPemesanan = [
            {"idJenisPemesanan" : 1, "harga" : parseInt(document.getElementById("harga-cetak").value.replace(".", "")), "status" : document.getElementById("status-cetak").checked},
            {"idJenisPemesanan" : 2, "harga" : parseInt(document.getElementById("harga-softcopy").value.replace(".", "")), "status" : document.getElementById("status-softcopy").checked}
        ]

        if(document.getElementById("gambar").files.length != 0) {
            let formData = new FormData();
            let image = $("#gambar")[0].files[0];
            formData.append("file", image);
            formData.append("folder", "zonart/produk");
            var allowedExtensions =  /(\.jpg|\.jpeg|\.png)$/i;
            let validasiGambar = await validateFile(document.getElementById("gambar"), allowedExtensions);
            let resultUpload = await cloudinary.uploadFile(formData);
            gambar = resultUpload.data["secure_url"];
        } else {
            gambar = $('#image').attr('src');
        }

        let jsonData = JSON.stringify({
            namaProduk, berat, gambar, deskripsi, catatan, hargaWajah, status, jenisPemesanan,
        });
        let result = await updateProduk(idToko, idProduk, jsonData);
        alertSuccess(result.message);
        
        await setTimeout(() => {
            window.location.href = `/produk/${slugToko}/${result.produk}`
        }, 4000);
        
    } catch(error) {
        alertFailed(error, false)
    }
}

window.loadImage = loadImage;
window.toggleCetak = toggleCetak;
window.toggleSoftCopy = toggleSoftCopy;
window.ubahProduk = ubahProduk;