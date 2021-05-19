import loadMain from "../general/main.js";
import {alertSuccess, alertFailed, alertWarning} from "../general/swalert.js";
import {formatRupiah, getUrlPath} from "../general/general.js";
import {getToko} from "../request/toko.js";
import { getProduk } from "../request/produk.js";
import { getDaftarGaleri } from "../request/galeri.js";
import rajaOngkir from "../request/rajaOngkir.js";
import order from "../request/order.js";

let dataToko;
let dataProduk;
let listKota;
let idToko;

const loadPage = async () => {
    const loadmain = await loadMain();
    const slugToko = await getUrlPath(1);
    const slugProduk = await getUrlPath(2);
    dataToko = await getToko(slugToko);
    idToko = dataToko.idToko;
    document.getElementById('logo').src = dataToko.foto;
    document.getElementsByClassName('namaToko')[0].innerHTML = `<a href="/${dataToko.slug}">${dataToko.namaToko}</a>`

    dataProduk = await getProduk(dataToko.idToko, slugProduk);
    $('body').append(`<input type="text" id="idToko" value="${dataProduk.idToko}" hidden/><input type="text" id="idProduk" value="${dataProduk.idProduk}" hidden/>`);

    displayProduk(dataProduk);
    const dataGaleri = await getDaftarGaleri(dataToko.idToko)
    let galeriProduk = dataGaleri.galeri.filter(v => v.idKategori == dataProduk.idProduk);
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
                                <h3><i class="fa fa-inr" aria-hidden="true"></i>${(dataProduk.jenisPemesanan[1].status == true ? `Rp <span class="nominal">${dataProduk.jenisPemesanan[1].harga}</span>` : ``)}
                                ${(dataProduk.jenisPemesanan[0].status == true ? (dataProduk.jenisPemesanan[1].status == true ? ` - Rp <span class="nominal">${dataProduk.jenisPemesanan[0].harga}</span>` : `Rp <span class="nominal">${dataProduk.jenisPemesanan[0].harga}</span>`) : ``)}
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
                <div id="form-kota-kurir">
                    <div class="row" id="form-kota"></div>
                    ${jenisPengirimanToko(dataToko)}
                </div>
                ${penerima()}
                ${telp()}
                <div id="alamat-pengiriman">
                ${alamat()}
                ${label()}
                </div>
            </div>
        </div>
    </div>`;
    $('#form-pengiriman').append(form);
    kota(listKota, dataToko.kota);
}

let dropzone;
let showForm = async () => {
    $('#form-pemesanan').fadeIn("slow");
    $('#form-pengiriman').fadeIn("slow");
    hitungTotalPembelian();
    $('#card-total-payment').fadeIn("slow");
    setTimeout(() => {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#form-pemesanan").offset().top
        }, 1000);
    }, 1000);


    dropzone = new Dropzone("#mydropzone", {
        autoProcessQueue: false,
        // maxFilesize: 10,
        // maxFiles: 50,
        // parallelUploads: 50,
        acceptedFiles: "image/*",
        // url: cloudinary.CLOUDINARY_URL,
    });
    
    dropzone.on('sending', function (file, xhr, formData) {
        // formData.append("folder", "zonart/order");
        // formData.append('upload_preset', cloudinary.CLOUDINARY_UPLOAD_PRESET);
    });
    
    // dropzone.on('success',  function (file, response) {
    //     let foto = response.secure_url;
    //     fileOrder.push({foto})
    // });
    
    // dropzone.on('error', function (file, response) {
    //     $(file.previewElement).find('.dz-error-message').text(response);
    //     dropzone.removeFile(file);
    //     alertFailed(response, false);
    // });

    // dropzone.on('complete',  function (file) {
    //     if (dropzone.getUploadingFiles().length === 0 && dropzone.getQueuedFiles().length === 0) {
    //         createOrder();
    //     }
    // });
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
    berat = dataProduk.berat * pcs;

    $.each(dataProduk.grupOpsi, function(idx, data) {
        if (data.opsi != null) {
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
        }
    });

    let pengiriman = hitungCostPengiriman();
    total += pengiriman.cost;

    $('#total-payment').text(formatRupiah(total));
    document.getElementById('total-berat').innerHTML = `<small>(${formatRupiah(berat)} gr)</small>`;
}


function hitungCostPengiriman() {
    let pengiriman = $("input[name='cost']:checked").val();
    let kurir = $("input[name='kurir']:checked").val();
    if(kurir == "cod") {
        $('#alamat-pengiriman').hide();
        return { kurir: kurir, cost: 0, service: "", estimasi: "" }
    } else if(kurir == undefined) {
        $('#alamat-pengiriman').hide();
        return { kurir: "", cost: 0, service: "", estimasi: "" }
    } else if(pengiriman == undefined && kurir != undefined) {
        $('#alamat-pengiriman').show();
        return { kurir: "", cost: 0, service: "", estimasi: "" }
    }

    $('#alamat-pengiriman').show();
    pengiriman = pengiriman.split(",");
    return { kurir: kurir, cost: parseInt(pengiriman[0]), service: pengiriman[1], estimasi: pengiriman[2] }
} 


const getOngkir = async (cod = false) => {
    try {
        let origin = listKota.rajaongkir.results.find(item => item.city_name === dataToko.kota).city_id;
        let tujuan = document.getElementById('kota').value;
        let weight = berat.toString();
        let courier = $("input[name='kurir']");
        $('#form-kota').show();

        if(tujuan == "" || tujuan == undefined || !courier.is(":checked")){
            return;
        }

        let destination = listKota.rajaongkir.results.find(item => item.city_name === tujuan).city_id;

        courier = $("input[name='kurir']:checked").val();
        if(courier === "cod") {
            $('#service-pengiriman').remove();
            kota(listKota, dataToko.kota);
            $('#form-kota').hide();
            hitungTotalPembelian();
            return;
        }

        let jsonData = JSON.stringify({
            origin, destination, weight, courier,
        });
        let costs = await rajaOngkir.getCost(jsonData);
        costPengiriman(costs);
        hitungTotalPembelian();
    } catch(error) {
        alertFailed(error, false);
    }
}

const checkout = async () => {
    let originalBtnCheckout = $('#btn-checkout').html();
    try {
        $('#btn-checkout').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Tunggu, pesanan sedang diproses...`).prop("disabled", true);
        let idProduk = document.getElementById('idProduk').value;
        let jenisPesanan = $("input[name='jenis-pesanan']:checked").val();
        let tambahanWajah = parseInt(document.getElementById('tambahan-wajah').value);
        let catatan = document.getElementById('catatan-penjual').value;
        let pcs = parseInt(document.getElementById('pcs').value);
        let rencanaPakai = document.getElementById('rencana-pakai').value;
        let contohGambar = document.getElementById('contoh-gambar').value;

        // pengiriman
        let penerima = document.getElementById('penerima').value;
        let telp = document.getElementById('telp').value;
        let alamat = document.getElementById('alamat').value;
        let kota = document.getElementById('kota').value;
        let label = document.getElementById('label').value;
        let kodeKurir = $("input[name='kurir']:checked").val();
        let cost = $("input[name='cost']:checked").val();
        let service = "";
        if (cost != undefined && kodeKurir != "cod") {
            cost = cost.split(",");
            service = cost[1];
        }
        let pengiriman = {penerima, telp, alamat, kota, label, kodeKurir, service}

        let opsiOrder = [];
        $.each(dataProduk.grupOpsi, function(idx, data) {
            if (data.opsi == null) {
                data.opsi = []
            }
            let id = '0'+data.idGrupOpsi;
            let idInt = parseInt(id);
            if (data.spesificRequest) {
                data.opsi.push({idOpsi:idInt});
            }
            data.opsi.forEach(v => {
                let opsi = $(`#opsi-${v.idOpsi}`);
                if(opsi.is(":checked")){
                    if(v.idOpsi == idInt) {
                        opsi = $(`.spesific-request-${data.idGrupOpsi}`);
                    }
                    opsiOrder.push({idGrupOpsi: data.idGrupOpsi, idOpsiOrder: v.idOpsi, opsi: opsi.val()})
                }
            })
            if (data.spesificRequest) {
                data.opsi.pop();
            }
        });
            
        let jsonData = JSON.stringify({
            jenisPesanan, tambahanWajah, catatan, pcs, rencanaPakai, contohGambar, opsiOrder, pengiriman,
        }) 
        
        let formData = new FormData();
        formData.append('payload', jsonData)
        var images = dropzone.files.length;
        for (var i = 0; i < images; i++) {
            formData.append("fileOrder", dropzone.files[i]);
        }
        let result = await order.createOrder(idToko, idProduk, formData);
        window.location.href = `/order?id=${result.idOrder}`;
        
        // if (dropzone.files.length === 0) {
        //     throw "Silahkan masukan gambar.";
        // } else if (dropzone.files.some(el => el.accepted === false)) {
        //     throw "Terjadi kesalahan pada foto yang kamu masukan. ";
        // }
        // dropzone.processQueue();
    } catch(error) {
        alertFailed(error, false);
    } finally {
        // dropzone.removeAllFiles(true)
        $('#btn-checkout').html(originalBtnCheckout).prop('disabled', false)
    }
}

window.modalInfoToko = modalInfoToko;
window.showForm = showForm;
window.setSpesificRequest = setSpesificRequest;
window.hitungTotalPembelian = hitungTotalPembelian;
window.checkout = checkout;
window.getOngkir = getOngkir;
window.hitungCostPengiriman = hitungCostPengiriman;