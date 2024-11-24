const ssuid = localStorage.getItem("ssuid");

$(async () => {
  if (ssuid) {
    mainAuthen.addClass("d-none");
    let target = new Object();
    target.content = [request];
    target.script = scriptLink + `?resource=`;
    target.title = capitalizeFirstLetter(target.content);
    switch (target.content) {
      case "settings":
        target.content.push("resource-types");
        break;
      case "resources":
      default:
        target.content = ["resources"];
        target.script += "lists";
        target.title = "Dashboard";
    }
    // target.script+= res
    // target.
    console.log(target);
    target.row = new Array();
    $(".content-header>h1").html(target.title);
    const resource = await fetch(target.script);
    await resource.json().then((result) => {
      console.log(result);
    });
    // $(".content").html(cardTableComponent(target));
  } else {
    swalMessage("Unauthorization", "Please sign in first!", "error");
  }
  hidePreloader();
});

$("form#authen").on("submit", async (e) => {
  e.preventDefault();
  swalLoading("Varidating");
  var input = $(e.target).find("input");
  var id = input[0].value;
  var secret = input[1].value;
  var link = `${scriptLink}?hash=supers&id=${id}&secret=${secret}`;
  var data = await fetch(link);
  await data.json().then((result) => {
    if (!result.message) {
      localStorage.setItem("ssuid", result.id);
      swalLoading(
        "Your session is accessed",
        false,
        "success",
        2000,
        false
      ).then(() => {
        window.location.reload();
      });
    } else {
      swalMessage("Something went wrong", "Please try again", "error");
    }
  });
});

const cardTableComponent = (dataObj) => {
  //   console.log(dataObj);
  var element = `<div class="card content-${dataObj.content}">`;
  element += `<div class="card-header">`;
  element += `<h3 class="card-title">${capitalizeFirstLetter(
    dataObj.content
  )}</h3>`;
  element += `</div>`;
  element += `<div class="card-body">`;
  element += `<table id="example" class="table table-bordered table-striped nowrap">`;
  element += rowTableComponent(dataObj.row);
  element += `</table>`;
  element += `</div>`;
  element += `<div class="card-footer border-0">`;
  element += `</div>`;
  element += `</div>`;
  return element;
};

const rowTableComponent = (dataArray) => {
  var element = "";
  var dataTables = ({ thead, tbody } = new Array());
  dataArray.forEach((val, key) => {
    console.log({ val, key });
  });
};

// const
// if (id) {
//   content.content = $(".content-collections");
//   targetTable = 2;
//   targetTableOptions.order = [[2, "asc"]];
//   targetTableOptions.columnDefs.push({ targets: 2, visible: false });
//   targetTableOptions.columnDefs.push({
//     targets: 3,
//     searchable: false,
//     orderable: false,
//   });
//   targetTableOptions.rowGroup = {
//     dataSrc: (row) => {
//       return row[2];
//     },
//   };
// }

// pageLoad().then(async (response) => {
//   var icon = "success";
//   var title = "Your resources has been loaded";
//   if (!response.auth) {
//     icon = "error";
//     title = "Unauthorization";
//     mainHeader.classList.add("d-none");
//     mainSidebar.addClass("d-none");
//     contentWrapper.addClass("d-none");
//     mainFooter.addClass("d-none");
//   } else {
//     $("#example" + targetTable.toString())
//       .DataTable(targetTableOptions)
//       .buttons()
//       .container()
//       .appendTo(
//         "#example" + targetTable.toString() + "_wrapper .col-md-6:eq(0)"
//       );
//   }
//   Swal.fire({
//     icon,
//     title,
//     showConfirmButton: false,
//     timer: 1500,
//   });
// });

// $("a.btn-logout").on("click", (e) => {
//   e.preventDefault();
//   Swal.fire({
//     title: "Are you sure?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Yes, destroy session!",
//   }).then((result) => {
//     if (result.isConfirmed) {
//       localStorage.removeItem("ssuid");
//       Swal.fire({
//         title: "Successfully",
//         text: "Your session has been destroyed.",
//         icon: "success",
//       }).then(() => {
//         swalLoading("Redirecting");
//         window.location.reload();
//       });
//     }
//   });
// });

