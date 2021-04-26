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
        const slugToko = await getUrlPath(1);
        document.getElementById('btn-form-galeri').href = `/${slugToko}/form-galeri`;
        let idToko = await document.getElementById("idToko").value;

        let result = await getDaftarGaleri(idToko);
        galeri = result;
        let htmlGaleri = ``;

        let kategori = _.uniqBy(result.galeri, 'kategori');

        let htmlKategori = `<option selected="selected" value="semua">Semua</option>`;
        kategori.forEach(v => {
            htmlKategori += `<option value="${v.idKategori}">${v.kategori}</option>`;
        })
        document.getElementById("select-kategori").innerHTML = htmlKategori;
        await displayGaleri();
        
        // result.galeri.forEach(v => {
        //     htmlGaleri += `<div class="col-6 col-md-2 col-sm-2 kategori kategori-${v.idKategori}" id="galeri-${v.idGaleri}">
        //         <label class="imagecheck mb-4">
        //             <input name="imagecheck" type="checkbox" value="${v.idGaleri}" class="imagecheck-input" onclick="isChecked()"/>
        //             <figure class="imagecheck-figure">
        //                 <img src="${v.gambar}" alt="${v.kategori}" class="imagecheck-image" data-toggle="tooltip" data-placement="top" title="${v.kategori}">
        //             </figure>
        //         </label>
        //     </div>`
        // });
        // document.getElementById("daftar-galeri").innerHTML = htmlGaleri;
    } catch(error) {
        alertFailed(error, false)
    }
}

loadGaleri();

function displayGaleri() {
    let kategori = $("#select-kategori").val();
    let htmlGaleri = ``;
    if (galeri.galeri === null) {
        return;
    }
    galeri.galeri.forEach(v => {
        if (v.idKategori == kategori || kategori == "semua") {
            htmlGaleri += `<div class="col-4 col-md-3 col-sm-2 kategori kategori-${v.idKategori}" id="galeri-${v.idGaleri}">
                <label class="imagecheck mb-2">
                    <input name="imagecheck" type="checkbox" value="${v.idGaleri}" class="imagecheck-input" onclick="isChecked()"/>
                    <figure class="imagecheck-figure">
                        <img src="${v.gambar}" alt="${v.kategori}" class="imagecheck-image" data-toggle="tooltip" data-placement="top" title="${v.kategori}">
                    </figure>
                </label>
            </div>`;
        } else if (v.idKategori !== kategori) {
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

window.displayGaleri = displayGaleri;
window.hapusGaleri = hapusGaleri;
window.check = check;
window.uncheck = uncheck;
window.isChecked = isChecked;