
var scriptLink = `https://script.google.com/macros/s/AKfycbxO5fNXc7c7OoSwo7juM6c-0-FqKxgsih9RoDtGn769cfBTgxpdTybEUailm9Fli_R7/exec`;

var toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);

var currentTheme = localStorage.getItem("theme");

var mainHeader = document.querySelector(".main-header");

var id = urlParams().get("id");
var request = urlParams().get("request");


if (currentTheme) {
  if (currentTheme === "dark") {
    if (!document.body.classList.contains("dark-mode")) {
      document.body.classList.add("dark-mode");
    }
    if (mainHeader.classList.contains("navbar-light")) {
      mainHeader.classList.add("navbar-dark");
      mainHeader.classList.remove("navbar-light");
    }
    toggleSwitch.checked = true;
  }
}
// $(document.body).load(() => {

// })

function switchTheme(e) {
  if (e.target.checked) {
    if (!document.body.classList.contains("dark-mode")) {
      document.body.classList.add("dark-mode");
    }
    if (mainHeader.classList.contains("navbar-light")) {
      mainHeader.classList.add("navbar-dark");
      mainHeader.classList.remove("navbar-light");
    }
    localStorage.setItem("theme", "dark");
  } else {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
    }
    if (mainHeader.classList.contains("navbar-dark")) {
      mainHeader.classList.add("navbar-light");
      mainHeader.classList.remove("navbar-dark");
    }
    localStorage.setItem("theme", "light");
  }
}

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

toggleSwitch.addEventListener("change", switchTheme, false);