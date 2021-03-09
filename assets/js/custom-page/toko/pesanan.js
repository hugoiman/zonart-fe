import loadMainStore from "../../general/mainStore.js";
import {alertSuccess, alertFailed, alertConfirm} from "../../general/swalert.js";
import {getUrlPath} from "../../general/general.js";

const loadPage = async () => {
    try {
        let loadMain = await loadMainStore();
        $(".nav-order").addClass("active");
        const slugToko = await getUrlPath(1);
        let idToko = await document.getElementById("idToko").value;
        $("#table-semua").dataTable({
            columnDefs: [
                { targets: [0], orderable: false }
            ]
        });
    } catch(error) {
        alertFailed(error, false);
    }
}
loadPage();