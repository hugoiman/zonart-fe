import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed} from "../../general/swalert.js";
import {getUrlPath} from "../../general/general.js";
import order from "../../request/order.js";
import { getProduk } from "../../request/produk.js";
import cloudinary from "../../request/cloudinary.js";
import validateFile from "../../general/validateFile.js";
import {getDaftarKaryawan} from "../../request/karyawan.js";

const loadPage = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-pesanan").addClass("active");
        const slugToko = await getUrlPath(1);
        let idToko = document.getElementById("idToko").value;

        const idOrder = await getUrlPath(3);
        const dataOrder = await order.getOrderToko(idToko, idOrder);
        const dataProduk = await getProduk(dataOrder.idToko, dataOrder.idProduk);
        displayInvoice(dataOrder);
        displayDaftarProduk(dataOrder, dataProduk);
        displayRingkasanPembelian(dataOrder);
        displayTotal(dataOrder);

        displayHasilOrder(dataOrder);
        let hasil = `<a href="${dataOrder.hasilOrder.replace('upload/', 'upload/fl_attachment/')}" id="a-hasil">
            <img alt="image" class="rounded" id="image" width="150" src="${dataOrder.hasilOrder}">
        </a>`;
        document.getElementById("display-image").innerHTML = hasil;

        if(dataOrder.biayaTambahan != null) {
            displayBiayaTambahan(dataOrder.biayaTambahan);
        } else if(dataOrder.biayaTambahan == null) {
            document.getElementById("biaya-tambahan").remove();
        }

        if(dataOrder.jenisPesanan === "cetak") {
            displayPengiriman(dataOrder.pengiriman);
        }

        if(dataOrder.invoice.statusPembayaran === "-") {
            document.getElementById("info-pembayaran").remove();
        }

        $(".rupiah").mask('000.000.000', {reverse: true});

        $("#display-image").lightGallery({
            thumbnail:true,
            getCaptionFromTitleOrAlt: false,
        }); 

        $("#fileUser").lightGallery({
            thumbnail:true,
            getCaptionFromTitleOrAlt: false,
        }); 

        $("#contohGambar").lightGallery({
            thumbnail:true,
            getCaptionFromTitleOrAlt: false,
        }); 
        
        $('.currency').toArray().forEach(function(field){
            new Cleave(field, {
            numeral: true,
            numeralDecimalMark: 'thousand',
            delimiter: '.',
        })
    });
    } catch(error) {
        console.log(error)
    }
}

loadPage();

function displayInvoice(data) {
    let optionStatus = ``;
    if (data.invoice.statusPesanan == "menunggu konfirmasi") {
        optionStatus = `<option selected disabled>Menunggu Konfirmasi</option>
                        <option value="diproses">Diproses</option>`;
    } else if (data.invoice.statusPesanan == "diproses") {
        optionStatus = `<option selected disabled>Diproses</option>
                        <option value="selesai">Selesai</option>`;
    }

    let htmlInv =  `<address>
                        <strong>Nomor Invoice: </strong>${data.idInvoice}<br>
                        <strong>Status Pesanan: </strong>
                        <div class="form-row">
                            <div class="form-group col-md-5 col-10 ml-1">
                                <select class="form-control form-control-sm" id="statusPesanan">
                                    ${optionStatus}
                                </select>
                            </div>
                            <div class="form-group col-md-1 col-1">
                                <button type="button" class="btn btn-sm btn-primary ml-1 mt-2" onclick="prosesStatus('${data.idOrder}')">OK</button>
                            </div>
                        </div>
                        <strong>Penjual: </strong>${data.invoice.namaToko}<br>
                        <strong>Tanggal Pemesanan: </strong>${data.tglOrder}<br>
                        <strong>Rencana Pakai: </strong>${data.rencanaPakai}<br>
                        <strong>Waktu Pengerjaan: </strong>
                        <div class="form-row">
                            <div class="form-group col-md-5 col-10 ml-1">
                                <input class="form-control form-control-sm" id="waktuPengerjaan" placeholder="cont. 4 hari, 3-5 hari" value="${data.waktuPengerjaan}">
                            </div>
                            <div class="form-group col-md-1 col-1">
                                <button type="button" class="btn btn-sm btn-primary ml-1" onclick="waktuPengerjaan('${data.idOrder}')">OK</button>
                            </div>
                        </div>
                        <strong>Total: </strong>Rp <span class="rupiah">${data.invoice.totalPembelian}</span><br>
                        <strong>Telah Dibayar: </strong>Rp <span class="badge badge-danger rupiah">${data.invoice.totalBayar}</span><br>
                    </address>`;
    document.getElementById("info-invoice").innerHTML = htmlInv;
}


const getListKaryawan = async (data) => {
    try {
        let result = await getDaftarKaryawan(data.invoice.idToko);
        let listKaryawan = `<option value=""></option>`;
        result.karyawan.forEach(v => {
            if (v.posisi != 'editor' || v.status != 'aktif') {} 
            else if (v.status == 'aktif') {
                listKaryawan += `<option ` + (data.penangan.idKaryawan == v.idKaryawan ? 'selected' : '') + ` value="${v.idKaryawan}">${v.namaKaryawan}</option>`;
            }
        });

        document.getElementById("karyawan").innerHTML = listKaryawan;
    } catch(error) {
        alertFailed(error, false);
    }
}

