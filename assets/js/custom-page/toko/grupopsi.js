import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import {getUrlPath} from "../../general/general.js";
import grupOpsi from "../../request/grupopsi.js";
import grupOpsiProduk from "../../request/grupopsiproduk.js";
import {getDaftarProduk} from "../../request/produk.js";

const loadGrupOpsi = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-grupopsi").addClass("active");
        const slugToko = await getUrlPath(1);
        document.getElementById('btn-form-grupOpsi').href = `/${slugToko}/form-grup-opsi`;
        let idToko = await document.getElementById("idToko").value;
        let dataGrupOpsi = await grupOpsi.getDaftarGrupOpsi(idToko);
        displayGrupOpsi(slugToko, dataGrupOpsi);
        let dataProduk = await getDaftarProduk(idToko);
        let htmlProduk = ``;
        dataProduk.produk.forEach(v => {
            htmlProduk += `<option value="${v.idProduk}">${v.namaProduk}</option>`;
        })
        document.getElementById("data-produk").innerHTML = htmlProduk;
    } catch(error) {
        alertFailed(error, false);
    }
}
loadGrupOpsi();


function displayGrupOpsi(slugToko, dataJson) {
    $("#table-grupopsi").dataTable({
        autoWidth: false,
        data: dataJson.grupopsi,
        "ordering": false,
        'fnCreatedRow': function (row, data, idx) {
            $(row).attr('id', `row-${data.idGrupOpsi}`); // or whatever you choose to set as the id
        },
        columns: [
            {   "data": null, "render": function (data, type, full, meta) {
                    return meta.row + 1;
                },
            },
            { data: "namaGrup"},
            { data: function (data, type, dataToSet) {
                return (data.required == false ? `<p> Optional, max = ${data.max}</p>`
                :`<p> Wajib diisi, max = ${data.max}</p>`);
                }
            },  
            { data: function (data, type, dataToSet) {
                return `<buttons>
                            <a href="#" class="btn btn-sm btn-icon btn-outline-info" onclick="showKoneksi(${data.idGrupOpsi}, '${data.namaGrup}')" data-toggle="tooltip" data-placement="top" title="Koneksi"><i class="fas fa-sitemap"></i></a>
                            <a href="/${slugToko}/grup-opsi/${data.idGrupOpsi}" class="btn btn-sm btn-icon btn-outline-warning" data-toggle="tooltip" data-placement="top" title="Edit"><i class="far fa-edit"></i></a>
                            <a href="#" class="btn btn-sm btn-icon btn-outline-danger" onclick="hapusGrupOpsi(${data.idToko},${data.idGrupOpsi})" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a>
                        </buttons>`;
                }
            },  
        ],
    });
}

const showKoneksi = async (idGrupOpsi, namaGrup) => {
    try {
        let idToko = await document.getElementById("idToko").value;
        $('#idGrupOpsi').val(idGrupOpsi);
        $('#namaGrup').text(namaGrup);

        $('#modal-grupopsi').modal('show');
        await loadSambunganGrupOpsi(idToko, idGrupOpsi);
    } catch(error) {
        alertFailed(error, false);
    }
};

const loadSambunganGrupOpsi = async (idToko, idGrupOpsi) => {
    try {
        let dataSambungan = await grupOpsiProduk.getSambunganGrupOpsi(idToko, idGrupOpsi);
        let htmlDataSambungkan = ``;
        $.each(dataSambungan.grupOpsiProduk, function(idx, val) {
            htmlDataSambungkan += `<tr>
                <th scope="row">${idx+1}</th>
                <td>${val.namaProduk}</td>
                <td><a href="#" class="btn btn-sm btn-icon btn-outline-danger" onclick="putusSambungan(${idToko},${val.idGrupOpsi},${val.idProduk})" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a></td>
            </tr>`;
        });
        document.getElementById("daftar-produk").innerHTML = htmlDataSambungkan;
    } catch(error) {
        console.log(error)
    }
    
}

const hubungkan = async (idProduk, idGrupOpsi) => {
    try {
        let idToko = await document.getElementById("idToko").value;
        let result = await grupOpsiProduk.hubungkanGrupOpsi(idToko, idGrupOpsi, idProduk);
        await alertSuccess(result.message);
        await loadSambunganGrupOpsi(idToko, idGrupOpsi)
    } catch(error) {
        alertFailed(error, false);
    }
}

const putusSambungan = async (idToko, idGrupOpsi, idProduk) => {
    try {
        let confirm = await alertConfirm('Ingin memutuskan hubungan ke produk ini?');
        if (confirm) {
            let result = grupOpsiProduk.putusSambunganGrupOpsi(idToko, idGrupOpsi, idProduk);
            alertSuccess(result.message);
            loadSambunganGrupOpsi(idToko, idGrupOpsi)
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

const hapusGrupOpsi = async (idToko, idGrupOpsi) => {
    try {
        let confirm = await alertConfirm('Produk yang terhubung grup opsi ini akan otomatis diputus. Hapus grup opsi ini? ');
        if (confirm) {
            let result = await grupOpsi.deleteGrupOpsi(idToko, idGrupOpsi);
            alertSuccess(result.message);
            $(`#row-${idGrupOpsi}`).fadeOut(1000);
            $(`#row-${idGrupOpsi}`).remove();
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

window.hapusGrupOpsi = hapusGrupOpsi;
window.showKoneksi = showKoneksi;
window.hubungkan = hubungkan;
window.putusSambungan = putusSambungan;