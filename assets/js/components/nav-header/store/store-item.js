class StoreItem extends HTMLElement {
  set store(store) {
    this._store = store;
    this.render()
  }

  render() {
    this.innerHTML = `<a href="${(this._store.deskripsi == "owner" ? `/${this._store.slug}/dashboard`:`/${this._store.slug}/pesanan`)}" class="dropdown-item dropdown-item-unread">
      <div class="dropdown-item-avatar">
        <img alt="image" src="${this._store.foto}" class="rounded-circle">
      </div>
      <div class="dropdown-item-desc">
        <b>${this._store.namaToko}</b>
      </div>
    </a>`;
  }
}

customElements.define("store-item", StoreItem);