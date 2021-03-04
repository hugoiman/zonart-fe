import "../components/nav-header/nav-element.js";
import "../components/footer/footer-element.js";
import {login} from "../request/auth.js";
import {getCustomer} from "../request/customer.js";
import {alertFailed} from "./swalert.js";
import {logout} from "./general.js";

const loadMain = async () => {
    try {
        const data = await getCustomer();
        const dataUser = await document.createElement("link-user-element");
        dataUser.customer = data;
        document.getElementsByClassName("navbar-right")[0].appendChild(dataUser);
    } catch(error) {
        let btnLogin = `<buttons>
                            <a href="#" class="btn btn-outline-light" onclick="modalLogin()">Login</a>
                            <a href="/registrasi" class="btn btn-light">Daftar</a>
                        </buttons>`;
        document.getElementsByClassName('navbar-right')[0].innerHTML = btnLogin;
        // alertFailed(error.responseText, false);
    }
}

function signout() {
    logout();
}

function modalLogin() {
    let modal = `<div class="modal fade" tabindex="-1" role="dialog" id="modal-grupopsi">
        <div class="modal-dialog" role="document">
          <form>
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Login</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="form-group col-md-12 col-12">
                    <label class="col-form-label text-md-right">Username</label>
                    <input type="text" class="form-control" id="username" tabindex="1"/>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12 col-12">
                    <label class="col-form-label text-md-right">Password</label>
                    <div class="float-right">
                        <a href="/reset-password" class="text-small">
                          Lupa Password?
                        </a>
                    </div>
                    <input type="password" class="form-control" id="password" tabindex="2"/>
                  </div>
                </div>
              </div>
              <div class="modal-footer bg-whitesmoke br">
                <button type="button" class="btn btn-primary btn-lg btn-block" onclick="signin()" tabindex="3">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>`;
        $(modal).modal('show');
}

const signin = async () => {
    try {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        let jsonData = JSON.stringify({
            username,
            password,
        });

        let result = await login(jsonData);
        Cookies.set("token", result.token, { expires: 7, path: "/" });
        window.location.reload();
    } catch(error) {
        alertFailed(error, false);
    }
}

window.signout = signout;
window.signin = signin;
window.modalLogin = modalLogin;

export default loadMain;