// Form Pemesanan
function jenisPesanan(data) {
    let element =   `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Jenis Pesanan</label>
                            ${ (data.jenisPemesanan[0].status ?
                                `<div class="form-check">
                                    <input class="form-check-input input-jenis-pesanan" type="radio" name="jenis-pesanan" onclick="toggleJumlahCetak('cetak')" value="${data.jenisPemesanan[0].jenis}" checked>
                                    <label class="form-check-label">Cetak - Rp <span class="rupiah">${data.jenisPemesanan[0].harga}</span></label>
                                </div>` : ``) +
                                (data.jenisPemesanan[1].status ?
                                `<div class="form-check">
                                    <input class="form-check-input input-jenis-pesanan" type="radio" name="jenis-pesanan" onclick="toggleJumlahCetak('soft copy')" value="${data.jenisPemesanan[1].jenis}" ` + (!data.jenisPemesanan[0].status ? 'checked' : '') + `>
                                    <label class="form-check-label">Soft Copy - Rp <span class="rupiah">${data.jenisPemesanan[1].harga}</span></label>
                                </div>` : ``) 
                            }
                        </div>
                    </div>`;
    return element;
}

function jumlahCetak(data) {
    let element =   (data.jenisPemesanan[0].status ? `<div class="row" id="form-jumlah-cetak">
                        <div class="form-group col-md-4 col-sm-12">
                            <label class="col-form-label text-md-right">Jumlah Cetak (Pcs)</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <div class="input-group-text" onclick="inputpcs('-1')"><i class="fas fa-minus"></i></div>
                                </div>
                                <input type="text" class="form-control text-center" value="1" id="pcs" readonly/>
                                <div class="input-group-append">
                                    <div class="input-group-text" onclick="inputpcs('1')"><i class="fas fa-plus"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>` : ``);
    return element;
}

function inputpcs(data) {
    let pcs = parseInt($('#pcs').val()) + parseInt(data)
    if (pcs < 1) {
        pcs = 1;
    }
    $('#pcs').val(pcs);
    hitungTotalPembelian();
}

function toggleJumlahCetak(status) {
    var pcs = document.getElementById("form-jumlah-cetak");
    var grupOpsi = $(".grup-opsi");
    if (status === "cetak") {
        pcs.style.display = "block";
        grupOpsi.show();
        $('.soft-copy').hide();
        $('.soft-copy input:checkbox').prop('checked',false).attr("disabled", false);
    } else {
        pcs.style.display = "none";
        $("#pcs").val("1");
        grupOpsi.show();
        $('.cetak').hide();
        $('.cetak input:checkbox').prop('checked',false).attr("disabled", false);
    }
    hitungTotalPembelian();
}

function tambahanWajah(data) {
    let element =   `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Tambahan Wajah - Rp <span class="rupiah"> ${data.hargaWajah}</span>/wajah</label>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <div class="input-group-text" onclick="inputTambahanWajah('-1')"><i class="fas fa-minus"></i></div>
                                </div>
                                <input type="text" class="form-control text-center currency" id="tambahan-wajah" value="0"/ readonly>
                                <div class="input-group-append">
                                    <div class="input-group-text" onclick="inputTambahanWajah('1')"><i class="fas fa-plus"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
    return element;
}


function inputTambahanWajah(data) {
    let wajah = parseInt($('#tambahan-wajah').val()) + parseInt(data)
    if (wajah < 0) {
        wajah = 0;
    }
    $('#tambahan-wajah').val(wajah);
    hitungTotalPembelian();
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
                            <input type="text" class="form-control" id="catatan-penjual">
                        </div>
                    </div>`;
    return element;
}

function contohGambar(dataGaleri) {
    let element = `<div class="row" ${(dataGaleri.length == 0 ? 'hidden' : '')}>
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Contoh Gambar <small>(jika ada)</small></label>
                            <div id="display-contoh-gambar"></div>
                            <a href="#" class="btn btn-block btn-outline-info" data-toggle="modal" data-target="#modal-contoh-gambar">Pilih Gambar</a>
                            <input type="text" class="form-control" id="contoh-gambar" hidden/>
                        </div>
                    </div>`;

    modalContohGambar(dataGaleri);
    return element;
}

