import "./store/store-element.js"
import "./notification/notification-element.js"
import "./link-user/link-user-element.js"

class NavElement extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <a href="#" class="navbar-brand sidebar-gone-hide"><span class="brand"></span></a>
            <div class="navbar-nav">
                <a href="#" class="navbar-brand sidebar-gone-show"><span class="brand"></span></a>
            </div>
            <form class="form-inline ml-auto">
                <!-- <search-element></search-element> -->
            </form>
            <ul class="navbar-nav navbar-right">
                <store-element></store-element>
                <notification-element></notification-element>
                <link-user-element></link-user-element>
            </ul>`;
    }
}

customElements.define("nav-element", NavElement);