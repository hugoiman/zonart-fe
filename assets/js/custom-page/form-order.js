function jenisPesanan(data) {
    let element =   `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Jenis Pesanan</label>
                            ${ (data.jenisPemesanan[0].status ?
                                `<div class="form-check">
                                    <input class="form-check-input input-jenis-pesanan" type="radio" name="jenis-pesanan" onclick="toggleJumlahCetak('show')" value="${data.jenisPemesanan[0].jenis}" checked>
                                    <label class="form-check-label">Cetak - Rp <span class="rupiah"> ${data.jenisPemesanan[0].harga}</span></label>
                                </div>` : ``) +
                                (data.jenisPemesanan[1].status ?
                                `<div class="form-check">
                                    <input class="form-check-input input-jenis-pesanan" type="radio" name="jenis-pesanan" onclick="toggleJumlahCetak('hide')" value="${data.jenisPemesanan[1].jenis}" ` + (!data.jenisPemesanan[0].status ? 'checked' : '') + `>
                                    <label class="form-check-label">Soft Copy - Rp <span class="rupiah"> ${data.jenisPemesanan[1].harga}</span></label>
                                </div>` : ``) 
                            }
                        </div>
                    </div>`;
    return element;
}

function jumlahCetak(data) {
    let element =   (data.jenisPemesanan[0].status ? `<div class="row" id="form-jumlah-cetak">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Jumlah Cetak (Pcs)</label>
                            <input type="text" class="form-control currency" value="1" id="jumlah-cetak"/>
                        </div>
                    </div>` : ``);
    return element;
}

function toggleJumlahCetak(status) {
    var x = document.getElementById("form-jumlah-cetak");
    if (status === "show") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
        $("#jumlah-cetak").val("1");
    }
}

function tambahanWajah(data) {
    let element =   `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Tambahan Wajah - Rp <span class="rupiah"> ${data.hargaWajah}/wajah</span></label>
                            <input type="text" class="form-control currency" id="tambahan-wajah"/>
                        </div>
                    </div>`;
    return element;
}

function rencanaPakai() {
    let element =   `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Rencana Pakai</label>
                            <input type="text" class="form-control" id="rencana-pakai" data-date-format='dd M yyyy'/>
                        </div>
                    </div>`;
    return element;
}

function fotoUser() {
    let element =   `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Upload Foto Wajah</label>
                            <form action="#" class="dropzone" id="mydropzone">
                                <div class="fallback">
                                    <input name="file" type="file" id="foto" multiple />
                                </div>
                            </form>
                        </div>
                    </div>`;
    return element;
}

function catatan() {
    let element =   `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Catatan untuk penjual</label>
                            <input type="text" class="form-control" id="catatan">
                        </div>
                    </div>`;
    return element;
}

function contohGambar() {
    let element = `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Contoh Gambar <small>(jika ada)</small></label>
                            <div id="display-contoh-gambar"></div>
                            <a href="#" class="btn btn-block btn-outline-info" data-toggle="modal" data-target="#modal-contoh-gambar">Pilih Gambar</a>
                            <input type="text" class="form-control" id="contoh-gambar" hidden/>
                        </div>
                    </div>`;
    return element;
}

function modalContohGambar(galeri) {
    let content = ``;
    galeri.forEach(v => {
        content += `<div class="col-6 col-sm-4">
            <label class="imagecheck mb-4">
                <input onclick=pilihContoh('${v.gambar}') class="imagecheck-input" />
                <figure class="imagecheck-figure">
                    <img src="${v.gambar}" class="imagecheck-image">
                </figure>
            </label>
        </div>`;
    });
    let element = `<div class="modal fade" tabindex="-1" role="dialog" id="modal-contoh-gambar">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Pilih Gambar Sebagai Contoh </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-row">
                        ${content}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    $('body').append(element);
}

function pilihContoh(link) {
    $('#modal-contoh-gambar').modal('hide');
    let element = `<a href="${link.replace('upload/', 'upload/fl_attachment/')}" class="lightgallery-image">
                        <img src="${link}" class="rounded mx-auto d-block mb-2" width="25%" alt="...">
                    </a>`;
    document.getElementById("display-contoh-gambar").innerHTML = element;
    document.getElementById('contoh-gambar').value = link;
    $("#display-contoh-gambar").lightGallery({
        thumbnail:true,
        animateThumb: false,
    });
}

window.toggleJumlahCetak = toggleJumlahCetak;