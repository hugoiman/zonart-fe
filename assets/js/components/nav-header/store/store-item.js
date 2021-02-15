class StoreItem extends HTMLElement {
  set store(store) {
    this._store = store;
    this.render()
  }

  render() {
    this.innerHTML = `<a href="/toko/${this._store.slug}" class="dropdown-item dropdown-item-unread">
      <div class="dropdown-item-avatar">
        <img alt="image" src="/assets/img/avatar/avatar-1.png" class="rounded-circle">
        <div class="is-online"></div>
      </div>
      <div class="dropdown-item-desc">
        <b>${this._store.namaToko}</b>
      </div>
    </a>`;
  }
}

customElements.define("store-item", StoreItem);