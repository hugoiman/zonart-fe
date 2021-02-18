import "./store-list.js";
import getToko from "../../../data-dummy/toko.js";

const storeListElement = document.createElement("store-list");
storeListElement.stores = getToko();

class StoreElement extends HTMLElement {
    connectedCallback() {
      this.render();
      document.getElementsByClassName("dropdown-list-content store")[0].appendChild(storeListElement);
    }
  
    render() {
      this.innerHTML = `
        <li class="dropdown dropdown-list-toggle"><a href="#" data-toggle="dropdown" class="nav-link nav-link-lg message-toggle"><i class="fas fa-store"></i></a>
            <div class="dropdown-menu dropdown-list dropdown-menu-right">
                <div class="dropdown-header">Toko
                    <div class="float-right">
                        <a href="/form-buka-toko">Buka Toko</a>
                    </div>
                </div>
                <div class="dropdown-list-content store dropdown-list-message">
                    <store-list></store-list>
                </div>
                <div class="dropdown-footer text-center">
                    <a href="/mytoko">Lihat Semua <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        </li>`;
    }
  }
  
  customElements.define("store-element", StoreElement);