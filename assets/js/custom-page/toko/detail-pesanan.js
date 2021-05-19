import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import {getUrlPath, formatRupiah, capitalFirst} from "../../general/general.js";
import order from "../../request/order.js";
import {getDaftarKaryawan} from "../../request/karyawan.js";
import bt from "../../request/biayaTambahan.js";

const loadPage = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-pesanan").addClass("active");
        const slugToko = await getUrlPath(1);
        let idToko = document.getElementById("idToko").value;

        const idOrder = await getUrlPath(3);
        const dataOrder = await order.getOrderToko(idToko, idOrder);
        displayInvoice(idToko, dataOrder);
        displayHasilOrder(dataOrder);
        displayDaftarProduk(dataOrder);
        displayRingkasanPembelian(dataOrder);
        modalBiayaTambahan(idToko, idOrder);
        displayBiayaTambahan(idToko, dataOrder);
        displayPengiriman(dataOrder);
        displayTotal(dataOrder);
        modalResi(idToko, idOrder);
        displayPembayaran(dataOrder);
        modalStatusPesanan(dataOrder);
        modalWaktuPengerjaan(dataOrder);
        modalPenangan(idToko, dataOrder);
        modalListRevisi(dataOrder.revisi);
        modalTolakOrder(idToko, idOrder);

        if (dataOrder.invoice.statusPesanan === "selesai") {
            $('.el-show').hide();
        }

        if(dataOrder.invoice.statusPembayaran === "-") {
            document.getElementById("info-pembayaran").remove();
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
        alertFailed(error, false);
    }
}

loadPage();

function displayInvoice(idToko, data) {
    let htmlInv =  `<address>
                        <strong>Nomor Invoice: ${data.invoice.idInvoice}</strong><br>
                        <strong>Status Pesanan: ${data.invoice.statusPesanan.charAt(0).toUpperCase() + data.invoice.statusPesanan.slice(1)}</strong>
                        <a class="el-show" href="#" data-toggle="modal" data-target="#modal-status-pesanan"> <i class="far fa-edit"></i></a><br><br>
                        
                        <strong>Pemesan: </strong>${data.invoice.pembeli}<br>
                        <strong>Jenis Pesanan: </strong>${data.jenisPesanan}<br>
                        <strong>Tanggal Pemesanan: </strong>${data.tglOrder}<br>
                        <strong>Rencana Pakai: </strong>${data.rencanaPakai}<br>
                        <strong>Waktu Pengerjaan: </strong><span id="waktu-pengerjaan">${data.waktuPengerjaan}</span>
                        <a class="el-show" href="#" data-toggle="modal" data-target="#modal-waktu-pengerjaan"> <i class="far fa-edit"></i></a><br>
                        <strong>Penangan Pesanan: </strong><span id=karyawan-penangan></span>
                        <a class="el-show" href="#" data-toggle="modal" data-target="#modal-penangan"> <i class="far fa-edit"></i></a><br><br>
                        
                        <strong>Total: </strong>Rp <span class="rupiah rupiah-update total-pembelian">${data.invoice.totalPembelian}</span><br>
                        <strong>Telah Dibayar: </strong>Rp <span class="badge badge-danger rupiah" id="dibayar">${data.invoice.totalBayar}</span><br>
                        <div class="buttons mt-1" id="btn-daftar-revisi">
                            <a href="#" class="btn btn-sm btn-secondary" data-toggle="modal" data-target="#modal-daftar-revisi">Daftar Revisi</a>
                        </div>
                    </address>`;
    document.getElementById("info-invoice").innerHTML = htmlInv;
}

function displayHasilOrder(data) {
    const htmlHasil = `<address>
                    <strong>Hasil Pesanan: <span id="hasil-pesanan">${capitalFirst(data.hasilOrder.status)}</span></strong>

                    <div id="display-image"></div>
                    <div class="row el-show">
                        <div class="col-sm-6 col-md-12 mt-2">
                            <input type="file" class="form-control" id="hasil" onchange="loadImage(event)"/>
                        </div>
                        <div class="col-sm-6 col-md-12 mt-2">
                            <a href="#" class="btn btn-outline-info" id="btn-upload-hasil" onclick="uploadHasil('${data.idOrder}')">Upload Hasil</a>
                        </div>
                    </div>
                </address>`;
    document.getElementById("info-hasil").innerHTML = htmlHasil;

    let hasil = `
    <a href="${data.hasilOrder.hasil.replace('upload/', 'upload/fl_attachment/')}" id="a-hasil">
        <img alt="image" class="rounded" id="image" width="150" src="${data.hasilOrder.hasil}">
        <input id="idHasilOrder" value="${data.hasilOrder.idHasilOrder}" hidden/>
    </a>`;
    document.getElementById("display-image").innerHTML = hasil;

    $("#display-image").lightGallery({
        thumbnail:true,
        getCaptionFromTitleOrAlt: false,
    }); 
}

