class NotificationItem extends HTMLElement {
  set notification(notification) {
    this._notification = notification;
    this.render()
  }

  render() {
    this.innerHTML = `<a href="${this._notification.id}" class="dropdown-item dropdown-item-unread">
      <div class="dropdown-item-icon bg-primary text-white">
        <i class="fas fa-code"></i>
      </div>
      <div class="dropdown-item-desc">
      ${this._notification.message}
        <div class="time text-primary">${this._notification.createdAt}</div>
      </div>
    </a>`;
  }
}

customElements.define("notification-item", NotificationItem);