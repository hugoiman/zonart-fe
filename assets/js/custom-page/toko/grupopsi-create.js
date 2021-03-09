import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import grupOpsi from "../../request/grupopsi.js";

const loadPage = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-grupopsi").addClass("active");
        tambahOpsi();
        $('.currency').toArray().forEach(function(field){
                new Cleave(field, {
                numeral: true,
                numeralDecimalMark: 'thousand',
                delimiter: '.',
            })
        });
    } catch(error) {
        alertFailed(error);
    }
}
loadPage();

function tambahOpsi() {
    let id = new Date().getTime();
    let htmlOpsi = document.createElement('div');
    htmlOpsi.innerHTML = `<div class="form-row opsi" id="opsi-${id}">
        <div class="form-group col-md-6 col-12 col-lg-6">
            <input type="text" class="idOpsi" value="0" hidden>
            <label class="col-form-label text-md-right">Nama Item <small>(maksimal 50 karakter)</small></label>
            <input type="text" class="form-control namaOpsi"/>
        </div>
        <div class="form-group col-md-3 col-6 col-lg-3">
            <label class="col-form-label text-md-right">Harga <small>(rupiah)</small></label>
            <input type="text" class="form-control harga currency" value="0"/>
        </div>
        <div class="form-group col-md-3 col-6 col-lg-3">
            <label class="col-form-label text-md-right">Berat <small>(gram)</small></label>
            <input type="text" class="form-control berat currency" value="0"/>
        </div>
        <div class="form-group col-md-4 col-7 col-lg-4">
            <label class="col-form-label text-md-right">Kelipatan harga per pembelian produk? 
                <sup><a class="btn btn-icon btn-sm btn-default" data-toggle="tooltip" data-placement="top" title="cont: 1 item pada pembelian 1 produk = Rp 1.000, maka untuk pembelian 2 produk = Rp 2.000"><i class="fas fa-info-circle"></i></a></sup>
            </label>
            <div class="form-check">
                <input class="form-check-input perProduk" type="checkbox">
                <label class="form-check-label" for="defaultCheck1">
                Ya
                </label>
            </div>
        </div>
        <div class="form-group col-md-2 col-5 col-lg-2">
            <label class="col-form-label text-md-right">Status</label>
            <select class="form-control status">
                <option value="true">Tersedia</option>
                <option value="false">Tidak Tersedia</option>
            </select>
        </div>
        <div class="form-group col-md-1 col-1 col-lg-1">
            <label class="col-form-label text-md-right">Aksi</label><br>
            <a href="#" class="btn btn-icon btn-sm btn-danger mt-1" onclick="hapusOpsi(${id})" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a>
        </div>
    </div>`;

    document.getElementById('data-opsi').appendChild(htmlOpsi);
}

const hapusOpsi = async (idOpsi) => {
    try {
        let confirm = await alertConfirm('Ingin menghapus opsi ini?');
        if (confirm == true) {
            $("#opsi-" + idOpsi).fadeOut(1000);
            $("#opsi-" + idOpsi).remove();
        } 
    } catch(error) {
        alertFailed(error, false);
    }
}

const buatGrupOpsi = async () => {
    try {
        let idToko = document.getElementById("idToko").value;
        let namaGrup = document.getElementById("namaGrup").value;
        let deskripsi = document.getElementById("deskripsi").value;
        let required = document.getElementById("required").checked;
        let spesificRequest = document.getElementById("spesificRequest").checked;
        let hardcopy = document.getElementById("hardcopy").checked;
        let softcopy = document.getElementById("softcopy").checked;
        let min = parseInt(document.getElementById("min").value.replaceAll(".", ""));
        let max = parseInt(document.getElementById("max").value.replaceAll(".", ""));

        let opsi = [];
        for (let i = 0; i < document.querySelectorAll('.opsi').length; i++) {
            let idOpsi =  parseInt(document.getElementsByClassName('idOpsi')[i].value);
            let namaOpsi = document.getElementsByClassName('namaOpsi')[i].value;
            let harga = parseInt(document.getElementsByClassName('harga')[i].value.replaceAll('.', ''));
            let berat = parseInt(document.getElementsByClassName('berat')[i].value.replaceAll('.', ''));
            let perProduk = document.getElementsByClassName('perProduk')[i].checked;
            let status = document.getElementsByClassName('status')[i].value;
            if(status == 'true') { status = true } 
            else { status = false }
            let jsonDataOpsi = {
                idOpsi, "opsi":namaOpsi, harga, berat, perProduk, status,
            };
            opsi.push(jsonDataOpsi);
        }   
        let jsonData = JSON.stringify({
            namaGrup, deskripsi, required, spesificRequest, min, max, hardcopy, softcopy, opsi,
        });
        let result = await grupOpsi.createGrupOpsi(idToko, jsonData);
        alertSuccess(result.message);
        await setTimeout(() => {
            window.location.href = `/${slugToko}/grup-opsi/${result.idGrupOpsi}`
        }, 4000);
    } catch(error) {
        alertFailed(error, false)
    }
}

window.buatGrupOpsi = buatGrupOpsi;
window.tambahOpsi = tambahOpsi;
window.hapusOpsi = hapusOpsi;