import loadMain from "../general/main.js";
import {alertFailed} from "../general/swalert.js";
import {getNotifikasi} from "../request/notifikasi.js";

const loadNotifikasi = async () => {
    try {
        const loadmain = await loadMain();
        const loadNotifikasi = await getNotifikasi();
        displayDataNotifikasi(loadNotifikasi);
    } catch(error) {
        console.log(error);
    }
}
loadNotifikasi();

function displayDatanotifikasi(dataJson) {
    $("#table-notifikasi").dataTable({
        autoWidth: false,
        data: dataJson.notifikasi,
        "ordering": false,
        "searching": false,
        "pageLength": 25,
        "lengthChange": false,
        columns: [
            { data: function (data, type, dataToSet) {
                return `${data.judul} - ${data.pesan}`;
                }
            },
            { data: "createdAt"}
        ],
    });
}

window.displayDataNotifikasi = displayDatanotifikasi;