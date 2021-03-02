import loadMain from "../general/main.js";
import getAllCity from "../request/rajaOngkir.js";
import {alertFailed, alertSuccess} from "../general/swalert.js";
import {createToko} from "../request/toko.js";

const loadForm = async () => {
    try {
        const loadmain = await loadMain();
        const data = await getAllCity();
        let html = `<option value=""></option>`;
        data.rajaongkir.results.forEach(element => {
            html += `<option value="${element.city_name}">${element.city_name}</option>`;
        })
        document.getElementById("list-kota").innerHTML= html;      
    } catch(error) {
        alertFailed(error);
    }
}
loadForm();

document.getElementById("buka-toko").onsubmit = function(event) {
    loadCreateToko();
    event.preventDefault();
}  
const loadCreateToko = async () => {
    try {
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

        if (instagram != "") {
            instagram = "@" + instagram;
        }

        if (website != "") {
            website = "www." + website;
        }

        let jsonData = JSON.stringify({
            namaToko, deskripsi, alamat, kota, telp, whatsapp, emailToko, website, instagram, slug,
        });
        const result = await createToko(jsonData);
        alertSuccess(result.message, 3000);
        setTimeout(() => {
            window.location.href = `/${slug}/dashboard`;
        }, 3000)
    } catch(error) {
        alertFailed(error, false);
    }
}