import loadMain from "../general/main.js";
import {alertFailed} from "../general/swalert.js";
import {getTokos} from "../request/toko.js";

const loadMyToko = async () => {
    try {
        const loadmain = await loadMain();
        const data = await getTokos();
        displayTokos(data);
    } catch(error) {
        alertFailed(error);
    }
}
loadMyToko();

function displayTokos(data) {
    if (data.toko == null) {
        return
    }
    let element = ``;
    data.toko.forEach(v => {
        element += `<div class="col-12 col-sm-6 col-md-2">
            <article class="article article-style-b">
                <div class="article-header">
                    <a href="${(v.deskripsi == "owner" ? `/${v.slug}/dashboard`:`/${v.slug}/pesanan`)}">
                        <img class="article-image" src="${v.foto}">
                    </a>
                    <div class="article-title">
                        <h2><a href="${(v.deskripsi == "owner" ? `/${v.slug}/dashboard`:`/${v.slug}/pesanan`)}">${v.namaToko}</a></h2>
                    </div>
                </div>
            </article>
        </div>`;
    });
    document.getElementById("list-toko").innerHTML = element;
}