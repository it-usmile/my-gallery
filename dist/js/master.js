var contentHeader = $(".content-header");
var navTreeView = $(".nav-treeview");
var scriptLink = `https://script.google.com/macros/s/AKfycbxO5fNXc7c7OoSwo7juM6c-0-FqKxgsih9RoDtGn769cfBTgxpdTybEUailm9Fli_R7/exec`;

var id = urlParams().get("id");
var request = urlParams().get("request");

function swalLoading(title, html = null, icon = false, timer = false, loading = true) {
  title = title ? title : "Loading";
  var showConfirmButton = loading ? true : false;
  return Swal.fire({
    icon,
    html,
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: title + "<span></span>",
    timer,
    showConfirmButton,
    didOpen: () => {
      var i = 0;
      if (loading) {
        Swal.showLoading();
      }
      const timer = Swal.getPopup().querySelector("span");
      setInterval(() => {
        if (i < 3) {
          timer.textContent += `.`;
          i++;
        } else {
          timer.textContent = ``;
          i = 0;
        }
      }, 1000);
    },
  });
}

function swalMessage(title, html, icon = false, confirmButtonText = "OK") {
  title = title ? title : "Something went wrong.";
  return Swal.fire({
    title: title,
    html,
    icon,
    confirmButtonText,
    allowEscapeKey: false,
    allowOutsideClick: false,
  });
}

function hidePreloader() {
  var preloader = $(".preloader");
  preloader.css("height", 0);
  setTimeout(function () {
    preloader.children().hide();
  }, 200);
}

function urlParams() {
  var queryString = window.location.search;
  var result = new URLSearchParams(queryString);
  return result;
}
