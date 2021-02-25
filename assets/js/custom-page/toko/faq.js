import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import {getUrlPath} from "../../general/general.js";
import {getDaftarFaq, deleteFaq} from "../../request/faq.js";

const loadFaq = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-faq").addClass("active");
        const slugToko = await getUrlPath(2);
        document.getElementById('btn-form-faq').href = `/form-faq/${slugToko}`
        let idToko = document.getElementById("idToko").value;
        let result = await getDaftarFaq(idToko);
        let htmlKategori = '';
        let dataKategori = [];

        // get nama kategori but without duplicate
        result.faq.forEach(element => {
            dataKategori.indexOf(element.kategori) === -1 ? dataKategori.push(element.kategori) : '';
        });

        // display kategori
        dataKategori.forEach(kategori => {
            htmlKategori += `<div class="col-12 col-md-6 col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h4>${kategori}</h4>
                                    </div>
                                    <div class="card-body">
                                        <div id="${kategori}">
                                            <div class="accordion ${kategori}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
        })
        document.getElementById("daftar-faq").innerHTML = htmlKategori;

        // put field faq in each kategori
        result.faq.forEach(val => {
            let contentFaq = document.createElement('div');
            contentFaq.innerHTML =  `<div class="accordion-header content-faq-${val.idFaq}" role="button" data-toggle="collapse" data-target="#panel-body-${val.idFaq}" aria-expanded="false">
                                        <h4><a href="#" class="btn btn-sm btn-default comp-select" onclick="hapusFaq(${val.idFaq})"><i class="far fa-trash-alt"></i></a>${val.pertanyaan}</h4>
                                    </div>
                                    <div class="accordion-body collapse content-faq-${val.idFaq}" id="panel-body-${val.idFaq}" data-parent="#${val.kategori}">
                                        ${val.jawaban}
                                    </div>`;
            document.getElementsByClassName(`${val.kategori}`)[0].appendChild(contentFaq);
        });
        
    } catch(error) {
        alertFailed(error, false);
    }
}
loadFaq();

const hapusFaq = async (idFaq) => {
    try {
        let confirm = await alertConfirm('Ingin menghapus FAQ ini?');
        if (confirm) {
            let idToko = document.getElementById("idToko").value;
            let result = await deleteFaq(idToko, idFaq);
            alertSuccess(result.message);
            $(`.content-faq-${idFaq}`).fadeOut(1000);
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

window.hapusFaq = hapusFaq;