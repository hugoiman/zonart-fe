import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import {getUrlPath} from "../../general/general.js";
import {getDaftarGaleri, deleteGaleri} from "../../request/galeri.js";
import {getDaftarProduk} from "../../request/produk.js";

var galeri;
const loadGaleri = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-galeri").addClass("active");
        const slugToko = await getUrlPath(2);
        document.getElementById('btn-form-galeri').href = `/form-galeri/${slugToko}`;
        let idToko = await document.getElementById("idToko").value;

        const produks = await getDaftarProduk(idToko);
        let htmlKategori = `<option value="semua">Semua</option>`;
        produks.produk.forEach(v => {
            htmlKategori += `<option value="${v.idProduk}">${v.namaProduk}</option>`;
        })
        document.getElementById("select-kategori").innerHTML = htmlKategori;

        let result = await getDaftarGaleri(idToko);
        galeri = result;
        let htmlGaleri = ``;
        
        result.galeri.forEach(v => {
            htmlGaleri += `<div class="col-6 col-md-2 col-sm-2 kategori kategori-${v.idProduk}" id="galeri-${v.idGaleri}">
                <label class="imagecheck mb-4">
                    <input name="imagecheck" type="checkbox" value="${v.idGaleri}" class="imagecheck-input" onclick="isChecked()"/>
                    <figure class="imagecheck-figure">
                        <img src="${v.gambar}" alt="${v.kategori}" class="imagecheck-image" data-toggle="tooltip" data-placement="top" title="${v.kategori}">
                    </figure>
                </label>
            </div>`
        });
        document.getElementById("daftar-galeri").innerHTML = htmlGaleri;
    } catch(error) {
        alertFailed(error, false)
    }
}

loadGaleri();

function displayKategori() {
    let kategori = $("#select-kategori").val();
    let htmlGaleri = ``;
    
    galeri.galeri.forEach(v => {
        if (v.idProduk == kategori || kategori == "semua") {
            htmlGaleri += `<div class="col-6 col-md-2 col-sm-2 kategori kategori-${v.idProduk}" id="galeri-${v.idGaleri}">
                <label class="imagecheck mb-4">
                    <input name="imagecheck" type="checkbox" value="${v.idGaleri}" class="imagecheck-input" onclick="isChecked()"/>
                    <figure class="imagecheck-figure">
                        <img src="${v.gambar}" alt="${v.kategori}" class="imagecheck-image" data-toggle="tooltip" data-placement="top" title="${v.kategori}">
                    </figure>
                </label>
            </div>`;
        } else if (v.idProduk !== kategori) {
            return;
        } 
    });
    document.getElementById("daftar-galeri").innerHTML = htmlGaleri;
    isChecked();
}

const hapusGaleri = async () => {
    try {
        let confirm = await alertConfirm('Ingin menghapus gambar yang terpilih?');
        let idToko = await document.getElementById("idToko").value;
        let selected = [];
        let result = ``;
        await $("input:checkbox[name=imagecheck]:checked").each(function(){
            selected.push($(this).val());
        });
        if (confirm) {
            selected.forEach(id => {
                result = deleteGaleri(idToko, id);
                galeri.galeri.splice(galeri.galeri.findIndex(function(item) {
                    return item.idGaleri === parseInt(id);
                }), 1)
                alertSuccess(result.message);
                $(`#galeri-${id}`).fadeOut(1000);
            }); 
        }
    } catch(error) {
        console.log(error);
    }

}

function check() {
    $('input:checkbox[name=imagecheck]').prop('checked', true);
}

function uncheck() {
    $('input:checkbox[name=imagecheck]').prop('checked', false);
    isChecked();
}

function isChecked() {
    var count = $('input:checkbox:checked').length;
    if (count < 1) {
        $('#galeri-tools').hide();
    } else {
        $('#galeri-tools').show();
    }
}

window.displayKategori = displayKategori;
window.hapusGaleri = hapusGaleri;
window.check = check;
window.uncheck = uncheck;
window.isChecked = isChecked;