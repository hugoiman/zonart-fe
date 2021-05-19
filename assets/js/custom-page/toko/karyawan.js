import loadMainStore from "../../general/mainStore.js";
import {undangKaryawan, getDaftarKaryawan, updateKaryawan} from "../../request/karyawan.js";
import gaji from "../../request/penggajian.js";
import {getDaftarUndangan, batalkanUndangan} from "../../request/undangan.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";

const loadUndangan = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-karyawan").addClass("active");
        let idToko = document.getElementById("idToko").value;
        let dataKaryawan = await getDaftarKaryawan(idToko)
        let dataUndangan = await getDaftarUndangan(idToko);
        let dataGaji = await gaji.getDaftarGaji(idToko);
        displayDataKaryawan(dataKaryawan);
        displayDataUndangan(idToko, dataUndangan);
        displayDataGaji(idToko, dataGaji);

        let htmlOptionKaryawan = ``;
        dataKaryawan.karyawan.forEach(v => {
            htmlOptionKaryawan += `<option value="${v.idKaryawan}">${v.namaKaryawan}</option>`;
        })
        document.getElementById("daftar-karyawan").innerHTML = htmlOptionKaryawan;
        $(".datepicker").datepicker({
            orientation: 'auto bottom',
            autoclose: true,
            format: 'yyyy-mm-dd'
        });
        $(".datepicker").val(moment().format("YYYY-MM-DD"));
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
loadUndangan();

function displayDataKaryawan(dataJson) {
    $("#table-karyawan").dataTable({
        autoWidth: false,
        data: dataJson.karyawan,
        "ordering": false,
        "columnDefs": [
            { "className": "text-center", "targets": [0,5] }
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
            { data: "bergabung"},
            { data: function (data, type, dataToSet) {
                    return `<a href="#" class="btn btn-sm btn-icon btn-outline-warning" onclick="showFormKaryawan('${data.idKaryawan}', '${data.namaKaryawan}', '${data.alamat}', '${data.hp}', '${data.email}', '${data.posisi}', '${data.status}')" data-toggle="tooltip" data-placement="top" title="Lihat"><i class="far fa-edit"></i></a>`;
                }
            } 
        ],
    });
}

function displayDataUndangan(idToko, dataJson) {
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
                    : status == "ditolak" ? '<center><div class="badge badge-secondary">Ditolak</div></center>'
                    : '<center><div class="badge badge-light">Dibatalkan</div></center>');
                }
            },
            { data: function (data, type, dataToSet) {
                return (data.status == "menunggu" ? `<a href="#" class="btn btn-secondary" onclick="cancelUndangan('${idToko}', '${data.idUndangan}')">Batalkan</a>`
                :``);
                }
            }        
        ],
    });
}

function displayDataGaji(idToko, dataJson) {
    $("#table-gaji").dataTable({
        autoWidth: false,
        data: dataJson.penggajian,
        "ordering": false,
        columns: [
            {   "data": null, "render": function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            { data: "namaKaryawan"},
            { data: "nominal", className: "currency"},
            { data: "tglTransaksi"},
            { data: function (data, type, dataToSet) {
                    return `<a href="#" class="btn btn-sm btn-icon btn-outline-danger" onclick="hapusGaji('${idToko}', '${data.idPenggajian}')" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a>`;
                }
            },      
        ],
    });

    $(".currency").mask('000.000.000', {reverse: true});
    $("#nominal").text("Nominal");
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

const tambahGaji = async () => {
    try {
        let idToko = document.getElementById("idToko").value;
        let idKaryawan = document.getElementById("daftar-karyawan").value;
        let nominal = parseInt(document.getElementById("nominal-gaji").value.replaceAll(".", ""));
        let tglTransaksi = document.getElementById("tglTransaksi").value;
        let jsonData = JSON.stringify({
            nominal, tglTransaksi,
        });

        let result = await gaji.createGaji(idToko, idKaryawan, jsonData);
        await alertSuccess(result.message);
        $('#tambahPenggajian').modal('hide');
    } catch(error) {
        alertFailed(error, false);
    }
}

const hapusGaji = async (idToko, idPenggajian) => {
    try {
        let confirm = await alertConfirm('Ingin menghapus data ini?');
        if (confirm) {
            let result = await gaji.deleteGaji(idToko, idPenggajian);
            alertSuccess(result.message);
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

const showFormKaryawan = async (idKaryawan, namaKaryawan, alamat = '', hp = '', email, posisi, status) => {
    $('#idKaryawan').val(idKaryawan);
    $('#namaKaryawan').val(namaKaryawan);
    $('#alamat').val(alamat);
    $('#hp').val(hp);
    $('#emailKaryawan').val(email);
    if (posisi == 'admin') {
        $("#admin").attr('checked', true);
    } else {
        $("#editor").attr('checked', true);
    }
    $("#status").val(status);
    
    $('#modal-data-karyawan').modal('show');
}

const editKaryawan = async () => {
    try {
        let idToko = $('#idToko').val();
        let idKaryawan = $('#idKaryawan').val();
        let namaKaryawan = $('#namaKaryawan').val();
        let alamat = $('#alamat').val();
        let hp = $('#hp').val();
        let email = $('#emailKaryawan').val();
        let status = $('#status').val();
        let posisi = $("input[name='posisi2']:checked").val();
        let jsonData = JSON.stringify({
            namaKaryawan, alamat, hp, email, posisi, status,
        });
        let result = await updateKaryawan(idToko, idKaryawan, jsonData)
        alertSuccess(result.message);
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    } catch(error) {
        alertFailed(error, false)
    }
}

window.rekrutKaryawan = rekrutKaryawan;
window.cancelUndangan = cancelUndangan;
window.tambahGaji = tambahGaji;
window.hapusGaji = hapusGaji;
window.showFormKaryawan = showFormKaryawan;
window.editKaryawan = editKaryawan;