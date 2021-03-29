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

const formatRupiah = function formatRupiah(nominal) {
	var rupiah = '';
	var nominalrev = nominal.toString().split('').reverse().join('');
	for(var i = 0; i < nominalrev.length; i++) if(i%3 == 0) rupiah += nominalrev.substr(i,3)+'.';
	return rupiah.split('',rupiah.length-1).reverse().join('');
}

const capitalFirst = function capitalFirst(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);  
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}

export {logout, getUrlParameter, getUrlPath, formatRupiah, capitalFirst};