function modalContohGambar(dataGaleri) {
    if (dataGaleri.length == 0) {
        return;
    }
    let content = ``;
    dataGaleri.forEach(v => {
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
    if ($("#popup-contoh-gambar").length != 0) {
        $("#display-contoh-gambar").data('lightGallery').destroy(true);
    }
    let element =   `<a href="${link.replace('upload/', 'upload/fl_attachment/')}" class="lightgallery-image" id="popup-contoh-gambar">
                        <img src="${link}" class="rounded mx-auto d-block mb-2" width="25%">
                    </a>`;
    document.getElementById("display-contoh-gambar").innerHTML = element;
    document.getElementById('contoh-gambar').value = link;
    $("#display-contoh-gambar").lightGallery({
        thumbnail:true,
        animateThumb: false,
    });

    $('#modal-contoh-gambar').modal('hide');
}

function grupOpsi(data) {
    if (data == null) {
        return '';
    }
    let element = ``;
    let jenisPesanan = $("input[name='jenis-pesanan']:checked").val();

    data.forEach(v => {
        element +=  `<div class="row grup-opsi ${(v.hardcopy && v.softcopy ? '' : v.softcopy ? 'soft-copy' : 'cetak')}" 
                        style="display:${(jenisPesanan == "cetak" && !v.hardcopy ? 'none' : (jenisPesanan == "soft copy" && !v.softcopy ? 'none' : 'block'))}">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">${v.namaGrup} <small>(${(v.required ? 
                                `wajib diisi${(v.min == 1 ? '': `, min ${v.min}`)}`:`opsional`)}, maks ${v.max})</small></label>
                                ${opsi(v)}
                        </div>
                    </div>`;
    });
    return element
}

function opsi(data) {
    let opsi = ``;
    data.opsi.forEach(v => {
        opsi += `<div class="form-check">
                    <input class="form-check-input" id="opsi-${v.idOpsi}" type="checkbox" name="opsi-${v.idGrupOpsi}" value="${v.opsi}" onclick="validateMaxOpsi('${v.idGrupOpsi}', '${data.max}')">
                    <label class="form-check-label">${v.opsi} <small class="text-right">${(v.harga != 0 ? `- Rp <span class="rupiah">${v.harga}</span>` : '')}${(v.perProduk ? `/pcs` : '')}</small></label>
                </div>`;
    });
    
    if(data.spesificRequest) {
        opsi += `<div class="form-check">
                    <input class="form-check-input spesific-request-${data.idGrupOpsi}" id="opsi-0" type="checkbox" name="opsi-${data.idGrupOpsi}" onclick="validateMaxOpsi('${data.idGrupOpsi}', '${data.max}')">
                    <input type="text" class="form-control form-control-sm col-12" id="input-request-${data.idGrupOpsi}" placeholder="Punya pilihan lain? isi disini ya..." onchange="setSpesificRequest('${data.idGrupOpsi}')">
                </div>`;
    }
    return opsi;
}

function validateMaxOpsi(idGrupOpsi, max) {
    var bol = $(`[name='opsi-${idGrupOpsi}']:checked`).length >= max;     
    $(`[name='opsi-${idGrupOpsi}']`).not(":checked").attr("disabled", bol);
    hitungTotalPembelian();
}


// Form Pengiriman
function kota(listKota) {    
    let opsi = `<option value=""></option>`;
    listKota.rajaongkir.results.forEach(v => {
        opsi += `<option value="${v.city_id}">${v.city_name}</option>`;
    })
    let element =   `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Kota</label>
                            <select class="form-control select2" id="kota" onchange="getOngkir()">${opsi}</select>
                        </div>
                    </div>`;
    return element;
}

function jenisPengirimanToko(dataToko) {
    let kurir = ``;
    dataToko.jasaPengirimanToko.forEach(v => {
        if(v.status) {
            kurir +=    `<div class="form-check">
                            <input class="form-check-input" type="radio" name="kurir" value="${v.kode}" onchange="getOngkir()">
                            <label class="form-check-label">${v.kurir}</label>
                        </div>`;
        }
    });

    let element =  `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Kurir</label>
                            ${kurir}
                        </div>
                    </div>
                    <div id="cost-pengiriman"></div>`;
    return element;
}

function costPengiriman(data) {
    let cost = ``;
    data.rajaongkir.results.forEach(data => {
        data.costs.forEach(dt => {
            dt.cost.forEach(v => {
                cost += `<div class="form-check">
                            <input class="form-check-input" type="radio" name="service">
                            <label class="form-check-label">${dt.service} - ${v.value} <small>(${v.etd})</small></label>
                        </div>`;
            });
        });
    });

    let element =  `<div class="row">
                        <div class="form-group col-md-12 col-12">
                            <label class="col-form-label text-md-right">Layanan Kurir</label>
                            ${cost}
                        </div>
                    </div>`;
    document.getElementById('cost-pengiriman').innerHTML = element;
    
}

window.validateMaxOpsi = validateMaxOpsi;
window.toggleJumlahCetak = toggleJumlahCetak;