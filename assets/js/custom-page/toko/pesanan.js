import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import {getUrlPath} from "../../general/general.js";
import order from "../../request/order.js";

const loadPage = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-pesanan").addClass("active");
        const slugToko = await getUrlPath(1);
        let idToko = document.getElementById("idToko").value;
        const data = await order.getOrdersToko(idToko)
        let position = document.getElementById('user-position').value;
        displayOrders("order-all", data.order);
        displayOrders("order-proses", data.order.filter(v => v.invoice.statusPesanan === "diproses"));
        displayOrders("order-selesai", data.order.filter(v => v.invoice.statusPesanan === "selesai"));
        displayOrders("order-menunggu", data.order.filter(v => v.invoice.statusPesanan === "menunggu konfirmasi"));
        displayOrders("order-batal", data.order.filter(v => v.invoice.statusPesanan === "dibatalkan"));
        displayOrders("order-tolak", data.order.filter(v => v.invoice.statusPesanan === "ditolak"));

        if(position === "editor") {
            $('.hide').remove();
        }

        $(".rupiah").mask('000.000.000', {reverse: true});
        $('.total').text('Total');
        $('.tagihan').text('Tagihan');
    } catch(error) {
        console.log(error);
    }
}
loadPage();

function displayOrders(id, dataJson) {
    if(dataJson.length == 0) {
        return;
    }
    $(`#${id}`).dataTable({
        autoWidth: false,
        data: dataJson,
        columnDefs: [
            { "title": "#", "targets": 0, orderable: false},
            { "title": "Tgl", "targets": 1},
            { "title": "Inv" , "targets": 2},
            { "title": "Produk", "targets": 3},
            { "title": "Total", "targets": 4, "className": "total"},
            { "title": "Tagihan", "targets": 5, "className": "tagihan"},
            { "title": "Status", "targets": 6},
            { "title": "", "targets": 7},
            { "className": "text-center", "targets": [0, 6] }
        ],
        columns: [
            {   "data": null, "render": function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            { data: "tglOrder"},
            { data: "invoice.idInvoice"},
            { data: "produkOrder.namaProduk"},
            { data: "invoice.totalPembelian", "className": "rupiah"},
            { data: "invoice.tagihan", "className": "rupiah"},
            { data: "invoice.statusPesanan",
                render: function (status) {
                    return (status == "menunggu konfirmasi" ? '<span class="badge badge-warning">Menunggu</span>' :
                            status == "diproses" ? '<div class="badge badge-primary">Diproses</div>' :
                            status == "selesai" ? '<div class="badge badge-success">Selesai</div>' :
                            status == "dibatalkan" ? '<div class="badge badge-secondary">Dibatalkan</div>' :
                            '<div class="badge badge-secondary">Ditolak</div>');
                }
            },
            { data: function (data, type, dataToSet) {
                    return `<a href="/${data.invoice.slugToko}/pesanan/${data.idOrder}" class="btn btn-sm btn-icon btn-outline-info" data-toggle="tooltip" data-placement="top" title="Lihat"><i class="fas fa-eye"></i></a>`;
                }
            } 
        ],
    });
    $(`#total-${id}`).text(dataJson.length);
}