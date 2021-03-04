import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {getUrlPath} from "../general/general.js";
import {getToko} from "../request/toko.js";

const loadPage = async () => {
    const loadmain = await loadMain();
    const slugToko = await getUrlPath(1);
    const dataToko = await getToko(slugToko);

    lightGallery(document.getElementById('animated-thumbnials'), {
        thumbnail:true
    }); 
}
loadPage();