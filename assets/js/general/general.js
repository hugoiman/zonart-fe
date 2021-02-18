function logout() {
    Cookies.remove("token", { path: "/" });
    window.location.href = "/login";
}

const getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;
  
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
  
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
};

const getUrlPath = function getUrlPath(index) {
  const pageURL = window.location.pathname;
  const path = pageURL.split('/');
  return path[index];
};

export {logout, getUrlParameter, getUrlPath};