// $("form.modal-content").on("submit", async (e) => {
//   e.preventDefault();
//   if (e.target) {
//     var target = e.target,
//       resource = "",
//       response = "",
//       data = $(e.target).serialize(),
//       resourceArray = [
//         {
//           form: ".form-new-resource",
//           resource: `create`,
//           process: "Resource create",
//         },
//         {
//           form: ".form-edit-resource",
//           resource: `update`,
//           process: "Resource update",
//         },
//         {
//           form: ".form-new-collection",
//           resource: `collection-create`,
//           process: "Collection create",
//         },
//         {
//           form: ".form-edit-collection",
//           resource: `collection-update`,
//           process: "Collection update",
//         },
//       ];
//     resourceArray.forEach((row) => {
//       if (target.matches(row.form)) {
//         resource = row.resource;
//         response = row.process;
//       }
//     });
//     swalLoading("Validating");
//     var targetLink = scriptLink + `?resource=${resource}&${data}`;
//     var fetchParams = await fetch(targetLink, { method: "POST" });
//     await fetchParams.json().then((result) => {
//       if (result.message == "success") {
//         swalLoading(
//           `${response}d successfully.`,
//           false,
//           "success",
//           3000,
//           false
//         ).then(() => {
//           window.location.reload();
//         });
//       } else {
//         swalMessage(
//           "Something went wrong!",
//           "Error: " + result.message,
//           "error",
//           "Try again"
//         );
//       }
//     });
//   }
// });

// $("form#authen").on("submit", async (e) => {
//   e.preventDefault();
//   swalLoading("Varidating");
//   var input = $(e.target).find("input");
//   var id = input[0].value;
//   var secret = input[1].value;
//   var link = `${scriptLink}?hash=supers&id=${id}&secret=${secret}`;
//   var data = await fetch(link);
//   var result = await data.json();
//   if (result.message) {
//     swalMessage("Something went wrong", "Please try again", "error");
//   } else {
//     localStorage.setItem("ssuid", result.id);
//     swalLoading("Your session is accessed", false, "success", 2000, false).then(
//       function () {
//         swalLoading("Redirecting");
//         window.location.reload();
//       }
//     );
//   }
// });

// async function pageLoad() {
//   swalLoading();
//   var response = { auth: true };
//   if (!ssuid) {
//     response.auth = false;

//     return response;
//   } else {
//     mainAuthen.addClass("d-none");
//     var targetResource, navLink, message;
//     switch (request) {
//       case "settings":
//         message = "Settings";
//         contentResources = $(".content-types");
//         targetResource = "types";
//         break;
//       case "collections":
//         targetResource = request;
//         break;
//       case "resources":
//         $(".nav-item-dropdown").addClass("menu-is-opening menu-open");
//         navLink = "dropdown";
//         targetResource = "members";
//       default:
//         message = message ? message : "Dashboard";
//         navLink = navLink ? navLink : "index";
//         targetResource = targetResource ? targetResource : "lists";
//     }

//     var resourceLists = await fetch(scriptLink + `?resource=lists`);
//     var resourceRow = await resourceLists.json();
//     resourceRow.forEach((row) => {
//       if (row.id == id) {
//         message = row.title;
//       }
//       navTreeView.append(navItemComponent(row));
//     });
//     contentHeader.html(`<h1>${message}</h1>`);

//     hidePreloader();
//     var targetLink = scriptLink + `?resource=` + targetResource;
//     if (targetResource == "members") {
//       targetLink += "&src=" + id;
//     } else {
//       targetLink += id ? "&id=" + id : "";
//     }
//     var target = await fetch(targetLink);
//     await target
//       .json()
//       .then((data) => {
//         if (data.length > 0) {
//           data.forEach((val) => {
//             var tableBodyResources = $(".table-body-resources");
//             if (id) {
//               tableBodyResources = $(".table-body-collections");
//             } else if (request == "settings") {
//               tableBodyResources = $(".table-body-types");
//             }
//             console.log(val);
//             if (val.row) {
//               val.row.forEach((row) => {
//                 var dataObj = { id: row.info.id, title: row.info.label };
//                 dataObj.type = val.type;
//                 dataObj.secret = row.secret;
//                 console.log(row);
//                 tableBodyResources.append(resourceRowComponent(dataObj));
//               });
//             } else {
//               tableBodyResources.append(resourceRowComponent(val));
//             }
//           });
//         }
//       })
//       .then(() => {
//         contentResources.removeClass("d-none");
//       });

