import loadMain from "../general/main.js";
import { getCustomer } from "../request/customer.js";

const loadPage = async () => {
    try {
        const loadmain = await loadMain();
        const user = await getCustomer();
        document.getElementsByClassName('nama-user')[0].textContent = user.nama;
    } catch(error) {
        console.log(error);
    }
}

loadPage();