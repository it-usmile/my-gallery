
var ssname = "sc_" + urlParams().get("request");
var ssid = localStorage.getItem(ssname);

var access = ["lists", "collections"];

var targetRequest = request;
// var targetRequest;
// switch (request) {
//   case access[0]:
//     targetRequest = "lists";
//     break;
//   case access[1]:
//     targetRequest = "collections";
//     break;
// }

pageLoad().then((response) => {
  // console.log(response);
  var message, confirm;
  setTimeout(() => {
    if (response.auth || !response.target) {

      mainAuthen.addClass("d-none");

      confirm = "Retry";
    }
    if (!response.target) {
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
  }, 1000);
  // // console.log(response);
});

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

$("form#authen").on('submit', async (e) => {
  e.preventDefault();
  swalLoading("Varidating");

  var resource = await fetch(
    scriptLink + `?resource=${targetRequest}&id=${id}`
  );
  var target = await resource.json();
  // console.log(target);
  var targetId = urlParams().get("id");
  if (!target.secret) {
    targetId = target.resource.id
    targetRequest = access[0];
    ssname = 'sc_' + access[0];
  }

  var input = $(e.target).find("input");
  var secret = input[0].value;
  var targetLink = `${scriptLink}?hash=${targetRequest}&id=${targetId}&secret=${secret}`;
  var targetData = await fetch(targetLink);
  var targetResource = await targetData.json();
  // // console.log(targetResource);

  if (targetResource.message) {
    //   // alert(result.message);
    swalMessage("Something went wrong", "Please try again", "error");
  } else {
    //   // setCookie(cname, result.id, 0.25);
    localStorage.setItem(ssname, targetResource.id);
    //   // window.location.reload();
    swalLoading("Your session is accessed", false, "success", 2000, false).then(function () {
      Swal.hideLoading();
      window.location.reload();
    })
  }
});

content.on("click", "img", async function (e) {
  //
  // // console.log(e.target);

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
    // // // console.log();
  }
});


async function pageLoad() {
  swalLoading();
  var params = new Array();

  // hidePreloader();
  if (request && access.includes(request)) {

    var resource = await fetch(
      scriptLink + `?resource=${targetRequest}&id=${id}`
    );
    params.target = await resource.json();
    // // console.log(params.target)
    params.target.secret = params.target.secret;
    var targetId = params.target.id;
    if (!params.target.secret && params.target.resource) {
      params.target.secret = params.target.resource.secret;
      targetId = params.target.resource.id;
      ssid = localStorage.getItem("sc_lists");
    }
    // console.log(ssid)
    // console.log(params.target.id)
    // console.log(targetId)
    if (params.target.secret && ssid != targetId) {
      params.auth = false;
      // if (ssid == targetId) {
      //   params.auth = true;
      // }
    } else if (ssid == targetId) {
      params.auth = true;
      mainAuthen.addClass("d-none");
      var titlePage = params.target.title
      var option = params.target.description ? ' ' + params.target.description : '';
      if (params.target.resource.id) {
        titlePage = params.target.resource.title;
        // ssid = localStorage.getItem("sc_lists");
      }
      contentHeader.html(`<h1>${titlePage}</h1>`);

      // if (params.target.id != params.target.resource) {
      var records = await fetch(
        scriptLink + `?resource=records&collection=${params.target.id}`
      );
      await records.json().then(function (targetData) {
        // var targetArray = targetData;
        var collection = params.target.title;
        if (params.target.description) {
          collection += ' ' + params.target.description;
        }
        for (var i = 0; i < targetData.length; i++) {
          targetData[i].collection = collection;
        }
        // // console.log(targetData)
        // var targetName = '';
        if (params.target.type) {
          content.append(
            cardComponent(
              params.target.type.name,
              params.target.type.id,
              targetData,
              targetData.length
            )
          );
        }
      });
      // }
      hidePreloader();
      var targetResource = params.target.id;
      if (params.target.resource.id) {
        targetResource = params.target.resource.id;
        // 
      }
      // console.log(params);
      // console.log(targetResource);
      var members = await fetch(
        scriptLink +
        `?resource=members&src=${targetResource}&deny=${params.target.id}`
      );
      await members.json().then((result) => {
        for (var i = 0; i < result.length; i++) {
          var target = result[i];
          var records = new Array();
          // console.log(target);
          if (!target.type.secret) {
            target.row.forEach((val) => {
              // console.log(val)
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
        }
      });
    }
    // if()
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
    target.description = target.description ? target.description : null;
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

function navItemComponent(title, link = null, target = "_top") {
  var elements = `<li class="nav-item">`;
  elements += `<a class="nav-link" onclick="window.open('${link}', '${target}');">`;
  elements += `<i class="far fa-circle nav-icon"></i>`;
  elements += `<p>${title}</p>`;
  elements += `</a>`;
  elements += `</li>`;
  return elements;
}