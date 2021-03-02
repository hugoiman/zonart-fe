import loadMainStore from "../../general/mainStore.js";
import {undangKaryawan, getDaftarKaryawan} from "../../request/karyawan.js";
import {getDaftarUndangan, batalkanUndangan} from "../../request/undangan.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";

const loadUndangan = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-karyawan").addClass("active");
        let idToko = document.getElementById("idToko").value;
        let dataKaryawan = await getDaftarKaryawan(idToko)
        let dataUndangan = await getDaftarUndangan(idToko);
        displayDataKaryawan(dataKaryawan);
        displayDataUndangan(dataUndangan);
    } catch(error) {
        console.log(error);
    }
}
loadUndangan();

function displayDataKaryawan(dataJson) {
    $("#table-karyawan").dataTable({
        autoWidth: false,
        data: dataJson.karyawan,
        "ordering": false,
        "columnDefs": [
            { "className": "text-center", "targets": [0,5] },
            { "className": "text-right", "targets": [6] }
        ],
        columns: [
            {   "data": null, "render": function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            { data: "namaKaryawan"},
            { data: "hp"},
            { data: "email"},
            { data: "posisi"},
            { data: "status",
                render: function (status) {
                    return (status == "aktif" ? '<center><div class="badge badge-success">Aktif</div></center>'
                    : '<center><div class="badge badge-secondary">Tidak Aktif</div></center>');
                }
            },
            { data: "bergabung"}        
        ],
    });
}

function displayDataUndangan(dataJson) {
    $("#table-undangan").dataTable({
        autoWidth: false,
        data: dataJson.undangan,
        "ordering": false,
        "columnDefs": [
            { "className": "text-center", "targets": [0,4] },
            { "className": "text-right", "targets": [5] }
        ],
        columns: [
            {   "data": null, "render": function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            { data: "namaCustomer"},
            { data: "posisi"},
            { data: "email"},
            { data: "status",
                render: function (status) {
                    return (status == "menunggu" ? '<center><div class="badge badge-warning">Menunggu</div></center>'
                    : status == "diterima" ? '<center><div class="badge badge-success">Diterima</div></center>'
                    : status == "ditolak" ? '<center><div class="badge badge-danger">Ditolak</div></center>'
                    : '<center><div class="badge badge-secondary">Dibatalkan</div></center>');
                }
            },
            { data: function (data, type, dataToSet) {
                return (data.status == "menunggu" ? `<a href="#" class="btn btn-secondary" onclick="cancelUndangan(${data.idToko}, ${data.idUndangan})">Batalkan</a>`
                :``);
                }
            }        
        ],
    });
}

const rekrutKaryawan = async () => {
    try {
        let idToko = document.getElementById("idToko").value;
        let email = document.getElementById("email").value;
        let posisi = document.querySelector('.input-posisi:checked').value;
        let jsonData = JSON.stringify({
            email, posisi,
        });
        let result = await undangKaryawan(idToko, jsonData);
        await alertSuccess(result.message);
        $('#rekrutKaryawan').modal('hide');
        await setTimeout(() => {
            window.location.reload();
        }, 4000);
    } catch(error) {
        alertFailed(error, false);
    }
}

const cancelUndangan = async (idToko, idUndangan) => {
    try {
        let confirm = await alertConfirm('Ingin membatalkan undangan ini?');
        if (confirm) {
            let result = await batalkanUndangan(idToko, idUndangan);
            alertSuccess(result.message);
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

window.rekrutKaryawan = rekrutKaryawan;
window.cancelUndangan = cancelUndangan;