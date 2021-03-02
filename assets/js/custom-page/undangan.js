import loadMain from "../general/main.js";
import {getUrlPath} from "../general/general.js";
import {alertSuccess, alertFailed, alertConfirm} from "../general/swalert.js";
import {getUndangan, tolakUndangan, terimaUndangan} from "../request/undangan.js";

const loadUndangan = async () => {
    try {
        const loadmain = await loadMain();
        const idUndangan = await getUrlPath(1);
        const result = await getUndangan(idUndangan);
        let htmlUndangan = document.createElement('div');

        if (result.status == "menunggu") {
            htmlUndangan.innerHTML = `
                            <h2>Undangan Rekrut</h2>
                            <p class="lead">
                                ${result.namaToko} merekrut anda sebagai ${result.posisi}.
                            </p>
                            <div class="buttons">
                                <a href="#" class="btn btn-icon icon-left btn-secondary" onclick="tolak(${result.idUndangan})"><i class="fas fa-times"></i> Tolak</a>
                                <a href="#" class="btn btn-icon icon-left btn-primary" onclick="terima(${result.idUndangan})"><i class="fas fa-check"></i> Terima</a>
                            </div>`;
        } else if(result.status == "ditolak") {
            htmlUndangan.innerHTML = `<h2>Undangan Rekrut Telah Anda Tolak</h2>`;
        } else if(result.status == "diterima") {
            htmlUndangan.innerHTML = `<h2>Undangan Rekrut Telah Anda Terima</h2>`;
        } else if(result.status == "dibatalkan") {
            htmlUndangan.innerHTML = `<h2>Undangan Rekrut Telah Dibatalkan</h2>`;
        }
        
        document.getElementsByClassName("empty-state")[0].appendChild(htmlUndangan);
    } catch(error) {
        alertFailed(error, false);
    }
}
loadUndangan();

const tolak = async (idUndangan) => {
    try {
        let confirm = await alertConfirm('Ingin menolak undangan ini?');
        if (confirm) {
            let result = await tolakUndangan(idUndangan);
            alertSuccess(result.message);
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
    } catch(error) {
        alertFailed(error, false);
    }
}

const terima = async (idUndangan) => {
    try {
        let result = await terimaUndangan(idUndangan);
        alertSuccess(result.message);
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    } catch(error) {
        alertFailed(error, false);
    }
}

window.tolak = tolak;
window.terima = terima;