import "./store-item.js";

class StoreList extends HTMLElement {
    set stores(stores) {
        this._stores = stores;
        if(this._stores != null) {
            this.render();
        }
    }

    render() {
            this._stores.forEach(store => {
                const storeItemElement = document.createElement("store-item");
                storeItemElement.store = store;
                this.appendChild(storeItemElement);
            })
    }
}

customElements.define("store-list", StoreList);