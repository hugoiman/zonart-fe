import loadMain from "../general/main.js";
import {alertSuccess, alertFailed, alertConfirm} from "../general/swalert.js";
import {getUrlParameter, capitalFirst} from "../general/general.js";
import order from "../request/order.js";
import { getProduk } from "../request/produk.js";
import cloudinary from "../request/cloudinary.js";
import validateFile from "../general/validateFile.js";
import pembayaran from "../request/pembayaran.js";

const loadPage = async () => {
    try {
        const loadmain = await loadMain();
        const idOrder = await getUrlParameter('id');
        const dataOrder = await order.getOrder(idOrder);
        const dataProduk = await getProduk(dataOrder.invoice.slugToko, dataOrder.produkOrder.slugProduk);
        displayInvoice(dataOrder);
        displayHasilOrder(dataOrder);
        displayDaftarProduk(dataOrder, dataProduk);
        displayRingkasanPembelian(dataOrder);
        displayBiayaTambahan(dataOrder.biayaTambahan);
        displayPengiriman(dataOrder);
        displayPembayaran(dataOrder.pembayaran);
        displayTotal(dataOrder);
        modalPembayaran(idOrder);
        modalListRevisi(dataOrder.revisi);

        if (dataOrder.invoice.statusPesanan === "selesai") {
            $('.el-show').hide();
        }
        
        if(dataOrder.invoice.statusPesanan == "menunggu konfirmasi") {
          document.getElementById("info-pembayaran").remove();
          const btnCancel = `<button class="btn btn-secondary btn-icon icon-left" onclick="cancelOrder('${dataOrder.idOrder}')"><i class="fas fa-times"></i> Batal Order</button>`;
          document.getElementById("btn-cancel").innerHTML = btnCancel;
        }

        $(".rupiah").mask('000.000.000', {reverse: true});

        $('.currency').toArray().forEach(function(field){
            new Cleave(field, {
            numeral: true,
            numeralDecimalMark: 'thousand',
            delimiter: '.',
        })
    });
    } catch(error) {
        console.log(error)
        alertFailed(error, false)
    }
}

loadPage();

function displayInvoice(data) {
    let htmlInv =  `<address>
                        <strong>Nomor Invoice: <a href="/invoice?id=${data.invoice.idInvoice}">${data.invoice.idInvoice}</a></strong><br>
                        <strong>Status Pesanan: ${capitalFirst(data.invoice.statusPesanan)}</strong><br><br>
                        <strong>Penjual: </strong>${data.invoice.namaToko}<br>
                        <strong>Tanggal Pemesanan: </strong>${data.tglOrder}<br>
                        <strong>Jenis Pesanan: </strong>${capitalFirst(data.jenisPesanan)}<br>
                        <strong>Rencana Pakai: </strong>${data.rencanaPakai}<br>
                        ${(data.waktuPengerjaan != "" ? `<strong>Waktu Pengerjaan: </strong>${data.waktuPengerjaan}<br>` : '')}<br>
                        <strong>Total: </strong>Rp <span class="rupiah">${data.invoice.totalPembelian}</span><br>
                        <strong>Tagihan: </strong>Rp <span class="badge badge-danger rupiah">${data.invoice.tagihan}</span><br>
                    </address>`;
    document.getElementById("info-invoice").innerHTML = htmlInv;
}

