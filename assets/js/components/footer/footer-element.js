class FooterElement extends HTMLElement {
    connectedCallback() {
        this.render();
        document.getElementById("year").innerHTML = new Date().getFullYear();
        [].slice.call(document.getElementsByClassName("brand")).forEach(function (div) {
            div.innerHTML = "ZonArt";
        });
    }

    render() {
        this.innerHTML = `
        <div class="footer-left">
            Copyright &copy; <span id="year"></span> <div class="bullet"></div>
            <span class="brand"></span>
        </div>
        <div class="footer-right">
            2.3.0
        </div>`;
    }
}

customElements.define("footer-element", FooterElement);