function displayHasilOrder(data) {
    const htmlHasil = `<address>
                    <strong>Penangan Pesanan: </strong>
                    <div class="form-row">
                        <div class="form-group col-md-5 col-10 ml-1">
                            <select class="form-control form-control-sm selectric" id="karyawan">
                            </select>
                        </div>
                        <div class="form-group col-md-1 col-1">
                            <button type="button" class="btn btn-sm btn-primary ml-1 mt-2" onclick="setPenangan('${data.idOrder}')">OK</button>
                        </div>
                    </div>

                    <div id="display-image"></div>
                    <div class="row">
                        <div class="col-sm-6 col-md-12 mt-2">
                            <input type="file" class="form-control" id="hasil" onchange="loadImage(event)"/>
                        </div>
                        <div class="col-sm-6 col-md-12 mt-2">
                            <a href="#" class="btn btn-outline-info" onclick="uploadHasil('${data.idOrder}')">Upload Hasil</a>
                        </div>
                    </div>
                </address>`;
    document.getElementById("info-hasil").innerHTML = htmlHasil;
    getListKaryawan(data);
}

function displayDaftarProduk(data, produk) {
    let fotoUser = ``;
    $.each(data.fileOrder, function(idx, v) {
        if(idx < 2 || data.fileOrder.length == 3) {
            fotoUser += `<a href="${v.foto.replace('upload/', 'upload/fl_attachment/')}">
                            <img class="gallery-item" src="${v.foto}">
                        </a>`;
        } else if(idx == 2) {
            fotoUser += `<a href="${v.foto.replace('upload/', 'upload/fl_attachment/')}">
                            <div class="gallery-item gallery-more" src="${v.foto}">
                                <div id="galeri-sisa"></div>
                            </div>
                        </a>`;
        } else {
            fotoUser += `<a href="${v.foto.replace('upload/', 'upload/fl_attachment/')}">
                            <img class="gallery-item gallery-hide" src="${v.foto}">
                        </a>`
        }
    });

    const htmlProduk = `<li class="media">
    <img alt="image" class="rounded mr-3" width="100" src="${produk.gambar}">
    <div class="media-body mr-3 ">
      <div class="media-title"><a href="/${data.invoice.slugToko}/${produk.slug}">${data.produkOrder.namaProduk}</a></div>
      <div class="text-time">${data.pcs} Pcs (${data.produkOrder.beratProduk * data.pcs} gr), tambahan wajah: ${data.tambahanWajah}</div> 
      <div class="media-description text-muted">${data.catatan}</div>
    </div>
    <div class="media-cta">
        <div class="media-label">Contoh</div>
        <div id="contohGambar">
            <a href="${data.contohGambar}">
                <img alt="image" class="rounded" width="100" src="${data.contohGambar}">
            </a>
        </div>
    </div>
    <div class="media-cta">
      <div class="media-label">File Customer</div>
      <div class="gallery" id="fileUser">
        ${fotoUser}
      </div>
      <div class="buttons text-center">
        <a href="#" class="btn btn-sm btn-secondary">Download Semua File</a>
      </div>
    </div>
  </li>`;
  document.getElementById("info-produk").innerHTML = htmlProduk;

    if (data.fileOrder.length > 3) {
        $('#galeri-sisa').text(`+${data.fileOrder.length-2}`);
    }
}

function displayRingkasanPembelian(data) {
    let tbody = `<tr>
                    <td>1</td>
                    <td>${data.produkOrder.namaProduk}</td>
                    <td class="text-center">${data.pcs} pcs</td>
                    <td class="text-center rupiah">${data.produkOrder.beratProduk * data.pcs}</td>
                    <td class="text-center">Rp <span class="rupiah">${data.produkOrder.hargaProduk}</span></td>
                    <td class="text-right">Rp <span class="rupiah">${data.produkOrder.hargaProduk * data.pcs}</span></td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Tambahan wajah</td>
                    <td class="text-center">${data.tambahanWajah} wajah</td>
                    <td class="text-center">-</td>
                    <td class="text-center">Rp <span class="rupiah">${data.produkOrder.hargaSatuanWajah}</span></td>
                    <td class="text-right">Rp <span class="rupiah">${(data.produkOrder.hargaSatuanWajah * data.tambahanWajah) * data.pcs}</span></td>
                </tr>`;

    let count = 3;
    data.opsiOrder.forEach(v => {
        tbody += `<tr>
                    <td>${count}</td>
                    <td>${v.namaGrup}: ${v.opsi}</td>
                    <td class="text-center">` + (v.perProduk ? `${data.pcs} pcs` : '-') + `</td>
                    <td class="text-center rupiah">` + (v.perProduk ? `${v.berat * data.pcs}` : '-') + `</td>
                    <td class="text-center">Rp <span class="rupiah">${v.harga}</span></td>
                    <td class="text-right">Rp <span class="rupiah">` + (v.perProduk ? `${v.harga * data.pcs}` : `${v.harga}`) + `</span></td>
                </tr>`;
        count++;
    });

    document.getElementById("info-ringkasan").innerHTML = tbody;
}