function displayDaftarProduk(data) {
    let fotoUser = ``;
    $.each(data.fileOrder, function(idx, v) {
        if(idx < 2 || data.fileOrder.length == 3) {
            fotoUser += `<a href="${v.foto.replace('upload/', 'upload/fl_attachment/')}" class="file-user">
                            <img class="gallery-item" src="${v.foto}">
                        </a>`;
        } else if(idx == 2) {
            fotoUser += `<a href="${v.foto.replace('upload/', 'upload/fl_attachment/')}" class="file-user">
                            <div class="gallery-item gallery-more" src="${v.foto}">
                                <div id="galeri-sisa"></div>
                            </div>
                        </a>`;
        } else {
            fotoUser += `<a href="${v.foto.replace('upload/', 'upload/fl_attachment/')}" class="file-user">
                            <img class="gallery-item gallery-hide" src="${v.foto}">
                        </a>`
        }
    });

    const htmlProduk = `<li class="media">
    <img alt="image" class="rounded mr-3" width="100" src="${data.produkOrder.fotoProduk}">
    <div class="media-body mr-3 ">
      <div class="media-title"><a href="/${data.invoice.slugToko}/${data.produkOrder.slugProduk}">${data.produkOrder.namaProduk}</a></div>
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
        <a href="#" class="btn btn-sm btn-secondary" onclick="downloadFileUser('${data.invoice.idInvoice}')">Download Semua File</a>
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
                    <td class="text-right">Rp <span class="rupiah">${(data.produkOrder.hargaSatuanWajah * data.tambahanWajah)}</span></td>
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
        <div class="invoice-detail-value">Rp <span class="rupiah rupiah-update subtotal">${data.invoice.totalPembelian - data.pengiriman.ongkir}</span></div>
      </div>
      <div class="invoice-detail-item">
        <div class="invoice-detail-name">Ongkir (${data.pengiriman.kurir} - ${data.pengiriman.service} : <span class="rupiah total-berat">${data.pengiriman.berat}</span> (gr)</div>
        <div class="invoice-detail-value">Rp <span class="rupiah rupiah-update total-ongkir">${data.pengiriman.ongkir}</span></div>
      </div>
      <hr class="mt-2 mb-2">
      <div class="invoice-detail-item">
        <div class="invoice-detail-name">Total</div>
        <div class="invoice-detail-value invoice-detail-value-lg">Rp <span class="rupiah rupiah-update total-pembelian">${data.invoice.totalPembelian}</span></div>
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
          `+(data.jenisPesanan === "cetak" && data.pengiriman.kodeKurir != "cod" ? `<strong>${data.pengiriman.kurir} - ${data.pengiriman.service}</strong><br>
          No. Resi: <span id="no-resi">${data.pengiriman.resi} </span>
          <a class="el-show" href="#" data-toggle="modal" data-target="#modal-resi"> <i class="far fa-edit"></i></a><br>`: '')+
          `Dikirim kepada <strong>${data.pengiriman.penerima}</strong><br>
          ${data.pengiriman.alamat}<br>
          ${data.pengiriman.kota}<br>
          ${data.pengiriman.telp}
        </address>
      </div>
    </div>`;
  document.getElementById("info-pengiriman").innerHTML = htmlPengiriman;
}

function displayBiayaTambahan(idToko, data) {
    if(data.biayaTambahan == null) {
        return;
    }
    let count = 1;
    let tbody = ``;
    data.biayaTambahan.forEach(v => {
        tbody += `<tr id="row-${v.idBiayaTambahan}">
                    <td>${count}</td>
                    <td>${v.item}</td>
                    <td class="text-center ` + (v.berat == 0 ? `` : `rupiah rupiah-update`) + `">` + (v.berat == 0 ? `-` : `${v.berat}`) + `</td>
                    <td class="text-right rupiah rupiah-update">Rp ${v.total}</td>
                    <td class="text-right"><a href="#" class="btn btn-sm btn-icon btn-outline-danger el-show" onclick="hapusBiayaTambahan('${idToko}', '${data.idOrder}', '${v.idBiayaTambahan}')" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a></td>
                </tr>`;
                count++;
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
            await setTimeout(() => {
                window.location.reload();
            }, 4000);
        } else if (statusPesanan == 'ditolak') {
            $('#modal-tolak-order').modal('show');
        } else if (statusPesanan == 'selesai') {
            let result = await order.selesaikanPesanan(idToko, idOrder)
            alertSuccess(result.message);
            await setTimeout(() => {
                window.location.reload();
            }, 4000);
        } else {}
    }
    catch(error) {
        alertFailed(error, false);
    } finally {
        $('#modal-status-pesanan').modal('hide');
    }
}

