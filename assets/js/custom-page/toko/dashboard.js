import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import {getUrlPath} from "../../general/general.js";
import pembukuan from "../../request/pembukuan.js";
import order from "../../request/order.js";

let dataPembukuan;
const loadPage = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-order").addClass("active");
        const slugToko = await getUrlPath(1);
        let idToko = document.getElementById("idToko").value;
        let result = await pembukuan.getDaftarPembukuan(idToko)
        dataPembukuan = result;
        const dataOrder = await order.getOrdersToko(idToko);
        let a = document.getElementById('user-position').value;
        
        displayPembukuan();
        displayInfoTotalOrder(dataOrder);

        $(".datepicker").val(moment().format("MMM YYYY"));
        $(".datepicker").datepicker({
            orientation: 'auto bottom',
            autoclose: true,
            viewMode: "months",
            minViewMode: "months"
        });
        
        $("#tglTransaksi").val(moment().format("DD-MM-YYYY"));
        $("#tglTransaksi").datepicker();
        $('.currency').toArray().forEach(function(field){
            new Cleave(field, {
                numeral: true,
                numeralDecimalMark: 'thousand',
                delimiter: '.',
            })
        });
    } catch(error) {
        console.log(error);
    }
}
loadPage();

function displayPembukuan() {
    let idToko = document.getElementById('idToko').value;
    let periode = $('#periode').val();
    let periodePembukuan = [];
    let pemasukan = 0;
    let pengeluaran = 0;
    let laba = 0;

    dataPembukuan.pembukuan.forEach(v => {
        if(_.includes(v.tglTransaksi, periode)) {
            periodePembukuan.push(v);
            if(v.jenis == 'pemasukan') {
                pemasukan += v.nominal;
            } else if(v.jenis == 'pengeluaran') {
                pengeluaran += v.nominal;
            }
        }
    });

    laba = pemasukan - pengeluaran;

    $('#total-pemasukan').text(pemasukan).mask('000.000.000');
    $('#total-pengeluaran').text(pengeluaran).mask('000.000.000');
    $('#total-laba').text(laba).mask('000.000.000');

    let table = $("#table-pembukuan").dataTable();
    table.fnClearTable();
    table.fnDestroy();
    // $('#table-pembukuan').empty();
    
    table = $("#table-pembukuan").dataTable({
        searching: false, 
        "lengthChange": false,
        autoWidth: false,
        data: periodePembukuan,
        "ordering": false,
        "iDisplayLength": 100,
        "columnDefs": [
            { "title": "#", "targets": 0 },
            { "title": "Tgl Transaksi", "width": "15%", "targets": 1 },
            { "title": "Keterangan", "width": "50%", "targets": 2 },
            { "title": "Pemasukan", "className": "text-center", "width": "13%", "targets": 3 },
            { "title": "Pengeluaran", "className": "text-center", "width": "13%", "targets": 4 },
            { "title": "", "width": "5%", "targets": 5 },
        ],
        columns: [
            {   "data": null, "render": function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            { data: "tglTransaksi"},
            { data: "keterangan"},
            { data: function (data, type, dataToSet) {
                    return (data.jenis == 'pemasukan' ? `${data.nominal}` : ``);
                }, className: "text-center nominal"
            },
            { data: function (data, type, dataToSet) {
                    return (data.jenis == 'pengeluaran' ? `${data.nominal}` : ``);
                }, className: "text-center nominal"
            },
            { data: function (data, type, dataToSet) {
                    return `<a href="#" class="btn btn-sm btn-icon btn-outline-danger" onclick="hapusPembukuan('${idToko}', '${data.idPembukuan}')" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a>`;
                }
            },      
        ],
    });

    $(".nominal").mask('000.000.000', {reverse: true});
    $("#pemasukan").text("Pemasukan");
    $("#pengeluaran").text("Pengeluaran");
    // formatRupiah();
}

function displayInfoTotalOrder(dataOrder) {
    let order_total = dataOrder.order.length;
    let order_proses = dataOrder.order.filter(({invoice}) => invoice.statusPesanan === 'diproses').length;
    let order_antrian = dataOrder.order.filter(({invoice}) => invoice.statusPesanan === 'menunggu konfirmasi').length;
    let order_selesai = dataOrder.order.filter(({invoice}) => invoice.statusPesanan === 'selesai').length;

    document.getElementById('total-pesanan').textContent = order_total;
    document.getElementById('antrian-pesanan').textContent = order_proses;
    document.getElementById('pesanan-diproses').textContent = order_antrian;
    document.getElementById('pesanan-selesai').textContent = order_selesai;
}

const tambahPembukuan = async () => {
    let originalBtn = $('#btn-create-pembukuan').html();
    try {
        $('#btn-create-pembukuan').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`).prop("disabled", true);
        let idToko = document.getElementById("idToko").value;
        let keterangan = $('#keterangan').val();
        let jenis = $('#jenis').val();
        let nominal = parseInt($('#nominal').val().replaceAll(".", ""));
        let tgl = $('#tglTransaksi').val().split("-");
        let tglTransaksi = `${tgl[2]}-${tgl[1]}-${tgl[0]}`;
        let jsonData = JSON.stringify({
            keterangan, jenis, nominal, tglTransaksi,
        });
        let result = await pembukuan.createPembukuan(idToko, jsonData);
        alertSuccess(result.message);
        $('#modal-tambah-pembukuan').modal('hide');
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    } catch(error) {
        alertFailed(error, false);
    } finally {
        $('#btn-create-pembukuan').html(originalBtn).prop('disabled', false)
    }
}

const hapusPembukuan = async (idToko, idPembukuan) => {
    try {
        let confirm = await alertConfirm('Ingin menghapus data ini?');
        if (confirm) {
            let result = await pembukuan.deletePembukuan(idToko, idPembukuan);
            alertSuccess(result.message);
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

window.tambahPembukuan = tambahPembukuan;
window.hapusPembukuan = hapusPembukuan;
window.displayPembukuan = displayPembukuan;