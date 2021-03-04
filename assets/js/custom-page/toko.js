import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {getUrlPath} from "../general/general.js";
import {getToko} from "../request/toko.js";
import {getDaftarProduk} from "../request/produk.js";
import {getDaftarGaleri} from "../request/galeri.js";
import {getDaftarFaq} from "../request/faq.js";

let galeri;

const loadPage = async () => {
    const loadmain = await loadMain();
    const slugToko = await getUrlPath(1);
    const dataToko = await getToko(slugToko);
    document.getElementById("logo").src = dataToko.foto;
    $('.namaToko').text(dataToko.namaToko);
    $('.kota').text(dataToko.kota);
    displayProduk(dataToko.idToko, slugToko);
    displayInfoToko(dataToko);
    displayFaq(dataToko.idToko);

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
                <img class="article-image" src="${v.gambar}">
              </div>
              <div class="article-details">
                <div class="article-title">
                    <h2><a href="/${slugToko}/${v.slug}">${v.namaProduk}</a></h2>
                </div>
                <p><b>Rp ${v.jenisPemesanan[1].harga} - Rp ${v.jenisPemesanan[0].harga}</b></p>
              </div>
            </article>
          </div>`;

        });
        document.getElementById("daftar-produk").innerHTML = htmlProduk;
    } catch(error) {

    }
}

const displayInfoToko = async (dataToko) => {
    try {
        $('#deskripsi').text(dataToko.deskripsi);
        $('#alamat').text(`${dataToko.alamat}, ${dataToko.kota}`);
        $('#gabung').text(dataToko.createdAt);
        let medsos = document.createElement('div');
        medsos.innerHTML = (dataToko.instagram != "" ? `<a href="instagram.com/${dataToko.instagram}"><i class="fab fa-instagram"></i> @${dataToko.instagram}</a>` : ``);
        medsos.innerHTML += (dataToko.whatsapp != "" ? `<br><a><i class="fab fa-whatsapp"></i> ${dataToko.whatsapp}</a>` : ``);
        medsos.innerHTML += (dataToko.emailToko != "" ? `<br><a><i class="fab fa-google"></i> ${dataToko.emailToko}</a>` : ``);
        medsos.innerHTML += (dataToko.website != "" ? `<br><a><i class="fas fa-globe"></i> ${dataToko.website}</a>` : ``);
        document.getElementById('kontak').appendChild(medsos);

        let kurir = [];
        dataToko.jasaPengirimanToko.forEach(v => {
            kurir.push(v.kurir);
        });
        $('#kurir').text(`${kurir}`);
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
                htmlGaleri +=   `<a href="${v.gambar}">
                                    <img src="${v.gambar}" class="imagecheck mb-2 col-6 col-md-3 col-lg-2" style="margin-right:-5px;"/>
                                </a>`;
            } else if (v.idProduk !== kategori) {
                return;
            } 
        });

        el.innerHTML = htmlGaleri
        window.lgData[el.getAttribute('lg-uid')].destroy(true);
        lightGallery(el);
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

window.displayGaleri = displayGaleri;