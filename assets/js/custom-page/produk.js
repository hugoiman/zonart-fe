import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {formatRupiah, getUrlPath} from "../general/general.js";
import {getToko} from "../request/toko.js";
import { getProduk } from "../request/produk.js";
import { getDaftarGaleri } from "../request/galeri.js";
import cloudinary from "../request/cloudinary.js";
import rajaOngkir from "../request/rajaOngkir.js";

let dataToko;
let dataProduk;
let listKota;

const loadPage = async () => {
    const loadmain = await loadMain();
    const slugToko = await getUrlPath(1);
    const slugProduk = await getUrlPath(2);
    dataToko = await getToko(slugToko);
    document.getElementById('logo').src = dataToko.foto;
    document.getElementsByClassName('namaToko')[0].innerHTML = `<a href="/${dataToko.slug}">${dataToko.namaToko}</a>`

    dataProduk = await getProduk(dataToko.idToko, slugProduk);
    displayProduk(dataProduk);
    const dataGaleri = await getDaftarGaleri(dataToko.idToko)
    let galeriProduk = dataGaleri.galeri.filter(v => v.idProduk == dataProduk.idProduk);
    displayGaleriProduk(galeriProduk);
    addFormPemesanan(dataProduk, galeriProduk);

    listKota = await rajaOngkir.getAllCity();
    addFormPengiriman(dataToko, listKota);

    $(".rupiah").mask('000.000.000', {reverse: true});
    $("#rencana-pakai").datepicker();
    $('.currency').toArray().forEach(function(field){
        new Cleave(field, {
            numeral: true,
            numeralDecimalMark: 'thousand',
            delimiter: '.',
        })
    });
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

function displayGaleriProduk(galeriProduk){
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

function addFormPemesanan(dataProduk, dataGaleri) {
    let form = `<div class="col-12 col-md-6 col-sm-12">
        <div class="card">
            <div class="card-header">
                <h4>Form Pemesanan</h4>
            </div>
            <div class="card-body">
                ${jenisPesanan(dataProduk)}
                ${jumlahCetak(dataProduk)}
                ${tambahanWajah(dataProduk)}
                ${rencanaPakai()}
                ${fotoUser()}
                ${contohGambar(dataGaleri)}
                ${catatan()}
                ${grupOpsi(dataProduk.grupOpsi)}
            </div>
        </div>
    </div>`;
    $('#form-pemesanan').append(form);
}

function addFormPengiriman(dataToko, listKota) {
    let form = `<div class="col-12 col-md-6 col-sm-12">
        <div class="card">
            <div class="card-header">
                <h4>Pengiriman</h4>
            </div>
            <div class="card-body">
                ${kota(listKota)}
                ${jenisPengirimanToko(dataToko)}
            </div>
        </div>
    </div>`;
    $('#form-pengiriman').append(form);
    $('#kota').select2();
}

function showForm() {
    $('#form-pemesanan').fadeIn("slow");
    $('#form-pengiriman').fadeIn("slow");
    hitungTotalPembelian();
    $('#card-total-payment').fadeIn("slow");
    setTimeout(() => {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#form-pemesanan").offset().top
        }, 1000);
    }, 1000);


    let dropzone = new Dropzone("#mydropzone", {
        autoProcessQueue: false,
        maxFilesize: 10,
        maxFiles: 8,
        parallelUploads: 8,
        acceptedFiles: "image/*",
        url: cloudinary.CLOUDINARY_URL,
    });
    
    dropzone.on('sending', function (file, xhr, formData) {
        formData.append("folder", "zonart/order");
        formData.append('upload_preset', cloudinary.CLOUDINARY_UPLOAD_PRESET);
    });
    
    let fileOrder = [];
    dropzone.on('success', function (file, response) {
        let link = response.secure_url;
        fileOrder.push({link})
    });
    
    dropzone.on('error', function (file, response) {
        $(file.previewElement).find('.dz-error-message').text(response.error.message);
        alertFailed(response.error.message);
    });
}

function setSpesificRequest(idGrupOpsi) {
    document.getElementsByClassName(`spesific-request-${idGrupOpsi}`)[0].value = document.getElementById(`input-request-${idGrupOpsi}`).value;
}

let berat = 0;
function hitungTotalPembelian() {
    let jenisPesanan = $("input[name='jenis-pesanan']:checked").val(); // cetak/soft copy
    let hargaProduk = dataProduk.jenisPemesanan.find(item => item.jenis === jenisPesanan).harga;
    let pcs = parseInt(document.getElementById('pcs').value);
    let tambahanWajah = parseInt(document.getElementById('tambahan-wajah').value);
    let total = (hargaProduk * pcs) + (tambahanWajah * dataProduk.hargaWajah);

    $.each(dataProduk.grupOpsi, function(idx, data) {
        data.opsi.forEach(v => {
            let opsi = $(`#opsi-${v.idOpsi}`);
            if(opsi.is(":checked")){
                let hargaItem = dataProduk.grupOpsi[idx].opsi.find(item => item.idOpsi === v.idOpsi).harga;
                let beratItem = dataProduk.grupOpsi[idx].opsi.find(item => item.idOpsi === v.idOpsi).berat;
                if(v.perProduk){
                    total += hargaItem * pcs;
                    berat += beratItem * pcs;
                } else {
                    total += hargaItem;
                    berat += beratItem;
                }
            }
        })
    });

    if(jenisPesanan == "cetak") {
        berat += dataProduk.berat;
    }
    $('#total-payment').text(formatRupiah(total));
}

const getOngkir = async () => {
    try {
        let origin = listKota.rajaongkir.results.find(item => item.city_name === dataToko.kota).city_id;
        let destination = document.getElementById('kota').value;
        let weight = berat.toString();
        let courier = $("input[name='kurir']");

        if(destination == "" || !courier.is(":checked")){
            return;
        }

        courier = $("input[name='kurir']:checked").val();
        let jsonData = JSON.stringify({
            origin, destination, weight, courier,
        });
        let costs = await rajaOngkir.getCost(jsonData);
        costPengiriman(costs)
    } catch(error) {
        alertFailed(error, false);
    }
}

function checkout() {
    let jenisPesanan = $("input[name='jenis-pesanan']:checked").val();
    let tambahanWajah = parseInt(document.getElementById('tambahan-wajah').value);
    let catatan = document.getElementById('catatan-penjual').value;
    let pcs = parseInt(document.getElementById('pcs').value);
    let rencanaPakai = document.getElementById('rencana-pakai').value;
    let contohGambar = document.getElementById('contoh-gambar').value;

    let opsiOrder = [];
    $.each(dataProduk.grupOpsi, function(idx, data) {
        if (data.spesificRequest) {
            data.opsi.push({idOpsi:0});
        }
        data.opsi.forEach(v => {
            let opsi = $(`#opsi-${v.idOpsi}`);
            if(opsi.is(":checked")){
                if(v.idOpsi == 0) {
                    opsi = $(`.spesific-request-${data.idGrupOpsi}`);
                }
                opsiOrder.push({idGrupOpsi: data.idGrupOpsi, idOpsi: v.idOpsi, opsi: opsi.val()})
            }
        })
    });

    let jsonData = JSON.stringify({
        jenisPesanan, tambahanWajah, catatan, pcs, rencanaPakai, contohGambar, opsiOrder,
    })
    console.log(jsonData);

    // let opsiOrder;
    // let berat = 0;
}

window.modalInfoToko = modalInfoToko;
window.showForm = showForm;
window.setSpesificRequest = setSpesificRequest;
window.hitungTotalPembelian = hitungTotalPembelian;
window.checkout = checkout;
window.getOngkir = getOngkir;