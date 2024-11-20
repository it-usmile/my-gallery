var toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);
var currentTheme = localStorage.getItem("theme");
var sessionId = localStorage.getItem("ssid");
var mainHeader = document.querySelector(".main-header");
var contentHeader = $(".content-header");
var navTreeView = $(".nav-treeview");
var content = $(".content");

pageLoad().then((response) => {
  if (response.error) {
    swalMessage(
      "Something went wrong!",
      `<pre><code>${response.error}</code></pre>`,
      "error"
    ).then(() => {
      window.location.reload();
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "Your resources has been loaded",
      showConfirmButton: false,
      timer: 1500,
    });
    console.log(response);
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
  var access = ["resources", "secret"];
  if (access.includes(request)) {
    var targetRequest;
    switch (request) {
      case access[0]:
        targetRequest = "lists";
        break;
      case access[1]:
        targetRequest = "collections";
        break;
    }
    var resource = await fetch(
      scriptLink + `?resource=${targetRequest}&id=${id}`
    );
    params.target = await resource.json();
    if (params.target.secret && sessionId) {
      contentHeader.html(`<h1>${params.target.title}</h1>`);

      if (params.target.id != params.target.resource) {
        var records = await fetch(
          scriptLink + `?resource=records&collection=${params.target.id}`
        );
        await records.json().then(function (records) {
          records.collection = params.target.title;
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
    } else {
      hidePreloader();
    }
  } else {
    params.error = "Access denined!";
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
    var targetTitle = imageObj.collection
      ? imageObj.collection.name
      : target.collection.name;
    component += `<div class="col-sm-${col} mb-3">`;
    component += `<a href="javascript:void(0);" class="linkTarget">`;
    component += `<img src="https://drive.google.com/thumbnail?id=${target.id}&sz=w1000" class="w-100 h-100 mb-2 block-image" style="object-fit: cover;" alt="${target.name}" data-target-id="${target.id}" data-target-name="${targetTitle}" />`;
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
