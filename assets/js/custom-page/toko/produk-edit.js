import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed} from "../../general/swalert.js";
import {getProduk, updateProduk} from "../../request/produk.js";
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
        console.log(error);
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
    let originalBtn = $('#btn-update-produk').html();
    try {
        $('#btn-update-produk').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`).prop("disabled", true);
        let idToko = document.getElementById("idToko").value;
        let slugToko = await getUrlPath(1);
        let idProduk = document.getElementById("idProduk").value;
        let namaProduk = document.getElementById("namaProduk").value;
        let berat = parseInt(document.getElementById("berat-cetak").value.replaceAll(".", ""));
        let hargaWajah = parseInt(document.getElementById("hargaWajah").value.replaceAll(".", ""));
        let deskripsi = document.getElementById("deskripsi").value;
        let catatan = document.getElementById("catatan").value;
        let status = document.getElementById("status").value;
        let gambar = "";
        let jenisPemesanan = [
            {"idJenisPemesanan" : 1, "harga" : parseInt(document.getElementById("harga-cetak").value.replaceAll(".", "")), "status" : document.getElementById("status-cetak").checked},
            {"idJenisPemesanan" : 2, "harga" : parseInt(document.getElementById("harga-softcopy").value.replaceAll(".", "")), "status" : document.getElementById("status-softcopy").checked}
        ]

        let formData = new FormData();
        if(document.getElementById("gambar").files.length != 0) {
            let image = $("#gambar")[0].files[0];
            formData.append('gambar', image);
        } else {
            gambar = $('#image').attr('src');
        }
        formData.append('payload', JSON.stringify({
            namaProduk, berat, gambar, deskripsi, catatan, hargaWajah, status, jenisPemesanan,
        }))

        let result = await updateProduk(idToko, idProduk, formData);
        alertSuccess(result.message);
        
        await setTimeout(() => {
            window.location.href = `/${slugToko}/produk/${result.produk}`
        }, 4000);
        
    } catch(error) {
        alertFailed(error, false)
    } finally {
        $('#btn-update-produk').html(originalBtn).prop('disabled', false)
    }
}

window.loadImage = loadImage;
window.toggleCetak = toggleCetak;
window.toggleSoftCopy = toggleSoftCopy;
window.ubahProduk = ubahProduk;