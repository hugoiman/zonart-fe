import "./store/store-element.js"
import "./notification/notification-element.js"
import "./link-user/link-user-element.js"

class NavStoreElement extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <form class="form-inline mr-auto"">
                <input type="text" id="idToko" hidden>
                <ul class="navbar-nav mr-3">
                    <li><a href="#" data-toggle="sidebar" class="nav-link nav-link-lg"><i class="fas fa-bars"></i></a></li>
                </ul>
                <!-- <search-element></search-element> -->
            </form>
            <ul class="navbar-nav navbar-right">
                <store-element></store-element>
                <notification-element></notification-element>
                <link-user-element></link-user-element>
            </ul>`;
    }
}

customElements.define("navstore-element", NavStoreElement);