function displayTotal(data) {
    const htmlTotal = `<div class="row mt-2">
    <div class="col-lg-12 text-right">
      <div class="invoice-detail-item">
        <div class="invoice-detail-name">Subtotal</div>
        <div class="invoice-detail-value">Rp <span class="rupiah">${data.invoice.totalPembelian - data.pengiriman.ongkir}</span></div>
      </div>
      <div class="invoice-detail-item">
        <div class="invoice-detail-name">Ongkir (${data.pengiriman.kurir} - ${data.pengiriman.service} : <span class="rupiah">${data.pengiriman.berat}</span> gr)</div>
        <div class="invoice-detail-value">Rp <span class="rupiah">${data.pengiriman.ongkir}</span></div>
      </div>
      <hr class="mt-2 mb-2">
      <div class="invoice-detail-item">
        <div class="invoice-detail-name">Total</div>
        <div class="invoice-detail-value invoice-detail-value-lg">Rp <span class="rupiah">${data.invoice.totalPembelian}</span></div>
      </div>
    </div>
  </div>`;
  document.getElementById("info-total").innerHTML = htmlTotal;
}

function displayPengiriman(data) {
    const htmlPengiriman = `<div class="section-title">Pengiriman</div>
    <div class="row">
      <div class="col-md-12">
        <address>
          <strong>${data.kurir} - ${data.service}</strong><br>
          No. Resi: ${data.resi}<br>
          Dikirim kepada <strong>${data.penerima}</strong><br>
          ${data.alamat}<br>
          ${data.kota}<br>
          ${data.telp}
        </address>
      </div>
    </div>`;
  document.getElementById("info-pengiriman").innerHTML = htmlPengiriman;
}

function displayBiayaTambahan(data) {
    let count = 1;
    let tbody = ``;
    data.forEach(v => {
        tbody += `<tr>
                    <td>${count}</td>
                    <td>${data.item}</td>
                    <td class="text-center rupiah">${data.berat}</td>
                    <td class="text-right rupiah">Rp ${data.total}</td>
                </tr>`;
    });
    document.getElementById("info-tambahan").innerHTML = tbody;
}

const prosesStatus = async (idOrder) => {
    try {
        let statusPesanan = document.getElementById('statusPesanan').value;
        let idToko = document.getElementById('idToko').value;

        if (statusPesanan == 'diproses') {
            let result = await order.prosesPesanan(idToko, idOrder)
            alertSuccess(result.message);
        } else if (statusPesanan == 'selesai') {
            let result = await order.selesaikanPesanan(idToko, idOrder)
            alertSuccess(result.message);
        } else {}
    }
    catch(error) {
        alertFailed(error, false);
    }
}

const waktuPengerjaan = async (idOrder) => {
    try {
        let waktuPengerjaan = document.getElementById('waktuPengerjaan').value;
        let idToko = document.getElementById('idToko').value;
        let jsonData = JSON.stringify({
            waktuPengerjaan,
        });
        let result = await order.setWaktuPengerjaan(idToko, idOrder, jsonData);
        alertSuccess(result.message);
    }
    catch(error) {
        alertFailed(error, false);
    }
}

var loadImage = function(event) {
	var image = document.getElementById('image');
	image.src = URL.createObjectURL(event.target.files[0]);
};

const uploadHasil = async (idOrder) => {
    try {
        let formData = new FormData();
        let image = $("#hasil")[0].files[0];
        formData.append("file", image);
        formData.append("folder", "zonart/order/hasil");
        var allowedExtensions =  /(\.jpg|\.jpeg|\.png)$/i;
        let validasiGambar = await validateFile(document.getElementById("hasil"), allowedExtensions);
        let resultUpload = await cloudinary.uploadFile(formData);
        let hasilOrder = resultUpload.data["secure_url"];

        let jsonData = JSON.stringify({
            hasilOrder, 
        });

        let result = await order.uploadHasilOrder(idOrder, jsonData);
        alertSuccess(result.message)
        document.getElementById("a-hasil").href = hasilOrder.replace('upload/', 'upload/fl_attachment/');
        document.getElementById('hasil').value = "";
    }
    catch(error) {
        alertFailed(error, false);
    }
}

const setPenangan = async (idOrder) => {
    try {
        let idKaryawan = parseInt(document.getElementById('karyawan').value);
        let idToko = document.getElementById('idToko').value;
        let jsonData = JSON.stringify({
            idKaryawan,
        });
        let result = await order.setPenanganOrder(idToko, idOrder, jsonData);
        alertSuccess(result.message);
    }
    catch(error) {
        alertFailed(error, false);
    }
}

window.prosesStatus = prosesStatus;
window.waktuPengerjaan = waktuPengerjaan;
window.loadImage = loadImage;
window.uploadHasil = uploadHasil;
window.setPenangan = setPenangan;