import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import {getUrlPath} from "../general/general.js";

const loadPage = async () => {
    const loadmain = await loadMain();
    const slugToko = await getUrlPath(1);
}

loadPage();