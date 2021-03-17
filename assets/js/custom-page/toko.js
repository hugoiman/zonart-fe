import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {getUrlPath} from "../general/general.js";
import {getToko} from "../request/toko.js";
import {getDaftarProduk} from "../request/produk.js";
import {getDaftarGaleri} from "../request/galeri.js";
import {getDaftarFaq} from "../request/faq.js";

let galeri;

let dataToko;
const loadPage = async () => {
    const loadmain = await loadMain();
    const slugToko = await getUrlPath(1);
    dataToko = await getToko(slugToko);
    document.getElementById("logo").src = dataToko.foto;
    $('.namaToko').text(dataToko.namaToko);
    $('.kota').text(dataToko.kota);

    let htmlSosmed = ``;
    if(dataToko.instagram != '') {
        htmlSosmed +=   `<a href="https://www.instagram.com/${dataToko.instagram}" class="btn btn-outline-info mr-1">
                            <i class="fab fa-instagram"></i>
                        </a>`;
    }
    if(dataToko.whatsapp != '') {
        htmlSosmed +=   `<a href="https://wa.me/${dataToko.whatsapp}?text=" class="btn btn-outline-success mr-1" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                        </a>`;
    }
    if(dataToko.emailToko != '') {
        htmlSosmed +=   `<a href="mailto:${dataToko.emailToko}" class="btn btn-outline-danger mr-1">
                            <i class="fab fa-google"></i>
                        </a>`;
    }
    document.getElementById('info-sosmed').innerHTML = htmlSosmed;

    displayFaq(dataToko.idToko);
    displayProduk(dataToko.idToko, slugToko);

    let result = await getDaftarGaleri(dataToko.idToko);
    galeri = result;
    let kategori = _.uniqBy(result.galeri, 'kategori');
    let htmlKategori = `<option selected="selected" value="semua">Semua</option>`;
    kategori.forEach(v => {
        htmlKategori += `<option value="${v.idProduk}">${v.kategori}</option>`;
    })
    document.getElementById("select-kategori").innerHTML = htmlKategori;
    await displayGaleri();
}
loadPage();

const displayProduk = async (idToko, slugToko) => {
    try {
        let result = await getDaftarProduk(idToko);
        let htmlProduk = ``;
        result.produk.forEach(v => {
            htmlProduk += `<div class="col-12 col-sm-6 col-md-6 col-lg-3">
            <article class="article article-style-b">
              <div class="article-header">
                <a href="/${slugToko}/${v.slug}">
                    <img class="article-image" src="${v.gambar}">
                </a>
              </div>
              <div class="article-details">
                <div class="article-title">
                    <h2><a href="/${slugToko}/${v.slug}">${v.namaProduk}</a></h2>
                </div>
                <p><b> Rp ` + (v.jenisPemesanan[1].harga < v.jenisPemesanan[0].harga ? (v.jenisPemesanan[1].status == true ? `<span class="nominal">${v.jenisPemesanan[1].harga}</span>` : ``) + `` + (v.jenisPemesanan[0].status == true ? ` - <span class="nominal">${v.jenisPemesanan[0].harga}</span>` : ``) :
                                                                                       (v.jenisPemesanan[0].status == true ? `<span class="nominal">${v.jenisPemesanan[0].harga}</span>` : ``) + `` + (v.jenisPemesanan[1].status == true ? ` - <span class="nominal">${v.jenisPemesanan[1].harga}</span>` : ``) )+ `</b></p>
              </div>
            </article>
          </div>`;
        });
        document.getElementById("daftar-produk").innerHTML = htmlProduk;
        $(".nominal").mask('000.000.000', {reverse: true});
    } catch(error) {
        console.log(error)
    }
}

const displayGaleri = async () => {
        try {
        let kategori = $("#select-kategori").val();
        if (galeri.galeri === null) {
            return;
        }
        let htmlGaleri = ``;
        let el = document.getElementById('animated-thumbnials');
        galeri.galeri.forEach(v => {
            if (v.idProduk == kategori || kategori == "semua") {
                htmlGaleri +=   `<a href="${v.gambar.replace('upload/', 'upload/fl_attachment/')}" class="lightgallery-image"  data-sub-html="${v.kategori}">
                                    <img src="${v.gambar}" class="mb-2 col-6 col-md-3 col-lg-2" style="margin-right:-5px;"/>
                                </a>`;
            } else if (v.idProduk !== kategori) {
                return;
            } 
        });
        
        if ($(".lightgallery-image").length != 0) {
            $("#animated-thumbnials").data('lightGallery').destroy(true);
        }

        el.innerHTML = htmlGaleri
        $("#animated-thumbnials").lightGallery({
            thumbnail:true,
        }); 
    } catch(error) {
        console.log(error);
    }
}

const displayFaq = async (idToko) => {
    try {
        let result = await getDaftarFaq(idToko);
        let htmlKategori = '';
        let dataKategori = [];

        if (result.faq === null) {
            return;
        }
        result.faq.forEach(element => {
            dataKategori.indexOf(element.kategori) === -1 ? dataKategori.push(element.kategori) : '';
        });

        // display kategori
        dataKategori.forEach(kategori => {
            htmlKategori += `<div class="col-12 col-md-6 col-lg-6">
                                <div class="card card-primary">
                                    <div class="card-header">
                                        <h4>${kategori}</h4>
                                    </div>
                                    <div class="card-body">
                                        <div id="${kategori}">
                                            <div class="accordion ${kategori}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
        })
        document.getElementById("daftar-faq").innerHTML = htmlKategori;

        // put field faq in each kategori
        result.faq.forEach(val => {
            let contentFaq = document.createElement('div');
            contentFaq.innerHTML =  `<div class="accordion-header content-faq-${val.idFaq}" role="button" data-toggle="collapse" data-target="#panel-body-${val.idFaq}" aria-expanded="false">
                                        <h4>${val.pertanyaan}</h4>
                                    </div>
                                    <div class="accordion-body collapse content-faq-${val.idFaq}" id="panel-body-${val.idFaq}" data-parent="#${val.kategori}">
                                        ${val.jawaban}
                                    </div>`;
            document.getElementsByClassName(`${val.kategori}`)[0].appendChild(contentFaq);
        });
    } catch(error) {
        alertFailed(error, false)
    }
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

window.displayGaleri = displayGaleri;
window.modalInfoToko = modalInfoToko;