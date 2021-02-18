import loadMain from "../general/main.js";
import {alertFailed} from "../general/swalert.js";

const loadPengaturan = async () => {
    try {
        const loadmain = await loadMain();
    } catch(error) {
        alertFailed(error);
    }
}
loadPengaturan();