//     $(`.nav-link-${navLink}`).addClass("active");
//   }
//   return response;
// }

// function navItemComponent(dataObj) {
//   var elements = `<li class="nav-item">`;
//   var active;
//   if (id && id == dataObj.id) {
//     active = "active";
//   }
//   elements += `<a class="nav-link ${active}" id="${dataObj.id}" onclick="linkOpen(event, 'admin.html?request=resources');">`;
//   elements += `<i class="far fa-circle nav-icon"></i>`;
//   elements += `<p>${dataObj.title}</p>`;
//   elements += `</a>`;
//   elements += `</li>`;
//   return elements;
// }

// function resourceRowComponent(dataObj) {
//   console.log(dataObj);
//   var targetLink = publicLink + "index.html?request=",
//     outputArray = [
//       `<a class="" id="${dataObj.id}" onclick="linkOpen(event, 'admin.html?request=resources');" title="Detail">${dataObj.title}</a>`,
//       `<a class="" onclick="window.open('${targetLink}', '_blank');" title="Public Link">Example<i class="fas fa-external-link-alt ml-2"></i></a>`,
//     ],
//     options = { title: "Assets", icon: "folder" },
//     n = 2;
//   if (request == "settings") {
//     outputArray[0] = dataObj.name;
//     outputArray[1] = dataObj.note;
//     outputArray[2] = dataObj.secret ? "TRUE" : "FALSE";
//     n = 3;
//     outputArray[n] = "";
//   } else {
//     dataObj.target = "lists";
//     if (id) {
//       n = 3;
//       outputArray[0] = dataObj.title;
//       outputArray[2] = dataObj.type.name;
//       options.title = "Uploads";
//       options.icon = "upload";
//       dataObj.target = "collections";
//     }
//     outputArray[
//       n
//     ] = `<a class="mr-2" id="${dataObj.id}" onclick="" title="RQCode"><i class="fas fa-qrcode text-info"></i></a>`;
//     outputArray[
//       n
//     ] += `<a class="mr-2" onclick="window.open('https://drive.google.com/drive/u/0/folders/${dataObj.id}', '_blank');" title="${options.title}"><i class="fas fa-${options.icon} text-secondary"></i></a>`;
//     if (dataObj.secret) {
//       outputArray[
//         n
//       ] += `<a class="mr-2" data-id="${dataObj.id}" data-target="${dataObj.target}" onclick="ggDecode(event);" title="Decode"><i class="fas fa-hashtag"></i></a>`;
//     }
//   }
//   outputArray[
//     n
//   ] += `<a class="mr-2" data-id="${dataObj.id}" data-title="${dataObj.title}" onclick="editResource(event);" title="Edit"><i class="fas fa-edit text-success"></i></a>`;
//   outputArray[
//     n
//   ] += `<a class="mr-2" data-id="${dataObj.id}" data-title="${dataObj.title}" onclick="deleteResource(event);" title="Trash"><i class="fas fa-trash text-danger"></i></a>`;
//   var elements = `<tr>`;

//   elements += createRow(outputArray);
//   elements += `</tr>`;
//   return elements;
// }

// function createRow(dataArray) {
//   var output = "";
//   dataArray.forEach((row) => {
//     console.log(row);
//     output += `<td>${row}</td>`;
//   });
//   return output;
// }

