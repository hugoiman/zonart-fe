import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {getUrlPath} from "../general/general.js";
import {getToko} from "../request/toko.js";
import { getProduk } from "../request/produk.js";
import { getDaftarGaleri } from "../request/galeri.js";

let dataToko;
const loadPage = async () => {
    const loadmain = await loadMain();
    const slugToko = await getUrlPath(1);
    const slugProduk = await getUrlPath(2);
    dataToko = await getToko(slugToko);
    document.getElementById('logo').src = dataToko.foto;
    document.getElementsByClassName('namaToko')[0].innerHTML = `<a href="/${dataToko.slug}">${dataToko.namaToko}</a>`

    const dataProduk = await getProduk(dataToko.idToko, slugProduk);
    displayProduk(dataProduk);
    const dataGaleri = await getDaftarGaleri(dataToko.idToko)
    displayGaleriProduk(dataGaleri, dataProduk.idProduk);
}
loadPage();

function displayProduk(dataProduk) {
    document.getElementById("cover-produk").querySelector('a').href = dataProduk.gambar;
    document.getElementById("cover-produk").querySelector('a > img').src = dataProduk.gambar;
    
    $("#cover-produk").lightGallery({
        thumbnail:true,
        animateThumb: false,
        showThumbByDefault: false,
    });

    const htmlInfoProduk = `<div class="row">
                                <h4>${dataProduk.namaProduk}</h4>
                            </div>
                            <div class="row">
                                <h3><i class="fa fa-inr" aria-hidden="true"></i>` + 
                                (dataProduk.jenisPemesanan[1].harga < dataProduk.jenisPemesanan[0].harga ? (dataProduk.jenisPemesanan[1].status == true ? `Rp <span class="nominal">${dataProduk.jenisPemesanan[1].harga}</span>` : ``) + `` + (dataProduk.jenisPemesanan[0].status == true ? ` - <span class="nominal">${dataProduk.jenisPemesanan[0].harga}</span>` : ``) :
                                (dataProduk.jenisPemesanan[0].status == true ? `Rp <span class="nominal">${dataProduk.jenisPemesanan[0].harga}</span>` : ``) + `` + (dataProduk.jenisPemesanan[1].status == true ? ` - <span class="nominal">${dataProduk.jenisPemesanan[1].harga}</span>` : ``) )+ `
                                </h3>
                            </div>
                            <div class="row">
                                <p>Berat:<strong> ${dataProduk.berat} </strong> Gram</p>
                            </div>`;
    document.getElementById('info-produk').innerHTML = htmlInfoProduk;
    $(".nominal").mask('000.000.000', {reverse: true});

    document.getElementById('deskripsi').innerHTML = dataProduk.deskripsi;
    document.getElementById('catatan').innerHTML = dataProduk.catatan;
}

function displayGaleriProduk(dataGaleri, idProduk){
    let galeriProduk = _.remove(dataGaleri.galeri, function(n) {
        return n.idProduk == idProduk;
    });
    let el = document.getElementById("gallery-produk");
    let htmlGaleri = ``;
    $.each(galeriProduk, function(idx, v) {
        if(idx < 3 || galeriProduk.length == 4) {
            htmlGaleri +=   `<a href="${v.gambar.replace('upload/', 'upload/fl_attachment/')}" class="lightgallery-image">
                                <img class="gallery-item" src="${v.gambar}">
                            </a>`;
        } else if(idx == 3) {
            htmlGaleri +=   `<a href="${v.gambar.replace('upload/', 'upload/fl_attachment/')}" class="lightgallery-image">
                                <div class="gallery-item gallery-more" src="${v.gambar}">
                                    <div id="galeri-sisa"></div>
                                </div>
                            </a>`;
        } else {
            htmlGaleri +=   `<a href="${v.gambar.replace('upload/', 'upload/fl_attachment/')}" class="lightgallery-image">
                                <img class="gallery-item gallery-hide" src="${v.gambar}">
                            </a>`
        }
    });

    if ($(".lightgallery-image").length != 0) {
        $("#gallery-produk").data('lightGallery').destroy(true);
    }

    el.innerHTML = htmlGaleri
    if (galeriProduk.length > 4) {
        $('#galeri-sisa').text(`+${galeriProduk.length-3}`);
    }
    $("#gallery-produk").lightGallery({
        thumbnail:true,
    }); 
}

function modalInfoToko() {
    let kurir = [];
    dataToko.jasaPengirimanToko.forEach(v => {
        kurir.push(v.kurir);
    });

    let htmlInfo = document.createElement('div');
    htmlInfo.innerHTML = `<div class="modal fade" tabindex="-1" role="dialog" id="modal-infotoko">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Info Toko</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p><b>Deskripsi</b><br>${dataToko.deskripsi}</p>
                                <p><b>Kontak</b><br>` + 
                                    (dataToko.instagram != "" ? `<a href="instagram.com/${dataToko.instagram}"><i class="fab fa-instagram"></i> @${dataToko.instagram}</a>` : ``)+
                                    (dataToko.whatsapp != "" ? `<br><a><i class="fab fa-whatsapp"></i> ${dataToko.whatsapp}</a>` : ``) +
                                    (dataToko.emailToko != "" ? `<br><a><i class="fab fa-google"></i> ${dataToko.emailToko}</a>` : ``) +
                                    (dataToko.website != "" ? `<br><a><i class="fas fa-globe"></i> ${dataToko.website}</a>` : ``) + `
                                </p>
                                <p><b>Alamat Toko</b><br>${dataToko.alamat}, ${dataToko.kota}</p>
                                <p><b>Bergabung Sejak</b><br>${dataToko.createdAt}</p>
                                <p>
                                    <b>Layanan Pengiriman</b><br>${kurir}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>`;
    document.getElementsByClassName('main-content')[0].appendChild(htmlInfo);
    $('#modal-infotoko').modal('show');
}

window.modalInfoToko = modalInfoToko;