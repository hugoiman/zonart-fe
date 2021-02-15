import "../components/nav-header/navStore-element.js";
import "../components/aside-store/asideStore-element.js";
import "../components/footer/footer-element.js";
import {getCustomer} from "../request/customer.js";
import {alertFailed} from "./swalert.js";
import {logout, getUrlPath} from "./general.js";
import {getToko} from "../request/toko.js";
import {getAllKaryawan} from "../request/karyawan.js";
import menu from "../components/aside-store/asideStore-element.js";

const getData = async () => {
    try {
        const dataCustomer = await getCustomer();
        const dataUser = await document.createElement("link-user-element");
        dataUser.customer = dataCustomer;
        document.getElementsByClassName("navbar-right")[0].appendChild(dataUser);
        const slugToko = await getUrlPath(2);
        const dataToko = await getToko(slugToko);
        document.getElementById("idToko").value = dataToko.idToko;
        // console.log(dataToko);
        // cek if owner
        if (dataToko.idOwner == dataCustomer.idCustomer) {
            document.getElementById("sidebar-menu").innerHTML = menu.dashboard + menu.pesanan + menu.produk + 
            menu.grupOpsi + menu.pengaturan + menu.galeri + menu.faq + menu.karyawan;
        } else {
            const dataAllKaryawan = getAllKaryawan(dataToko.idToko);
            const dataKaryawan = dataAllKaryawan.find( ({idCustomer}) => idCustomer === dataCustomer.idCustomer);
            // cek if admin
            if (dataKaryawan.posisi === "admin" && dataKaryawan.status == "aktif") {
                document.getElementById("sidebar-menu").innerHTML = menu.dashboard + menu.pesanan + menu.produk + 
                menu.grupOpsi + menu.galeri + menu.faq;
            } else if (dataKaryawan.posisi === "editor" && dataKaryawan.status == "aktif") {
                document.getElementById("sidebar-menu").innerHTML = menu.pesanan;
            } else {
                alertFailed("Anda tidak memiliki otoritas untuk mengelola toko ini", false);
            }
        }

        [].slice.call(document.getElementsByClassName("namaToko")).forEach(function (div) {
            div.innerHTML = dataToko.namaToko;
        });
    } catch(error) {
        alertFailed(error.responseText, false);
    }
    
    document.getElementById("logout").onclick = function(event) {
        logout();
    
        event.preventDefault();
    }
}

getData();