// var htmlBody = $(".modal-body");
// function newResource() {
//   var htmlOutput = `<div class="mb-3">`;
//   htmlOutput += `<label for="title" class="form-label">Resource Title</label>`;
//   htmlOutput += `<input type="text" name="title" id="title" class="form-control" required>`;
//   htmlOutput += `</div>`;
//   htmlOutput += `<label for="secret">Secret Input</label>`;
//   htmlOutput += `<div class="input-group">`;
//   htmlOutput += `<input type="text" class="form-control" id="secret" name="secret" minlength="6" required>`;
//   htmlOutput += `<span class="input-group-append">`;
//   htmlOutput += `<button type="button" class="btn btn-info btn-flat" onclick="hashGenerate(event);">Auto Generate</button>`;
//   htmlOutput += `</span>`;
//   htmlOutput += `</div>`;
//   htmlBody.html(htmlOutput);
//   $(".modal-content").addClass("form-new-resource");
//   $(".modal-title").html("Form new resource");
//   $("#modal-default").modal("show");
// }

// function editResource(e) {
//   var data = { id: e.target.dataset.id, title: e.target.dataset.title };
//   var htmlOutput = `<div class="mb-3">`;
//   htmlOutput += `<input type="hidden" name="id" value="${data.id}">`;
//   htmlOutput += `<label for="title" class="form-label">Resource Title</label>`;
//   htmlOutput += `<input type="text" name="title" value="${data.title}" class="form-control">`;
//   htmlOutput += `</div>`;
//   htmlOutput += `<label for="secret">Secret Input</label>`;
//   htmlOutput += `<div class="input-group">`;
//   htmlOutput += `<input type="text" class="form-control" id="secret" name="secret" minlength="6">`;
//   htmlOutput += `<span class="input-group-append">`;
//   htmlOutput += `<button type="button" class="btn btn-info btn-flat" onclick="hashGenerate(event);">Auto Generate</button>`;
//   htmlOutput += `</span>`;
//   htmlOutput += `</div>`;
//   htmlBody.html(htmlOutput);
//   $(".modal-content").addClass("form-edit-resource");
//   $(".modal-title").html("Form edit resource");
//   $("#modal-default").modal("show");
// }

// function deleteResource(e) {
//   e.preventDefault();
//   Swal.fire({
//     title: "Are you sure?",
//     text: "You won't be able to revert this!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Yes, delete it!",
//   }).then(async (result) => {
//     if (result.isConfirmed) {
//       swalLoading("Processing");
//       var targetLink =
//         scriptLink + `?resource=delete&id=${e.target.dataset.id}`;
//       var fetchDelete = await fetch(targetLink, { method: "POST" });
//       await fetchDelete.json().then((result) => {
//         if (result.message == "success") {
//           Swal.hideLoading();
//           swalLoading(
//             "Deleted!",
//             `Your resource '${e.target.dataset.title}' has been deleted.`,
//             "success",
//             3000,
//             false
//           ).then(() => {
//             window.location.reload();
//           });
//         } else {
//           swalMessage(
//             "Something went wrong!",
//             "Error: " + result.message,
//             "error",
//             "Try again"
//           );
//         }
//       });
//     }
//   });
// }

// function hashGenerate(e) {
//   e.preventDefault();
//   var length = 8,
//     charset = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`,
//     retVal = "";
//   for (var i = 0, n = charset.length; i < length; ++i) {
//     retVal += charset.charAt(Math.floor(Math.random() * n));
//   }
//   $("input#secret").val(retVal);
// }

// async function ggDecode(e) {
//   e.preventDefault();
//   var dataObj = { id: e.target.dataset.id, target: e.target.dataset.target };
//   swalLoading("Decodeing");
//   var dataLink =
//     scriptLink + `?resource=decode&target=${dataObj.target}&id=${dataObj.id}`;
//   var data = await fetch(dataLink);
//   await data.json().then((response) => {
//     var icon = false,
//       showCancelButton = true,
//       showConfirmButton = true,
//       confirmButtonText = "Copy";
//     Swal.fire({
//       title: "Result: " + response.message,
//       icon,
//       showCancelButton,
//       showConfirmButton,
//       confirmButtonText,
//     }).then((result) => {
//       if (result.isConfirmed) {
//         navigator.clipboard.writeText(response.message);
//         swalLoading("Copied", false, "success", 1500, false);
//       }
//     });
//   });
// }
