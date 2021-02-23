import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import {getUrlPath} from "../../general/general.js";
import {getDaftarProduk, deleteProduk} from "../../request/produk.js";

const loadProduk = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-produk").addClass("active");
        const slugToko = await getUrlPath(2);
        document.getElementById('btn-form-produk').href = `/form-produk/${slugToko}`
        let idToko = await document.getElementById("idToko").value;
        let result = await getDaftarProduk(idToko);
        let htmlProduk = ``;
        result.produk.forEach(v => {
            htmlProduk += `<div class="col-12 col-sm-6 col-md-6 col-lg-3 content-produk-${v.idProduk}">
            <article class="article article-style-c">
              <div class="article-header">
                <img class="article-image" src="${v.gambar}">
                <div class="article-title">
                <h2><a href="/produk/${slugToko}/${v.slug}">${v.namaProduk}</a></h2>
                </div>
              </div>
              <div class="article-details">
                <div class="article-category"><a href="#"></a> <div class="bullet"></div> <a href="#">${v.status}</a></div>
                <div class="article-cta">
                    <div class="buttons">
                        <a href="#" class="btn btn-icon btn-secondary" onclick="hapusProduk(${v.idProduk})"><i class="far fa-trash-alt"></i></a>
                        <a href="/produk/${slugToko}/${v.slug}" class="btn btn-icon btn-primary"><i class="far fa-eye"></i></a>
                    </div>
                </div>
              </div>
            </article>
          </div>`
        });
        document.getElementById("daftar-produk").innerHTML = htmlProduk;
    } catch(error) {
        alertFailed(error);
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

window.hapusProduk = hapusProduk;