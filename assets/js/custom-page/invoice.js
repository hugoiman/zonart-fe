import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {getUrlParameter} from "../general/general.js";
import invoice from "../request/invoice.js";

const loadPage = async () => {
    try {
        const loadmain = await loadMain();
        const idInvoice = await getUrlParameter('id');
        const data = await invoice.getInvoice(idInvoice);
        displayInvoice(data);
        displayRingkasanPembelian(data);
        displayTotal(data);

        if(data.biayaTambahan != null) {
            displayBiayaTambahan(data.biayaTambahan);
        } else if(data.biayaTambahan == null) {
            document.getElementById("biaya-tambahan").remove();
        }

        if(data.jenisPesanan === "cetak") {
            displayPengiriman(data.pengiriman);
        }

        $(".rupiah").mask('000.000.000', {reverse: true});
    } catch(error) {
        alertFailed(error, false);
    }
}

loadPage();

function displayInvoice(data) {
    const htmlInv = `<h5>Invoice #${data.idInvoice} - 
        ` + (data.invoice.statusPembayaran === 'lunas' ? '<span class="badge badge-success">Lunas</span>' : '') + `
    </h5>
    <address>
      <strong>Penjual: </strong>${data.invoice.namaToko}<br>
      <strong>Tanggal: </strong>${data.tglOrder}
    </address>`;
    document.getElementById("info-invoice").innerHTML = htmlInv;
}

function displayPengiriman(data) {
    const htmlPengiriman = `<address>
    <strong>Tujuan Pengiriman:</strong><br>
        ${data.penerima}<br>
        ${data.alamat}<br>
        ${data.kota}<br>
        ${data.telp}
    </address>`;
    document.getElementById("info-pengiriman").innerHTML = htmlPengiriman;
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