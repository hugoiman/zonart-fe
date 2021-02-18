import "./notification-list.js";
// import notifications from "./notifications.js";
import {getNotifikasi, readNotifikasi} from "../../../request/notifikasi.js";

const notificationListElement = document.createElement("notification-list");
getNotifikasi().then(dataNotifikasi => {
  dataNotifikasi.notifikasi.forEach(element => {
    if(element.dibaca == false) {
      $(".notification-toggle").addClass("beep");
      return;
    }
  })
  notificationListElement.notifications = dataNotifikasi.notifikasi;
});

class NotificationElement extends HTMLElement {
  connectedCallback() {
    this.render();
    document.getElementsByClassName("dropdown-list-content notification")[0].appendChild(notificationListElement);
  }

  render() {
    this.innerHTML = `
      <li class="dropdown dropdown-list-toggle"><a href="#" onclick="readNotif()" data-toggle="dropdown" class="nav-link notification-toggle nav-link-lg"><i class="far fa-bell"></i></a>
        <div class="dropdown-menu dropdown-list dropdown-menu-right">
          <div class="dropdown-header">Notifikasi</div>
          <div class="dropdown-list-content notification dropdown-list-icons">
            <notification-list></notification-list>
          </div>
          <div class="dropdown-footer text-center">
            <a href="/notifikasi">Lihat Semua <i class="fas fa-chevron-right"></i></a>
          </div>
        </div>
      </li>`;
  }
}

const readNotif = async () => { 
  try {
    let read = await readNotifikasi();
    $(".notification-toggle").removeClass("beep");
  } catch(error) {

  }
}

customElements.define("notification-element", NotificationElement);
window.readNotif = readNotif;