function displayHasilOrder(data) {
  if(data.hasilOrder.idHasilOrder == 0) {
    return;
  }
  const htmlHasil = `<address>
                  <div id="img-hasil">
                      <a href="${data.hasilOrder.hasil}">
                          <img alt="image" class="rounded" width="150" src="${data.hasilOrder.hasil}">
                      </a>
                  </div>
                  <div class="buttons mt-3 el-show" id="btn-revisi" ` + (data.hasilOrder.status != "sudah disetujui" ? '' : 'hidden') + `>
                      <a href="#" class="btn btn-sm btn-outline-info" data-toggle="modal" data-target="#modal-revisi">Beri Revisi</a>
                      <a href="#" class="btn btn-sm btn-primary" onclick="setujuiHasil('${data.idOrder}')">Setujui Hasil</a>
                  </div>
                  <div class="buttons mt-1" id="btn-daftar-revisi">
                      <a href="#" class="btn btn-sm btn-secondary" data-toggle="modal" data-target="#modal-daftar-revisi">Daftar Revisi</a>
                  </div>
              </address>`;
  document.getElementById("info-hasil").innerHTML = htmlHasil;
  modalAddRevisi(`${data.idOrder}`);
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

  $("#fileUser").lightGallery({
    thumbnail:true,
    getCaptionFromTitleOrAlt: false,
  }); 

  $("#contohGambar").lightGallery({
    thumbnail:true,
    getCaptionFromTitleOrAlt: false,
});
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
    if (data.opsiOrder != null) {
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
    }

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
  let contentPengiriman = ``;
  if(data.jenisPesanan !== "cetak") {
    return;
  } else if(data.jenisPesanan === "cetak" && data.pengiriman.kodeKurir != "cod") {
    contentPengiriman = `
      <strong>${data.pengiriman.kurir} - ${data.pengiriman.service}</strong><br>
      No. Resi: ${data.pengiriman.resi}<br>
      Dikirim kepada <strong>${data.pengiriman.penerima}</strong><br>
      ${data.pengiriman.alamat}<br>
      ${data.pengiriman.kota}<br>
      ${data.pengiriman.telp}`;
  } else if(data.jenisPesanan === "cetak" && data.pengiriman.kodeKurir == "cod") {
    contentPengiriman = `
      <strong>${data.pengiriman.kurir}</strong><br>
      Dikirim kepada <strong>${data.pengiriman.penerima}</strong><br>
      ${data.pengiriman.telp}`;
  }
  
  const htmlPengiriman = `<div class="section-title">Pengiriman</div>
    <div class="row">
      <div class="col-md-12">
        <address>
          ${contentPengiriman}
        </address>
      </div>
    </div>`;

  document.getElementById("info-pengiriman").innerHTML = htmlPengiriman;
}

function displayBiayaTambahan(data) {
  if(data == null) {
    document.getElementById("biaya-tambahan").remove();
    return;
  }
  let count = 1;
  let tbody = ``;
  data.forEach(v => {
      tbody += `<tr>
                  <td>${count}</td>
                  <td>${v.item}</td>
                  <td class="text-center ` + (v.berat == 0 ? `` : `rupiah`) + `">` + (v.berat == 0 ? `-` : `${v.berat}`) + `</td>
                  <td class="text-right rupiah">Rp ${v.total}</td>
              </tr>`;
              count++;
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
    $('#modal-revisi').modal('hide');
  } catch(error) {
    alertFailed(error, false)
  }
}

function modalAddRevisi(idOrder) {
  let modal = `
  <div class="modal fade" tabindex="-1" role="dialog" id="modal-revisi">
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

  $('body').append(modal);
}

const sendPembayaran = async (idOrder) => {
  let originalBtnPembayaran = $('#btn-send-pembayaran').html();
  try {
    $('#btn-send-pembayaran').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`).prop("disabled", true);
    let nominal = parseInt(document.getElementById('nominal').value.replaceAll(".", ""));
    let formData = new FormData();
    let image = $("#bukti")[0].files[0];
    formData.append('bukti', image);
    formData.append('payload', JSON.stringify({
      nominal,
    }))
    
    let result = await pembayaran.createPembayaran(idOrder, formData);
    alertSuccess(result.message)
    document.getElementById('bukti').value = "";
    let tbody = `<tr>
                  <td>${result.pembayaran.createdAt}</td>
                  <td class="text-center rupiah">${result.pembayaran.nominal}</td>
                  <td class="text-center img-bukti">
                    <a href="${result.pembayaran.bukti}">
                      <img alt="image" src="${result.pembayaran.bukti}" class="rounded" width="35">
                    </a>
                  </td>
                  <td class="text-center">${result.pembayaran.status}</td>
                </tr>`;
    $("#data-pembayaran tr:last").after(tbody);
    $(".rupiah").mask('000.000.000', {reverse: true});
    $('#modal-pembayaran').modal('hide');
  }
  catch(error) {
    alertFailed(error, false);
  }
  finally {
    $('#btn-send-pembayaran').html(originalBtnPembayaran).prop('disabled', false)
  }
}
function modalPembayaran(idOrder) {
  let modal = `
  <div class="modal fade" tabindex="-1" role="dialog" id="modal-pembayaran">
    <div class="modal-dialog" role="document">
      <form>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Kirim Bukti Pembayaran</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group col-12">
                <label class="col-form-label text-md-right">Nominal</label>
                  <input type="text" class="form-control currency" id="nominal" value="0">
              </div>
              <div class="form-group col-12">
                <label class="col-form-label text-md-right">Bukti Pembayaran</label>
                <input type="file" class="form-control" id="bukti" accept="image/*"/>
              </div>
            </div>
          </div>
          <div class="modal-footer bg-whitesmoke br">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-primary" onclick="sendPembayaran('${idOrder}')" id="btn-send-pembayaran">Kirim</button>
          </div>
        </div>
      </form>
    </div>
  </div>`;
  $('body').append(modal);
}

