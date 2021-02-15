import "./notification-list.js";
import notifications from "./notifications.js";

const notificationListElement = document.createElement("notification-list");
notificationListElement.notifications = notifications;

class NotificationElement extends HTMLElement {
  connectedCallback() {
    this.render();
    document.getElementsByClassName("dropdown-list-content notification")[0].appendChild(notificationListElement);
  }

  render() {
    this.innerHTML = `
      <li class="dropdown dropdown-list-toggle"><a href="#" data-toggle="dropdown" class="nav-link notification-toggle nav-link-lg beep"><i class="far fa-bell"></i></a>
        <div class="dropdown-menu dropdown-list dropdown-menu-right">
          <div class="dropdown-header">Notifikasi</div>
          <div class="dropdown-list-content notification dropdown-list-icons">
            <notification-list></notification-list>
          </div>
          <div class="dropdown-footer text-center">
            <a href="#">Lihat Semua <i class="fas fa-chevron-right"></i></a>
          </div>
        </div>
      </li>`;
  }
}

customElements.define("notification-element", NotificationElement);
