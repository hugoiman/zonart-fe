import loadMain from "../general/main.js";
import {alertSuccess, alertFailed} from "../general/swalert.js";
import order from "../request/order.js";

const loadPage = async () => {
    try {
        const loadmain = await loadMain();
        const result = await order.getOrders();
        displayOrders(result.order);
        $(".rupiah").mask('000.000.000', {reverse: true});
    } catch(error) {
        alertFailed(error, false);
    }
}

loadPage();

function displayOrders(data) {
    if(data == null) {
        let empty = `<div class="row justify-content-md-center">
        <div class="col-12 col-md-6 col-sm-12">
            <div class="card">
                <div class="card-body">
                  <div class="empty-state">
                    <h2>Anda belum memiliki transaksi</h2>
                  </div>
                </div>
              </div>
          </div>
      </div>`
      document.getElementById("data-order").innerHTML = empty;
        return;
    }
    let orders = ``;
    data.forEach(v => {
        orders += `
        <div class="row justify-content-md-center">
            <div class="col-lg-8 col-md-12">
                <div class="card card-primary">
                    <div class="card-body">
                    <ul class="list-unstyled list-unstyled-border list-unstyled-noborder">
                        <li class="media">
                        <div class="media-body">
                            <span class="float-left mr-2">${v.tglOrder}</span>
                            <span class="badge badge-light"> ${v.invoice.statusPesanan}</span>
                        </div>
                        </li>
                        <li class="media">
                        <div class="media-body">
                            <div class="media-title mt-2"><a href="/order?id=${v.idOrder}">INV #${v.invoice.idInvoice}</a></div>
                            <div class="text-job text-muted"></div>
                        </div>
                        <div class="media-progressbar">
                            <div class="text-job text-muted text-center">Total</div>   
                            <div class="media-title text-center"><span class="badge badge-primary"><span class="rupiah">${v.invoice.totalPembelian}</span></span></div>                       
                        </div>
                        <div class="media-progressbar">
                            <div class="text-job text-muted text-center">Tagihan</div>   
                            <div class="media-title text-center"><span class="badge badge-danger"><span class="rupiah">${v.invoice.tagihan}</span></span></div>                       
                        </div>
                        </li>
                        <div class="mb-2"><strong><a href="/${v.invoice.slugToko}"><i class="fas fa-store"></i> ${v.invoice.namaToko}</a></strong></div>
                        <li class="media">
                        <img alt="image" class="rounded" width="60" src="${v.produkOrder.fotoProduk}">
                        <div class="media-body col-12">
                            <div class="media-title"><a href="/${v.invoice.slugToko}/${v.produkOrder.slugProduk}">${v.produkOrder.namaProduk}</a></div>
                            <div class="text-time">${v.pcs} Pcs (<span class="rupiah">${v.pengiriman.berat}</span> gr)</div> 
                            <div class="buttons mt-2">
                            <a href="#" class="btn btn-primary">Pesan Lagi</a>
                            <a href="/order?id=${v.idOrder}" class="btn btn-outline-info">Detail</a>
                            </div>
                        </div>
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
        </div>`
    });
    document.getElementById("data-order").innerHTML = orders;
}