function displayPembayaran(data) {
  if(data == null) {
    return;
  }
  let tbody = ``;
  data.forEach(v => {
      tbody += `<tr>
                  <td>${v.createdAt}</td>
                  <td class="text-center rupiah">${v.nominal}</td>
                  <td class="text-center img-bukti">
                    <a href="${v.bukti}">
                      <img alt="image" src="${v.bukti}" class="rounded" width="35">
                    </a>
                  </td>
                  <td class="text-center">${v.status}</td>
                </tr>`;
  });
  document.getElementById("data-pembayaran").innerHTML = tbody;

  $(".img-bukti").lightGallery({
    thumbnail:true,
    getCaptionFromTitleOrAlt: false,
  }); 
}

const cancelOrder = async (idOrder) => {
  try {
    let confirm = await alertConfirm('Ingin membatalkan pesanan ini?');
      if (confirm) {
        let result = await order.cancelOrder(idOrder);
        alertSuccess(result.message);
        await setTimeout(() => {
          window.location.reload();
        }, 4000);
      }
  } catch(error) {
    alertFailed(error, false)
  }
}

function modalListRevisi(data) {
  if(data == null) {
    if (document.getElementById("btn-daftar-revisi")) {
      document.getElementById("btn-daftar-revisi").remove();
      return;
    }
    return;
  }
  let revisi = ``;
  $.each(data, function(idx, v) {
    revisi = `<div class="form-group col-12">
                <label class="col-form-label text-md-right">Revisi ke-${idx+1} (${v.createdAt})</label><br>
                <ul>
                  <li>${v.catatan}</li>
                </ul>
              </div>`;
  });

  let modal = `
  <div class="modal fade" tabindex="-1" role="dialog" id="modal-daftar-revisi">
    <div class="modal-dialog" role="document">
      <form>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Daftar Revisi</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              ${revisi}
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>`;

  $('body').append(modal);
}

const setujuiHasil = async (idOrder) => {
  try {
    let confirm = await alertConfirm('Hasil pesanan tidak dapat diubah jika sudah disetujui. Setujui hasil pesanan?');
      if (confirm) {
        let result = await order.setujuiHasilOrder(idOrder);
        alertSuccess(result.message, false);
        document.getElementById("btn-revisi").remove();
      }
  } catch(error) {
    alertFailed(error, false)
  }
}

window.cancelOrder = cancelOrder;
window.sendRevisi = sendRevisi;
window.sendPembayaran = sendPembayaran;
window.setujuiHasil = setujuiHasil;