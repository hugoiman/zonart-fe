import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {getUrlParameter, capitalFirst} from "../general/general.js";
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
    const htmlInv = `<h5>Invoice #${data.invoice.idInvoice}</h5>
    <address>
      <strong>Penjual: </strong>${data.invoice.namaToko}<br>
      <strong>Tanggal: </strong>${data.tglOrder}<br>
      <strong>Status Pesanan: ${capitalFirst(data.invoice.statusPesanan)}</strong><br>
      <strong>Status Pembayaran: ${capitalFirst(data.invoice.statusPembayaran)}</strong>
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

function displayBiayaTambahan(data) {
    let count = 1;
    let tbody = ``;
    data.forEach(v => {
        tbody += `<tr>
                    <td>${count}</td>
                    <td>${v.item}</td>
                    <td class="text-center rupiah">${v.berat}</td>
                    <td class="text-right rupiah">Rp ${v.total}</td>
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

function printInvoice() {   
    $("#invoice-print").printThis({
        debug: false,               // show the iframe for debugging
        importCSS: true,            // import parent page css
        importStyle: false,         // import style tags
        printContainer: true,       // print outer container/$.selector
        loadCSS: "",                // path to additional css file - use an array [] for multiple
        pageTitle: "",              // add title to print page
        removeInline: false,        // remove inline styles from print elements
        removeInlineSelector: "*",  // custom selectors to filter inline styles. removeInline must be true
        printDelay: 333,            // variable print delay
        header: null,               // prefix to html
        footer: null,               // postfix to html
        base: false,                // preserve the BASE tag or accept a string for the URL
        formValues: true,           // preserve input/form values
        canvas: false,              // copy canvas content
        doctypeString: '...',       // enter a different doctype for older markup
        removeScripts: false,       // remove script tags from print content
        copyTagClasses: false,      // copy classes from the html & body tag
        beforePrintEvent: null,     // function for printEvent in iframe
        beforePrint: null,          // function called before iframe is filled
        afterPrint: null            // function called before iframe is removed
    });
}

window.printInvoice = printInvoice;