const setWaktuPengerjaan = async (idOrder) => {
    try {
        let waktuPengerjaan = document.getElementById('waktuPengerjaan').value;
        let idToko = document.getElementById('idToko').value;
        let jsonData = JSON.stringify({
            waktuPengerjaan,
        });
        let result = await order.setWaktuPengerjaan(idToko, idOrder, jsonData);
        $("#waktu-pengerjaan").text(waktuPengerjaan);
        $('#modal-waktu-pengerjaan').modal('hide');
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
    let originalBtnUploadHasil = $('#btn-upload-hasil').html();
    try {
        $('#btn-upload-hasil').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...`).prop("disabled", true);
        let idHasilOrder = parseInt(document.getElementById('idHasilOrder').value);
        let idToko = document.getElementById('idToko').value;
        let formData = new FormData();
        let image = $("#hasil")[0].files[0];
        formData.append('hasil', image);
        formData.append('payload', JSON.stringify({
            idHasilOrder,
        }))

        let result = await order.uploadHasilOrder(idToko, idOrder, formData);
        alertSuccess(result.message);
        await setTimeout(() => {
            window.location.reload();
        }, 4000);
    }
    catch(error) {
        console.log(error);
        alertFailed(error, false);
    } finally {
        $('#btn-upload-hasil').html(originalBtnUploadHasil).prop('disabled', false);
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
    await setTimeout(() => {
        window.location.reload();
    }, 4000);
  }
  catch(error) {
    alertFailed(error, false);
  }
}

function displayPembayaran(data) {
    if(data.pembayaran == null) {
        return;
    }
    let tbody = ``;
    data.pembayaran.forEach(v => {
        tbody += `<tr>
                    <td>${v.createdAt}</td>
                    <td class="text-center rupiah">${v.nominal}</td>
                    <td class="text-center img-bukti">
                      <a href="${v.bukti}">
                        <img alt="image" src="${v.bukti}" class="rounded" width="35">
                      </a>
                    </td>
                    <td class="text-center">${v.status}</td>
                    <td class="text-right">` + 
                        (v.status == 'Menunggu Konfirmasi' ? `<a href="#" class="btn btn-sm btn-icon btn-outline-primary" onclick="konfirmasiPembayaran('${data.idOrder}','${v.idPembayaran}')" data-toggle="tooltip" data-placement="top" title="Terima Pembayaran">Terima</a>` : ``) +
                    `</td>
                  </tr>`;
    });
    document.getElementById("data-pembayaran").innerHTML = tbody;
    $(".img-bukti").lightGallery({
        thumbnail:true,
        getCaptionFromTitleOrAlt: false,
    }); 
}

const konfirmasiPembayaran = async (idOrder, idPembayaran) => {
    try {
        let idToko = document.getElementById('idToko').value;
        let result = await order.konfirmasiPembayaranOrder(idToko, idOrder, idPembayaran);
        alertSuccess(result.message);
        await setTimeout(() => {
            window.location.reload();
        }, 4000);
    }
    catch(error) {
        console.log(error);
    }
}

function modalBiayaTambahan(idToko, idOrder) {
    let modal = `
    <div class="modal fade" tabindex="-1" role="dialog" id="modal-tambahan">
      <div class="modal-dialog" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Biaya Tambahan</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group col-12">
                    <label class="col-form-label text-md-right">Nama Item</label>
                    <input type="text" class="form-control" id="item">
                </div>
                <div class="form-group col-12">
                    <label class="col-form-label text-md-right">Harga</label>
                    <input type="text" class="form-control currency" id="total" value="0">
                </div>
                <div class="form-group col-12">
                    <label class="col-form-label text-md-right">Berat <small>(gram)</smal></label>
                    <input type="text" class="form-control currency" id="berat" value="0">
                </div>
              </div>
            </div>
            <div class="modal-footer bg-whitesmoke br">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="button" class="btn btn-primary" onclick="buatBiayaTambahan('${idToko}', '${idOrder}')">Kirim</button>
            </div>
          </div>
        </form>
      </div>
    </div>`;
    $('body').append(modal);
}

const buatBiayaTambahan = async (idToko, idOrder) => {
    try {
        let item = document.getElementById("item").value;
        let berat = parseInt(document.getElementById("berat").value.replaceAll('.', ''));
        let total = parseInt(document.getElementById("total").value.replaceAll('.', ''));
        let jsonData = JSON.stringify({
            item, berat, total,
        });
        let result = await bt.createBiayaTambahan(idToko, idOrder, jsonData);
        $('#modal-tambahan').modal('hide');
        alertSuccess(result.message);

        document.getElementById("item").value = "";
        document.getElementById("berat").value = "0";
        document.getElementById("total").value = "0";

        updateBiayaTambahan(idToko, idOrder);
    }
    catch(error) {
        alertFailed(error);
    }
}

const updateBiayaTambahan = async (idToko, idOrder) => {
    try {
        const dataOrder = await order.getOrderToko(idToko, idOrder);
        displayBiayaTambahan(idToko, dataOrder);
        
        $(".total-pembelian").text(formatRupiah(dataOrder.invoice.totalPembelian));
        $(".total-berat").text(formatRupiah(dataOrder.pengiriman.berat));
        $(".total-ongkir").text(formatRupiah(dataOrder.pengiriman.ongkir));
        $(".subtotal").text(formatRupiah(dataOrder.invoice.totalPembelian-dataOrder.pengiriman.ongkir));
        $(".rupiah-update").mask('000.000.000', {reverse: true});
    } catch(error) {
        alertFailed(error, false)
    }
}

const hapusBiayaTambahan = async (idToko, idOrder, idBiayaTambahan) => {
    try {
        let confirm = await alertConfirm('Ingin menghapus biaya tambahan ini?');
        if (confirm) {
            let result = await bt.deleteBiayaTambahan(idToko, idOrder, idBiayaTambahan);
            alertSuccess(result.message);
            $(`row-${idBiayaTambahan}`).fadeOut(1000);
            updateBiayaTambahan(idToko, idOrder)
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

function modalResi(idToko, idOrder) {
    let modal = `
    <div class="modal fade" tabindex="-1" role="dialog" id="modal-resi">
      <div class="modal-dialog" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Input Nomor Resi</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group col-12">
                    <label class="col-form-label text-md-right">Nomor Resi</label>
                    <input type="text" class="form-control" id="resi">
                </div>
              </div>
            </div>
            <div class="modal-footer bg-whitesmoke br">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="button" class="btn btn-primary" onclick="inputResi('${idToko}', '${idOrder}')">Simpan</button>
            </div>
          </div>
        </form>
      </div>
    </div>`;
    $('body').append(modal);
}

const inputResi = async (idToko, idOrder) => {
    try {
        let resi = document.getElementById("resi").value;
        let jsonData = JSON.stringify({
            resi,
        });
        const result = await order.inputResi(idToko, idOrder, jsonData);
        $('#modal-resi').modal('hide');
        $("#no-resi").text(resi);
        alertSuccess(result.message);
    } catch(error) {
        alertFailed(error, false)
    }
}

function modalStatusPesanan(data) {
    let optionStatus = ``;
    if (data.invoice.statusPesanan == "menunggu konfirmasi") {
        optionStatus = `<option selected disabled>Menunggu Konfirmasi</option>
                        <option value="diproses">Diproses</option>
                        <option value="ditolak">Tolak Pesanan</option>`;
    } else if (data.invoice.statusPesanan == "diproses") {
        optionStatus = `<option selected disabled>Diproses</option>
                        <option value="selesai">Selesai</option>`;
    }

    let modal = `
    <div class="modal fade" tabindex="-1" role="dialog" id="modal-status-pesanan">
      <div class="modal-dialog" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Status Pesanan</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-12">
                        <select class="form-control form-control-sm" id="statusPesanan">
                            ${optionStatus}
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer bg-whitesmoke br">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="button" class="btn btn-primary" onclick="prosesStatus('${data.idOrder}')">Simpan</button>
            </div>
          </div>
        </form>
      </div>
    </div>`;
    $('body').append(modal);
}

function modalWaktuPengerjaan(data) {
    let modal = `
    <div class="modal fade" tabindex="-1" role="dialog" id="modal-waktu-pengerjaan">
      <div class="modal-dialog" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Waktu Pengerjaan</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group col-12">
                        <input class="form-control form-control-sm" id="waktuPengerjaan" placeholder="cont. 4 hari, 3-5 hari">
                    </div>
                </div>
            </div>
            <div class="modal-footer bg-whitesmoke br">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="button" class="btn btn-primary" onclick="setWaktuPengerjaan('${data.idOrder}')">Simpan</button>
            </div>
          </div>
        </form>
      </div>
    </div>`;
    $('body').append(modal);
}

const modalPenangan = async (idToko, data) => {
    try {
        let result = await getDaftarKaryawan(idToko);
        let listKaryawan = `<option value=""></option>`;
        result.karyawan.forEach(v => {
            if (v.posisi != 'editor' || v.status != 'aktif') {} 
            else if (v.status == 'aktif' && data.penangan.idKaryawan == v.idKaryawan ) {
                listKaryawan += `<option selected value="${v.idKaryawan}">${v.namaKaryawan}</option>`;
                $("#karyawan-penangan").text(v.namaKaryawan);
            } else if (v.status == 'aktif') {
                listKaryawan += `<option value="${v.idKaryawan}">${v.namaKaryawan}</option>`;
            }
        });

        let modal = `
        <div class="modal fade" tabindex="-1" role="dialog" id="modal-penangan">
            <div class="modal-dialog" role="document">
                <form>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Penangan Pesanan</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-row">
                                <div class="form-group col-12">
                                    <select class="form-control form-control-sm selectric" id="karyawan">
                                        ${listKaryawan}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer bg-whitesmoke br">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" onclick="setPenangan('${data.idOrder}')">Simpan</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>`;
        $('body').append(modal);
    } catch(error) {
        alertFailed(error, false);
    }
}

function modalListRevisi(data) {
    if(data == null) {
      document.getElementById("btn-daftar-revisi").remove();
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

function modalTolakOrder(idToko, idOrder) {
    let modal = `
    <div class="modal fade" tabindex="-1" role="dialog" id="modal-tolak-order">
      <div class="modal-dialog" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group col-12">
                  <label class="col-form-label text-md-right">Alasan penolakan</label>
                    <input type="text" class="form-control" id="keterangan">
                </div>
              </div>
            </div>
            <div class="modal-footer bg-whitesmoke br">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="button" class="btn btn-primary" onclick="tolakOrder('${idToko}','${idOrder}')">Kirim</button>
            </div>
          </div>
        </form>
      </div>
    </div>`;
    $('body').append(modal);
}

const tolakOrder = async (idToko, idOrder) => { 
    try {
        let keterangan = document.getElementById('keterangan').value;
        let jsonData = JSON.stringify({
            keterangan,
        });
        let result = await order.tolakPesanan(idToko, idOrder, jsonData);

        alertSuccess(result.message);
        await setTimeout(() => {
            window.location.reload();
        }, 4000);
    } catch(error) {
        alertFailed(error, false);
    } finally {
        document.getElementById('keterangan').value = "";
        $('#modal-tolak-order').modal('hide');
    }
}

function downloadFileUser(idInvoice) {
    var zip = new JSZip();
    var count = 1;
    var zipFilename = `order_${idInvoice}.zip`;
    var urls = [
        'https://res.cloudinary.com/dbddhr9rz/image/upload/fl_attachment/v1616138117/zonart/order/avatar-1_oaxb6w.png',
        'https://res.cloudinary.com/dbddhr9rz/image/upload/fl_attachment/v1616138117/zonart/order/avatar-2_tasym3.png',
        'https://res.cloudinary.com/dbddhr9rz/image/upload/fl_attachment/v1615968816/zonart/order/avatar-2_wphqzg.png',
    ];

    urls.forEach(function(url){
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                throw err; // or handle the error
            }
            try {
                zip.file("file_" + count + ".jpg", data, {binary:true});
                count++;
                if (count == urls.length) {
                    zip.generateAsync({type:"blob"}).then(function (blob) {
                        saveAs(blob, zipFilename);
                    });
                }
            } catch(error) {
                alertFailed(error, false);
            }
        });
    });
}

window.prosesStatus = prosesStatus;
window.setWaktuPengerjaan = setWaktuPengerjaan;
window.loadImage = loadImage;
window.uploadHasil = uploadHasil;
window.setPenangan = setPenangan;
window.konfirmasiPembayaran = konfirmasiPembayaran;
window.buatBiayaTambahan = buatBiayaTambahan;
window.hapusBiayaTambahan = hapusBiayaTambahan;
window.updateBiayaTambahan = updateBiayaTambahan;
window.inputResi = inputResi;
window.downloadFileUser = downloadFileUser;
window.tolakOrder = tolakOrder;