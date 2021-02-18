class AsideStoreElement extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <div class="sidebar-brand">
            <a href="index.html">ZonArt</a>
        </div>
        <div class="sidebar-brand sidebar-brand-sm">
            <a href="index.html">ZA</a>
        </div>
        <ul class="sidebar-menu">
            <li class="menu-header">Menu</li>
            <div id="sidebar-menu"></div>
        </ul>`;
    }
}

const menues = (namaToko) => {
    let menu =
    {
        dashboard : `<li class="nav-dashboard"><a class="nav-link" href="/dashboard/${namaToko}"><i class="fas fa-fire"></i> <span>Dashboard</span></a></li>`,
        pesanan : `<li class="nav-pesanan"><a class="nav-link" href="/pesanan/${namaToko}"><i class="fas fa-shopping-basket"></i></i> <span>Pesanan</span></a></li>`,
        produk : `<li class="nav-produk"><a class="nav-link" href="/produk/${namaToko}"><i class="fas fa-fire"></i> <span>Produk</span></a></li>`,
        grupOpsi : `<li class="nav-grupopsi"><a class="nav-link" href="/grup-opsi/${namaToko}"><i class="fas fa-sitemap"></i> <span>Grup Opsi</span></a></li>`,
        pengaturan : `<li class="nav-pengaturan"><a class="nav-link" href="/pengaturan/${namaToko}"><i class="fas fa-cogs"></i> <span>Pengaturan Toko</span></a></li>`,
        galeri : `<li class="nav-galeri"><a class="nav-link" href="/galeri/${namaToko}"><i class="fas fa-images"></i> <span>Galeri</span></a></li>`,
        faq : `<li class="nav-faq"><a class="nav-link" href="/faq/${namaToko}"><i class="fas fa-question"></i> <span>FAQ</span></a></li>`,
        karyawan : `<li class="nav-karyawan"><a class="nav-link" href="/karyawan/${namaToko}"><i class="fas fa-users"></i> <span>Karyawan</span></a></li>`
    }
    return menu;
}

customElements.define("asidestore-element", AsideStoreElement);
export default menues;