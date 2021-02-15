import "./notification-item.js";

class NotificationList extends HTMLElement {
    set notifications(notifications) {
        this._notifications = notifications;
        this.render();
    }

    render() {
        this._notifications.forEach(notification => {
            const notificationItemElement = document.createElement("notification-item");
            notificationItemElement.notification = notification;
            this.appendChild(notificationItemElement);
        })
    }
}

customElements.define("notification-list", NotificationList);