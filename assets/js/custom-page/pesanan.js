import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {getUrlParameter} from "../general/general.js";
import order from "../request/order.js";
import { getProduk } from "../request/produk.js";

const loadPage = async () => {
    try {
        const loadmain = await loadMain();
        const idOrder = await getUrlParameter('id');
        const dataOrder = await order.getOrder(idOrder);
        const dataProduk = await getProduk(dataOrder.idToko, dataOrder.idProduk);
        displayInvoice(dataOrder);
        displayDaftarProduk(dataOrder, dataProduk);
        displayRingkasanPembelian(dataOrder);
        displayTotal(dataOrder);

        if(dataOrder.hasilOrder !== "") {
            displayHasilOrder(dataOrder);
        }

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
        alertFailed(error, false)
    }
}

loadPage();

function displayInvoice(data) {
    let htmlInv =  `<address>
                        <strong>Nomor Invoice: </strong>${data.idInvoice}<br>
                        <strong>Status Pesanan: ${data.invoice.statusPesanan}</strong><br><br>
                        <strong>Penjual: </strong>${data.invoice.namaToko}<br>
                        <strong>Tanggal Pemesanan: </strong>${data.tglOrder}<br>
                        <strong>Rencana Pakai: </strong>${data.rencanaPakai}<br>
                        <strong>Waktu Pengerjaan: </strong>${data.waktuPengerjaan}<br><br>
                        <strong>Total: </strong>Rp <span class="rupiah">${data.invoice.totalPembelian}</span><br>
                        <strong>Tagihan: </strong>Rp <span class="badge badge-danger rupiah">${data.invoice.tagihan}</span><br>
                    </address>`;
    document.getElementById("info-invoice").innerHTML = htmlInv;
}

function displayHasilOrder(data) {
    const htmlHasil = `<address>
                    <div id="img-hasil">
                        <a href="${data.hasilOrder}">
                            <img alt="image" class="rounded" width="150" src="${data.hasilOrder}">
                        </a>
                    </div>
                    <div class="buttons mt-3">
                        <a href="#" class="btn btn-sm btn-outline-info" data-toggle="modal" data-target="#modal-revisi">Beri Revisi</a>
                        <a href="#" class="btn btn-sm btn-primary">Setujui Hasil</a>
                    </div>
                    <div class="buttons mt-1">
                        <a href="#" class="btn btn-sm btn-secondary">Daftar Revisi</a>
                    </div>
                </address>`;
    document.getElementById("info-hasil").innerHTML = htmlHasil;
    addModalRevisi(`${data.idOrder}`);
    $("#img-hasil").lightGallery({
        thumbnail:true,
        getCaptionFromTitleOrAlt: false,
    }); 
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
      <div class="media-label">File Anda</div>
      <div class="gallery" id="fileUser">
        ${fotoUser}
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

const sendRevisi = async (idOrder) => {
    try {
        let catatan = document.getElementById('catatan').value;
        let jsonData = JSON.stringify({
            catatan,
        });
        let result = await order.sendRevisi(idOrder, jsonData);
        alertSuccess(result.message);
    } catch(error) {
        alertFailed(error, false)
    }
}

function addModalRevisi(idOrder) {
    let modalRevisi = `<div class="modal fade" tabindex="-1" role="dialog" id="modal-revisi">
    <div class="modal-dialog" role="document">
      <form>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Berikan Revisi</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group col-12">
                <label class="col-form-label text-md-right">Catatan Revisi</label>
                  <input type="text" class="form-control" id="catatan">
              </div>
            </div>
          </div>
          <div class="modal-footer bg-whitesmoke br">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-primary" onclick="sendRevisi('${idOrder}')">Kirim</button>
          </div>
        </div>
      </form>
    </div>
  </div>`;

    $('body').append(modalRevisi);
}

window.sendRevisi = sendRevisi;