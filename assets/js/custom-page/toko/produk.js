import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import {getUrlPath} from "../../general/general.js";
import {getDaftarProduk, deleteProduk} from "../../request/produk.js";
import grupOpsi from "../../request/grupopsi.js";
import grupOpsiProduk from "../../request/grupopsiproduk.js";

const loadProduk = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-produk").addClass("active");
        const slugToko = await getUrlPath(1);
        document.getElementById('btn-form-produk').href = `/${slugToko}/form-produk`
        let idToko = await document.getElementById("idToko").value;
        let result = await getDaftarProduk(idToko);
        let htmlProduk = ``;
        result.produk.forEach(v => {
            htmlProduk += `<div class="col-12 col-sm-6 col-md-6 col-lg-3 content-produk-${v.idProduk}">
            <article class="article article-style-c">
              <div class="article-header">
                <img class="article-image" src="${v.gambar}">
                <div class="article-title">
                <h2><a href="/${slugToko}/produk/${v.slug}">${v.namaProduk}</a></h2>
                </div>
              </div>
              <div class="article-details">
                <div class="article-category"><a href="#"></a> <div class="bullet"></div> <a href="#">${v.status}</a></div>
                <div class="article-cta">
                    <div class="buttons">
                        <a href="#" class="btn btn-sm btn-icon btn-outline-info" onclick="showKoneksi(${v.idProduk}, '${v.namaProduk}')" data-toggle="tooltip" data-placement="top" title="Koneksi"><i class="fas fa-sitemap"></i></a>
                        <a href="/${slugToko}/produk/${v.slug}" class="btn btn-sm btn-icon btn-outline-warning" data-toggle="tooltip" data-placement="top" title="Edit"><i class="far fa-edit"></i></a>
                        <a href="#" class="btn btn-sm btn-icon btn-outline-danger" onclick="hapusProduk(${v.idProduk})" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a>
                    </div>
                </div>
              </div>
            </article>
          </div>`
        });
        document.getElementById("daftar-produk").innerHTML = htmlProduk;

        let dataGrupOpsi = await grupOpsi.getDaftarGrupOpsi(idToko);
        let htmlGrupOpsi = ``;
        dataGrupOpsi.grupopsi.forEach(v => {
            htmlGrupOpsi += `<option value="${v.idGrupOpsi}">${v.namaGrup}</option>`;
        })
        document.getElementById("data-grupopsi").innerHTML = htmlGrupOpsi;
    } catch(error) {
        console.log(error);
    }
}
loadProduk();

const hapusProduk = async (idProduk) => {
    try {
        let confirm = await alertConfirm('Ingin menghapus produk ini?');
        if (confirm) {
            let idToko = document.getElementById("idToko").value;
            let result = await deleteProduk(idToko, idProduk);
            alertSuccess(result.message);
            $(`.content-produk-${idProduk}`).fadeOut(1000);
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

const showKoneksi = async (idProduk, namaProduk) => {
    try {
        let idToko = await document.getElementById("idToko").value;
        $('#idProduk').val(idProduk);
        $('#namaProduk').text(namaProduk);
        
        $('#modal-grupopsi').modal('show');
        await loadSambunganGrupOpsi(idToko, idProduk);
    } catch(error) {
        alertFailed(error, false);
    }
};

const loadSambunganGrupOpsi = async (idToko, idProduk) => {
    try {
        let dataSambungan = await grupOpsiProduk.getSambunganGrupOpsiByProduk(idToko, idProduk);
        let htmlDataSambungkan = ``;
        $.each(dataSambungan.grupOpsiProduk, function(idx, val) {
            htmlDataSambungkan += `<tr>
                <th scope="row">${idx+1}</th>
                <td>${val.namaGrup}</td>
                <td><a href="#" class="btn btn-sm btn-icon btn-outline-danger" onclick="putusSambungan(${idToko},${val.idGrupOpsi},${val.idProduk})" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a></td>
            </tr>`;
        });
        document.getElementById("daftar-grupopsi").innerHTML = htmlDataSambungkan;
    } catch(error) {
        console.log(error)
    }
}

const hubungkan = async (idProduk, idGrupOpsi) => {
    try {
        let idToko = await document.getElementById("idToko").value;
        let result = await grupOpsiProduk.hubungkanGrupOpsi(idToko, idGrupOpsi, idProduk);
        await alertSuccess(result.message);
        await loadSambunganGrupOpsi(idToko, idProduk)
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
            loadSambunganGrupOpsi(idToko, idProduk)
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

window.hapusProduk = hapusProduk;
window.showKoneksi = showKoneksi;
window.hubungkan = hubungkan;
window.putusSambungan = putusSambungan;