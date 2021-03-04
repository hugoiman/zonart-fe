class LinkUserElement extends HTMLElement {
    set customer(customer) {
        this._customer = customer;
        this.render();
    }

    render() {
        this.innerHTML = `
        <li class="dropdown"><a href="#" data-toggle="dropdown" class="nav-link dropdown-toggle nav-link-lg nav-link-user">
            <img alt="image" src="/assets/img/avatar/avatar-1.png" class="rounded-circle mr-1">
                <div class="d-sm-none d-lg-inline-block nama">${this._customer.nama}</div></a>
                <div class="dropdown-menu dropdown-menu-right">
                <a href="/profil" class="dropdown-item has-icon">
                    <i class="far fa-user"></i> Profil
                </a>
                <a href="/transaksi" class="dropdown-item has-icon">
                    <i class="far fa-handshake"></i> Transaksi
                </a>
                <a href="/pengaturan" class="dropdown-item has-icon">
                    <i class="fas fa-cog"></i> Pengaturan
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" id="logout" class="dropdown-item has-icon text-danger" onclick="signout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </li>`;
    }
}

customElements.define("link-user-element", LinkUserElement);