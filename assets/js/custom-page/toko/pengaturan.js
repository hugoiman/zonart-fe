import loadMainStore from "../../general/mainStore.js";
import rajaOngkir from "../../request/rajaOngkir.js";
import {getToko, updateToko} from "../../request/toko.js";
import cloudinary from "../../request/cloudinary.js";
import getAllKurir from "../../request/jasaPengiriman.js";
import {getUrlPath} from "../../general/general.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import validateFile from "../../general/validateFile.js";
import deleteRekening from "../../request/rekening.js";

const loadPengaturanToko = async () => {
    try {
        let loadMain = await loadMainStore();
        const data = await rajaOngkir.getAllCity();
        $(".nav-pengaturan").addClass("active");
        let dataKota = `<option value=""></option>`;
        data.rajaongkir.results.forEach(element => {
            dataKota += `<option value="${element.city_name}">${element.city_name}</option>`;
        })
        document.getElementById("list-kota").innerHTML = dataKota;

        const slug = await getUrlPath(1);
        const dataToko = await getToko(slug);
        document.getElementsByName("namaToko")[0].value = dataToko.namaToko;
        document.getElementById("logo").src = dataToko.foto;
        document.getElementsByName("linkFoto")[0].value = dataToko.foto;
        $('#deskripsi').text(dataToko.deskripsi);
        document.getElementsByName("alamat")[0].value = dataToko.alamat;
        $("#list-kota").val(dataToko.kota).trigger('change');
        document.getElementsByName("telp")[0].value = dataToko.telp;
        document.getElementsByName("whatsapp")[0].value = dataToko.whatsapp;
        document.getElementsByName("emailToko")[0].value = dataToko.emailToko
        document.getElementsByName("website")[0].value = dataToko.website.replace("www.", "");
        document.getElementsByName("instagram")[0].value = dataToko.instagram.replace("@", "");
        document.getElementsByName("slug")[0].value = dataToko.slug;
        
        const dataKurir = await getAllKurir();
        let dataKurirHTML = ``;
        dataKurir.jasaPengiriman.forEach(element => {
            dataKurirHTML +=    `<div class="form-check">
                                    <input class="form-check-input kurir" type="checkbox" id="kurir${element.idJasaPengiriman}" value="${element.idJasaPengiriman}">
                                    <label class="form-check-label">
                                    ${element.kurir}
                                    </label>
                                </div>`;
        })
        document.getElementById("list-kurir").innerHTML = dataKurirHTML;

        if (dataToko.jasaPengirimanToko === null) {
            return;
        }
        dataToko.jasaPengirimanToko.forEach(element => {
            if (element.status == true) {
                document.getElementById(`kurir${element.idJasaPengiriman}`).checked = true;
            }
        })

        if (dataToko.rekening === null) {
            return;
        }
        let dataBank = ``;
        dataToko.rekening.forEach(element => {
            dataBank += `<div class="form-row rekening" id="rekening-${element.idRekening}">
                            <input type="text" class="idRekening" value="${element.idRekening}" hidden>
                            <div class="form-group col-md-3 col-3 col-lg-3">
                                <select class="form-control select2 bank" id="bank-rekening-${element.idRekening}">
                                    <option value=""></option>
                                    <option value="BCA">BCA</option>
                                    <option value="BNI">BNI</option>
                                    <option value="BRI">BRI</option>
                                    <option value="Mandiri">Mandiri</option>
                                </select>
                            </div>
                            <div class="form-group col-md-4 col-4 col-lg-4">
                                <input type="text" class="form-control norek creditcard" value="${element.norek}">
                            </div>
                            <div class="form-group col-md-4 col-4 col-lg-4">
                                <input type="text" class="form-control pemilik" value="${element.pemilik}">
                            </div>
                            <div class="form-group col-md-1 col-1 col-lg-1">
                                <a href="#" class="btn btn-icon btn-sm btn-outline-danger mt-1" onclick="hapusRekening(${element.idRekening})" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a>
                            </div>
                        </div>`;
        })

        document.getElementById("data-rekening").innerHTML = dataBank;
        $('.bank').select2();
        dataToko.rekening.forEach(element => {
            $(`#bank-rekening-${element.idRekening}`).val(`${element.bank}`).trigger('change');
        })
    } catch(error) {
        console.log(error);
    }
}
loadPengaturanToko();

