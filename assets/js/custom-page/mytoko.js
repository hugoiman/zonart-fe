import loadMain from "../general/main.js";
import getToko from "../data-dummy/toko.js";
import {alertFailed} from "../general/swalert.js";

const loadMyToko = async () => {
    try {
        const loadmain = await loadMain();
        const data = await getToko();
        let html = ``;
        data.forEach(element => {
            html += `<div class="col-12 col-sm-6 col-md-6 col-lg-3">
                <article class="article">
                    <div class="article-header">
                        <div class="article-image" data-background="/assets/img/news/img08.jpg">
                        </div>
                        <div class="article-title">
                            <h2><a href="/toko/${element.slug}">${element.namaToko}</a></h2>
                        </div>
                    </div>
                    <div class="article-details">
                        <div class="article-cta">
                        <div class="buttons">
                            <a href="/toko/${element.slug}" class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="Lihat"><i class="far fa-eye"></i></a>
                            <a href="/pengaturan-toko/${element.slug}" class="btn btn-sm btn-warning" data-toggle="tooltip" data-placement="top" title="Pengaturan"><i class="far fa-edit"></i></a>
                        </div>
                        </div>
                    </div>
                </article>
            </div>`;
        });
        document.getElementById("list-toko").innerHTML= html;
    } catch(error) {
        alertFailed(error);
    }
}
loadMyToko();