import "../components/nav-header/nav-element.js";
import "../components/footer/footer-element.js";
import {getCustomer} from "../request/customer.js";
import {alertFailed} from "./swalert.js";
import {logout} from "./general.js";

const getData = async () => {
    try {
        const data = await getCustomer();
        const dataUser = await document.createElement("link-user-element");
        dataUser.customer = data;
        document.getElementsByClassName("navbar-right")[0].appendChild(dataUser);
    } catch(error) {
        alertFailed(error.responseText, false);
    }
    
    document.getElementById("logout").onclick = function(event) {
        logout();
    
        event.preventDefault();
    }
}

getData();