const tambahRekening = async () => {
    try {
        let bank = document.getElementById("bank").value;
        let norek = document.getElementById("norek").value;
        let pemilik = document.getElementById("pemilik").value;
        let id = new Date().getTime();
        if (bank == "" || norek == "" || pemilik == "") {
         "Mohon lengkapi isi formulir.";
        }

        let htmlRekening = document.createElement('div');
        htmlRekening.innerHTML = `<div class="form-row rekening" id="rekening-${id}">
                        <input type="text" class="idRekening" value="0" hidden>
                        <div class="form-group col-md-3 col-3 col-lg-3">
                            <select class="form-control select2 bank" id="bank-rekening-${id}">
                                <option value=""></option>
                                <option value="BCA">BCA</option>
                                <option value="BNI">BNI</option>
                                <option value="BRI">BRI</option>
                                <option value="Mandiri">Mandiri</option>
                            </select>
                        </div>
                        <div class="form-group col-md-4 col-4 col-lg-4">
                            <input type="text" class="form-control norek creditcard" value="${norek}">
                        </div>
                        <div class="form-group col-md-4 col-4 col-lg-4">
                            <input type="text" class="form-control pemilik" value="${pemilik}">
                        </div>
                        <div class="form-group col-md-1 col-1 col-lg-1">
                        <a href="#" class="btn btn-icon btn-sm btn-danger mt-1" onclick="hapusRekening(${id})" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="far fa-trash-alt"></i></a>
                        </div>
                    </div>`;

        document.getElementById('data-rekening').appendChild(htmlRekening);
        $('.bank').select2();
        $('#addRekening').modal('hide');
        $(`#bank-rekening-${id}`).val(`${bank}`).trigger('change');
        
        // clear modal form
        $("#bank").val("").trigger('change');
        document.getElementById("norek").value = "";
        document.getElementById("pemilik").value = "";
    } catch(error) {
        alertFailed(error, false);
    }
}

const updateDataToko = async () => {
    let originalBtnUpdateToko = $('#btn-update-toko').html();
    try {
        $('#btn-update-toko').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...`).prop("disabled", true);
        let idToko = document.getElementById("idToko").value;
        let namaToko = document.getElementsByName("namaToko")[0].value;
        let deskripsi = document.getElementsByName("deskripsi")[0].value;
        let alamat = document.getElementsByName("alamat")[0].value;
        let kota = document.getElementsByName("kota")[0].value;
        let telp = document.getElementsByName("telp")[0].value;
        let whatsapp = document.getElementsByName("whatsapp")[0].value;
        let emailToko = document.getElementsByName("emailToko")[0].value;
        let website = document.getElementsByName("website")[0].value;
        let instagram = document.getElementsByName("instagram")[0].value;
        let slug = document.getElementsByName("slug")[0].value;
        let foto = "";

        let formData = new FormData();
        if(document.getElementById("foto").files.length != 0) {
            let image = $("#foto")[0].files[0];
            formData.append("foto", image);
        } else {
            foto = document.getElementsByName("linkFoto")[0].value;
        }
        
        let jasaPengirimanToko = [];
        for (let i = 0; i < document.querySelectorAll('.kurir').length; i++) {
            let idJasaPengiriman =  parseInt(document.getElementsByClassName("kurir")[i].value);
            let status = document.getElementsByClassName("kurir")[i].checked;
            let jsonDataKurir = {
                idJasaPengiriman, status,
            };
            jasaPengirimanToko.push(jsonDataKurir);
        }
        
        let rekening = [];
        for (let i = 0; i < document.querySelectorAll('.rekening').length; i++) {
            let idRekening =  parseInt(document.getElementsByClassName("idRekening")[i].value);
            let bank = document.getElementsByClassName("bank")[i].value;
            let norek = document.getElementsByClassName("norek")[i].value;
            let pemilik = document.getElementsByClassName("pemilik")[i].value
            let jsonDataRekening = {
                idRekening, bank, norek, pemilik,
            };
            rekening.push(jsonDataRekening);
        }

        let jsonData = JSON.stringify({
            namaToko, foto, deskripsi, alamat, kota, telp, whatsapp, emailToko, website, instagram, slug, jasaPengirimanToko, rekening,
        });
        formData.append('payload', jsonData);
        let result = await updateToko(idToko, formData);
        alertSuccess(result.message)

        await setTimeout(() => {
            window.location.href = `/${slug}/pengaturan`
        }, 4000);
    } catch(error) {
        alertFailed(error.responseText, false);
    } finally {
        $('#btn-update-toko').html(originalBtnUpdateToko).prop('disabled', false)
    }
}

const hapusRekening = async (idRekening) => {
    try {
        let idToko = await document.getElementById("idToko").value;
        console.log(idRekening.toString(), idToko)
        let confirm = await alertConfirm('Ingin menghapus rekening ini?');
        if (confirm == true) {
            let result = await deleteRekening(idToko, idRekening);
            alertSuccess(result.message);
            $("#rekening-" + idRekening).fadeOut(1000);
            $("#rekening-" + idRekening).remove();
        } 
    } catch(error) {
        alertFailed(error, false);
    }
}

window.updateDataToko = updateDataToko;
window.tambahRekening = tambahRekening;
window.hapusRekening = hapusRekening;