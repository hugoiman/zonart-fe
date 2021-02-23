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
        "columnDefs": [
            { "className": "text-right", "targets": [1,2] }
        ],
        columns: [
            { data: function (data, type, dataToSet) {
                return `<b>${data.judul}</b> - ${data.pesan}`;
                }
            },
            { data: "createdAt"},
            { data: "link",
                render: function (link) {
                    return (link != "#" ? `<a href="${link}" class="btn btn-default"><i class="fas fa-eye"></i></a>`
                    : '');
                }
            }
        ],
    });
}

window.displayDataNotifikasi = displayDatanotifikasi;