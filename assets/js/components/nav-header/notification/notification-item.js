class NotificationItem extends HTMLElement {
  set notification(notification) {
    this._notification = notification;
    this.render()
  }

  render() {
    this.innerHTML = `<a href="/${this._notification.link}" class="dropdown-item dropdown-item-unread">
      <div class="dropdown-item-desc">
      <b>${this._notification.judul}</b> &mdash;
      ${this._notification.pesan}
        <div class="time text-primary">${this._notification.createdAt}</div>
      </div>
    </a>`;
  }
}

customElements.define("notification-item", NotificationItem);