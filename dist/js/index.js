var toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);
var ssname = "sc_" + urlParams().get("request");

var currentTheme = localStorage.getItem("theme");
var ssid = localStorage.getItem(ssname);
var mainHeader = document.querySelector(".main-header");
var contentHeader = $(".content-header");
var navTreeView = $(".nav-treeview");
var mainAuthen = $(".main-authen");
var mainSidebar = $(".main-sidebar");
var contentWrapper = $(".content-wrapper");
var mainFooter = $(".main-footer");
var content = $(".content");
var access = ["resources", "secret"];

var targetRequest;
switch (request) {
  case access[0]:
    targetRequest = "lists";
    break;
  case access[1]:
    targetRequest = "collections";
    break;
}

pageLoad().then((response) => {
  var message, confirm;
  if (response.auth || response.target.length == 0) {

    mainAuthen.addClass("d-none");

    confirm = "Retry";
  }
  if (response.target.length == 0) {
    $("body").addClass("dark-mode");
    message = "Not Found";
    message = message ? message : response.error;
    contentHeader.html(`<h1>${message}</h1>`);
    // setTimeout(() => {
    hidePreloader();
    swalMessage(
      "Something went wrong!",
      `<pre><code>${message}</code></pre>`,
      "error", confirm
    ).then(() => {
      swalLoading("Reloading", false, false, 1500).then(() => {
        window.location.reload();
      })
    });
    // })
  } else {
    hidePreloader();
    var icon = 'success';
    var title = 'Your resources has been loaded';
    if (!response.auth) {
      icon = "error";
      title = "Unauthorization";
      mainHeader.classList.add("d-none");
      mainSidebar.addClass("d-none");
      contentWrapper.addClass("d-none");
      mainFooter.addClass("d-none");
    }
    Swal.fire({
      icon,
      title,
      showConfirmButton: false,
      timer: 1500,
    });

  }
  // console.log(response);
});

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

$("form#authen").on('submit', async (e) => {
  e.preventDefault();
  swalLoading("Varidating");
  var input = $(e.target).find("input");
  var secret = input[0].value;
  var link = `${scriptLink}?hash=${targetRequest}&id=${urlParams().get("id")}&secret=${secret}`;
  // // swalLoading();
  var data = await fetch(link);
  var result = await data.json();
  console.log(result);
  if (result.message) {
    //   // alert(result.message);
    swalMessage("Something went wrong", "Please try again", "error");
  } else {
    //   // setCookie(cname, result.id, 0.25);
    localStorage.setItem(ssname, result.id);
    //   // window.location.reload();
    swalLoading("Your session is accessed", false, "success", 2000, false).then(function () {
      Swal.hideLoading();
      window.location.reload();
    })
  }
});

content.on("click", "img", async function (e) {
  //
  // console.log(e.target);

  if (e.target && e.target.matches(".block-image")) {
    e.preventDefault();
    var targetId = $(e.target).data("target-id");
    var targetName = $(e.target).data("target-name");
    swalLoading("Wait a moment", targetName);
    $("#targetTitle").html(targetName);
    var link = `https://lh3.googleusercontent.com/d/${targetId}=w1000`;
    // $("img#record").attr("src", link);
    $("img#record").attr("src", await fetch(link).then(async (result) => {
      var imageBlob = await result.blob();
      var imageObjectURL = URL.createObjectURL(imageBlob);
      Swal.close();
      return imageObjectURL;
    })
    );
    $("#showRecord").modal("show");
    // // console.log();
  }
});

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

async function pageLoad() {
  swalLoading();
  var params = new Array();

  // hidePreloader();
  if (request && access.includes(request)) {

    var resource = await fetch(
      scriptLink + `?resource=${targetRequest}&id=${id}`
    );
    params.target = await resource.json();

    if (params.target.secret && ssid) {
      mainAuthen.addClass("d-none");
      contentHeader.html(`<h1>${params.target.title}</h1>`);

      if (params.target.id != params.target.resource) {
        var records = await fetch(
          scriptLink + `?resource=records&collection=${params.target.id}`
        );
        await records.json().then(function (records) {
          records.collection = params.target.title;
          console.log(params.target.type.name)
          content.append(
            cardComponent(
              params.target.type.name,
              params.target.type.id,
              records,
              records.length
            )
          );
        });
      }
      hidePreloader();
      var members = await fetch(
        scriptLink +
        `?resource=members&src=${params.target.resource}&deny=${params.target.id}`
      );
      await members.json().then((result) => {
        for (var i = 0; i < result.length; i++) {
          var target = result[i];
          var records = new Array();
          target.row.forEach((val) => {
            val.data.forEach((data) => {
              records.push({ collection: val.info.label, ...data });
            });
          });
          navTreeView.append(
            navItemComponent(target.type.name, "#" + target.type.id)
          );
          content.append(
            cardComponent(
              target.type.name,
              target.type.id,
              records,
              records.length
            )
          );
        }
      });
      params.auth = true;
    }
  } else {
    params.error = "Bad Request!";
  }
  return params;
}

async function getRecords(collection) {
  var targetScriptUrl = scriptLink + `?resource=records`;
  targetScriptUrl += `&collection=${collection}`;
  var result = await fetch(targetScriptUrl);
  var data = await result.json();
  return data;
}
//

function navItemComponent(title, link = null, target = "_top") {
  var elements = `<li class="nav-item">`;
  elements += `<a class="nav-link" onclick="window.open('${link}', '${target}')">`;
  elements += `<i class="far fa-circle nav-icon"></i>`;
  elements += `<p>${title}</p>`;
  elements += `</a>`;
  elements += `</li>`;
  return elements;
}

function cardComponent(title, id, imageObj, length) {

  var col = 4;
  if (length <= 2) {
    col = 12;
  } else if (length == 3) {
    col = 6;
  }
  var component = `<div class="card card-primary mb-3" id="${id}">`;
  component += `<div class="card-header">`;
  component += `<h4 class="card-title">${title}</h4>`;
  component += `</div>`;
  component += `<div class="card-body row">`;
  imageObj.forEach(function (target) {
    // console.log(target)
    target.collection = target.collection ? target.collection : title;
    component += `<div class="col-sm-${col} mb-3">`;
    component += `<a href="javascript:void(0);" class="linkTarget">`;
    component += `<img src="https://drive.google.com/thumbnail?id=${target.id}&sz=w1000" class="w-100 h-100 mb-2 block-image" style="object-fit: cover;" alt="${target.name}" data-target-id="${target.id}" data-target-name="${target.collection}" />`;
    component += `</a>`;
    component += `</div>`;
  });
  component += `</div>`;
  component += `</div>`;
  component += ``;
  return component;
}

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

toggleSwitch.addEventListener("change", switchTheme, false);
