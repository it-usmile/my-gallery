var ssuid = localStorage.getItem("ssuid");
var contentResources = $(".content-resources");
var targetTable = 1;
var targetTableOptions = {
  responsive: true,
  autoWidth: false,
};
// var buttonArray = ["copy", "csv", "excel", "pdf", "print"];
targetTableOptions.columnDefs = [
  { targets: [1, 2], searchable: false, orderable: false },
];

// navTreeView.html('');

if (id) {
  contentResources = $(".content-collections");
  targetTable = 2;
  targetTableOptions.order = [[2, "asc"]];
  // targetTableOptions.buttons = ["copy", "csv", "excel", "pdf", "print"];
  // targetTableOptions.buttons = new Array();
  // buttonArray.forEach((val, key) => {
  //     targetTableOptions.buttons.push({ extend: val, exportOptions: { columns: ':visible' } })
  // })
  targetTableOptions.columnDefs.push({ targets: 2, visible: false });
  targetTableOptions.columnDefs.push({
    targets: 3,
    searchable: false,
    orderable: false,
  });
  // targetTableOptions.lengthChange = false;
  targetTableOptions.rowGroup = {
    dataSrc: (row) => {
      return row[2];
    },
  };
}

pageLoad().then(async (response) => {
  //   console.log(response);
  // hidePreloader();
  var icon = "success";
  var title = "Your resources has been loaded";
  if (!response.auth) {
    icon = "error";
    title = "Unauthorization";
    // mainHeader.addClass("d-none");
    mainHeader.classList.add("d-none");
    mainSidebar.addClass("d-none");
    contentWrapper.addClass("d-none");
    mainFooter.addClass("d-none");
  } else {
    // mainAuthen.addClass('d-none');
    $("#example" + targetTable.toString())
      .DataTable(targetTableOptions)
      .buttons()
      .container()
      .appendTo(
        "#example" + targetTable.toString() + "_wrapper .col-md-6:eq(0)"
      );
    // $("#example").addClass("nowrap");
  }
  Swal.fire({
    icon,
    title,
    showConfirmButton: false,
    timer: 1500,
  });
});

$("a.btn-logout").on("click", (e) => {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, destroy session!",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("ssuid");
      Swal.fire({
        title: "Successfully",
        text: "Your session has been destroyed.",
        icon: "success",
      }).then(() => {
        swalLoading("Redirecting");
        window.location.reload();
      });
    }
  });
  // // console.log(e.target);
});

$("form.modal-content").on("submit", async (e) => {
  e.preventDefault();

  $('input.form-control, textarea').each(function () {
    $(this).val(jQuery.trim($(this).val()));
  });
  // console.log(input[0])
  //   console.log(e.target);
  if (e.target) {
    var target = e.target,
      resource = "",
      response = "",
      method = "POST",
      data = $(e.target).serialize(),
      resourceArray = [
        {
          form: ".form-new-resource",
          resource: `create`,
          process: "Resource create",
        },
        {
          form: ".form-edit-resource",
          resource: `update`,
          process: "Resource update",
        },
        {
          form: ".form-new-resource-type",
          resource: `type-create`,
          process: "Resource type create",
        },
        {
          form: ".form-edit-resource-type",
          resource: `type-update`,
          process: "Resource type update",
        },
        {
          form: ".form-new-collection",
          resource: `collection-create`,
          process: "Collection create",
        },
        {
          form: ".form-edit-collection",
          resource: `collection-update`,
          process: "Collection update",
        },
      ];
    resourceArray.forEach((row) => {
      if (target.matches(row.form)) {
        resource = row.resource;
        response = row.process;
      }
    });
    swalLoading("Validating");
    var targetLink = scriptLink + `?resource=${resource}&${data}`;
    if (resource == `collection-create`) {
      targetLink += `&src=` + id;
    }
    // var targetLink = scriptLink + `?resource=collection-create&src=1x8dwv1pd940IcVEo9xp9kmOAgw2lXEAA&type=rt1731908479859&lebel=ll`;
    console.log(targetLink);
    var fetchParams = await fetch(targetLink, { method });
    await fetchParams.json().then((result) => {
      console.log(result);
      if (result.message == "success") {
        // Swal.hideLoading();
        swalLoading(
          `${response}d successfully.`,
          false,
          "success",
          3000,
          false
        ).then(() => {
          window.location.reload();
          //   pageLoad();
        });
      } else {
        swalMessage(
          "Something went wrong!",
          "Error: " + result.message,
          "error",
          "Try again"
        );
      }
    });
  }
});

$("form#authen").on("submit", async (e) => {
  e.preventDefault();
  swalLoading("Varidating");
  var input = $(e.target).find("input");
  var id = input[0].value;
  var secret = input[1].value;
  var link = `${scriptLink}?hash=supers&id=${id}&secret=${secret}`;
  // // swalLoading();
  var data = await fetch(link);
  var result = await data.json();
  // // console.log(result);
  if (result.message) {
    //   // alert(result.message);
    swalMessage("Something went wrong", "Please try again", "error");
  } else {
    //   // setCookie(cname, result.id, 0.25);
    localStorage.setItem("ssuid", result.id);
    //   // window.location.reload();
    swalLoading("Your session is accessed", false, "success", 2000, false).then(
      function () {
        // Swal.hideLoading();
        swalLoading("Redirecting");
        window.location.reload();
      }
    );
  }
});

async function pageLoad() {
  swalLoading();
  var response = { auth: true };
  // response.resource = new Array();
  if (!ssuid) {
    response.auth = false;

    return response;
  } else {
    mainAuthen.addClass("d-none");
    // // console.log(ssuid)
    var targetResource, navLink, message;
    switch (request) {
      case "settings":
        // contentHeader.html(`<h1>Settings</h1>`);
        message = "Settings";
        // targetResource = request;
        // break;
        contentResources = $(".content-types");
        targetResource = "types";
        // hidePreloader();
        // return response;
        break;
      case "collections":
        targetResource = request;
        break;
      case "resources":
        // nav-link-dropdown
        // $("a#" + id).addClass("active");
        $(".nav-item-dropdown").addClass("menu-is-opening menu-open");
        // message = "Collection";
        navLink = "dropdown";
        targetResource = "members";
      // break;
      default:
        message = message ? message : "Dashboard";
        navLink = navLink ? navLink : "index";
        targetResource = targetResource ? targetResource : "lists";
    }

    var resourceLists = await fetch(scriptLink + `?resource=lists`);
    var resourceRow = await resourceLists.json();
    var resourceId;
    resourceRow.forEach((row) => {
      // // console.log(row);
      if (row.id == id) {
        message = row.title;
        resourceId = row.id;
      }
      navTreeView.append(navItemComponent(row));
    });
    contentHeader.html(`<h1>${message}</h1>`);

    hidePreloader();
    var targetLink = scriptLink + `?resource=` + targetResource;
    if (targetResource == "members") {
      targetLink += "&src=" + id;
    } else {
      targetLink += id ? "&id=" + id : "";
    }
    // //
    // console.log(targetLink);
    // //
    var target = await fetch(targetLink);
    await target
      .json()
      .then((data) => {
        // //
        // console.log(data);
        // //
        if (data.length > 0) {
          data.forEach((val) => {
            // console.log(val);
            // var tableBodyResources = $(".table-body-resources");
            var tableBodyResources = $(".table-body-resources");
            if (id) {
              tableBodyResources = $(".table-body-collections");
            } else if (request == "settings") {
              tableBodyResources = $(".table-body-types");
            }
            // console.log(val);
            // if (val.type) {
            //   val.type.forEach((type) => {
            //     console.log(type);
            //   });
            // }
            val.options = val.note;
            if (val.row) {
              val.row.forEach((row) => {
                var dataObj = { id: row.info.id, title: row.info.label };
                dataObj.type = val.type;
                dataObj.secret = row.secret;
                dataObj.options = row.info.description;
                // dataObj.options = dataObj.description ? dataObj.description :
                // console.log(row);
                // dataArray.push(dataObj);
                // console.log(row);
                tableBodyResources.append(resourceRowComponent(dataObj));
              });
            } else {
              tableBodyResources.append(resourceRowComponent(val));
              //   return val.id;
            }
            // console.log(val);
            // // console.log(dataObj);
            // if (dataArray.length > 0) {
            //     dataArray.forEach((row) => {
            //         tableBodyResources.append(resourceRowComponent(row));
            //     })
            // } else {
            //     tableBodyResources.append(resourceRowComponent(dataObj));
            // }
            // navTreeView.append(navItemComponent(val));
          });
          //   return resourceRow.id;
        }
        // // console.log(dataArray)
        // response.data = data;
      })
      .then(async () => {
        // console.log(resourceId);
        if (request == "resources" && id) {
          const types = await fetch(scriptLink + `?resource=types`);
          await types.json().then((row) => {
            //
            row.forEach((val) => {
              //   console.log(val);
              $(".btn-group>.dropdown-menu").append(
                `<a class="dropdown-item" data-src="${resourceId}" data-type-id="${val.id}" data-type-name="${val.name}" data-secret="${val.secret}" onclick="newCollection(event);">${val.name}</a>`
              );
            });
          });
        }
        contentResources.removeClass("d-none");
      });

    // contentHeader.html(`<h1>${message}</h1>`);
    $(`.nav-link-${navLink}`).addClass("active");
  }
  return response;
}

function navItemComponent(dataObj) {
  var elements = `<li class="nav-item">`;
  var active;
  if (id && id == dataObj.id) {
    active = "active";
  }
  elements += `<a class="nav-link ${active}" id="${dataObj.id}" onclick="linkOpen(event, 'admin.html?request=resources');">`;
  elements += `<i class="far fa-circle nav-icon"></i>`;
  elements += `<p>${dataObj.title}</p>`;
  elements += `</a>`;
  elements += `</li>`;
  return elements;
}

function resourceRowComponent(dataObj) {
  // console.log(dataObj);
  var targetLink = publicLink + "index.html?request=";
  targetLink += dataObj.resource ? "lists&id=" : "collections&id=";
  targetLink += dataObj.id;
  var outputArray = [
    `<a class="" id="${dataObj.id}" onclick="linkOpen(event, 'admin.html?request=resources');" title="Detail">${dataObj.title}</a>`,
    `<a class="" onclick="window.open('${targetLink}', '_blank');" title="Public Link">Example<i class="fas fa-external-link-alt ml-2"></i></a>`,
  ],
    options = { title: "Assets", icon: "folder" },
    n = 2;
  // dataObj.options = '';
  // dataObj.options = dataObj.note ? dataObj.note : '';
  // dataObj.options = dataObj.description ? dataObj.description : dataObj.options;
  if (request == "settings") {
    outputArray[0] = dataObj.name;
    outputArray[1] = dataObj.note;
    outputArray[2] = dataObj.secret ? "TRUE" : "FALSE";
    dataObj.title = dataObj.name;
    n = 3;
    outputArray[n] = "";
  } else {
    // outputArray[1] = ;
    dataObj.target = "lists";
    if (id) {
      n = 3;
      outputArray[0] = dataObj.title;
      outputArray[2] = dataObj.type.name;
      options.title = "Uploads";
      options.icon = "upload";
      dataObj.target = "collections";
    }
    outputArray[
      n
    ] = `<a class="mr-2" id="${dataObj.id}" onclick="" title="RQCode"><i class="fas fa-qrcode text-info"></i></a>`;
    outputArray[
      n
    ] += `<a class="mr-2" onclick="window.open('https://drive.google.com/drive/u/0/folders/${dataObj.id}', '_blank');" title="${options.title}"><i class="fas fa-${options.icon} text-secondary"></i></a>`;
    if (dataObj.secret) {
      outputArray[
        n
      ] += `<a class="mr-2" data-id="${dataObj.id}" data-target="${dataObj.target}" onclick="ggDecode(event);" title="Decode"><i class="fas fa-hashtag"></i></a>`;
    } else {
      outputArray[1] = "";
    }
  }
  var targetFunction = 'Resource';
  if (id) {
    targetFunction = "Collection"
  }
  if (request == "settings") {
    targetFunction = "ResourceType";
  }
  outputArray[
    n
  ] += `<a class="mr-2" data-id="${dataObj.id}" data-title="${dataObj.title}" data-options="${dataObj.options}" onclick="edit${targetFunction}(event);" title="Edit"><i class="fas fa-edit text-success"></i></a>`;
  outputArray[
    n
  ] += `<a class="mr-2" data-id="${dataObj.id}" data-title="${dataObj.title}" onclick="delete${targetFunction}(event);" title="Trash"><i class="fas fa-trash text-danger"></i></a>`;
  //   outputArray.push();
  //   outputArray.push();
  //   outputArray.push();
  //   outputArray.push();
  //   outputArray.push();
  //   console.log(outputArray);
  //   return createRow(outputArray);
  //   console.log(outputArray[3]);
  var elements = `<tr>`;

  //   var columns = [
  //       `<a class="" id="${dataObj.id}" onclick="linkOpen(event, 'admin.html?request=resources');" title="Detail">${dataObj.title}</a>`,
  //       `<a class="" onclick="window.open('${targetLink}', '_blank');" title="Public Link">Example<i class="fas fa-external-link-alt ml-2"></i></a>`,
  //       "",
  //       `<a class="mr-2" id="${dataObj.id}" onclick="" title="RQCode"><i class="fas fa-qrcode text-info"></i></a>`,
  //     ],
  //     options = { title: "Assets", icon: "folder" };
  //   dataObj.target = "lists";
  //   if (id) {
  //     columns[0] = dataObj.title;
  //     columns[2] = `<td>${dataObj.type.name}</td>`;
  //     options.title = "Uploads";
  //     options.icon = "upload";
  //     dataObj.target = "collections";
  //   }
  //   columns[3] += `<a class="mr-2" onclick="window.open('https://drive.google.com/drive/u/0/folders/${dataObj.id}', '_blank');" title="${options.title}"><i class="fas fa-${options.icon} text-secondary"></i></a>`;
  //   if (dataObj.secret) {
  //     columns[3] += `<a class="mr-2" data-id="${dataObj.id}" data-target="${dataObj.target}" onclick="ggDecode(event);" title="Decode"><i class="fas fa-hashtag"></i></a>`;
  //   }
  //   // var
  //   columns[3] += `<a class="mr-2" data-id="${dataObj.id}" data-title="${dataObj.title}" onclick="editResource(event);" title="Edit"><i class="fas fa-edit text-success"></i></a>`;
  //   columns[3] += `<a class="mr-2" data-id="${dataObj.id}" data-title="${dataObj.title}" onclick="deleteResource(event);" title="Trash"><i class="fas fa-trash text-danger"></i></a>`;

  //   var elements = `<tr>`;
  //   // elements += `<td>${dataObj.title}</td>`;
  //   elements += `<td>${columns[0]}</td>`;
  //   elements += `<td>${columns[1]}</td>`;
  //   elements += columns[2];
  //   elements += `<td>${columns[3]}</td>`;
  elements += createRow(outputArray);
  //   outputArray.forEach((column) => {
  //     elements += column;
  //   });
  elements += `</tr>`;
  return elements;
}

function createRow(dataArray) {
  var output = "";
  dataArray.forEach((row) => {
    // console.log(row);
    output += `<td>${row}</td>`;
  });
  return output;
}

var htmlBody = $(".modal-body");
function newResource(e) {
  var htmlOutput = `<div class="mb-3">`;
  htmlOutput += `<label for="title" class="form-label">Resource Title</label>`;
  htmlOutput += `<input type="text" name="title" id="title" class="form-control" required>`;
  htmlOutput += `</div>`;
  htmlOutput += `<label for="secret">Secret Input</label>`;
  htmlOutput += `<div class="input-group">`;
  htmlOutput += `<input type="text" class="form-control" id="secret" name="secret" minlength="6" required>`;
  htmlOutput += `<span class="input-group-append">`;
  htmlOutput += `<button type="button" class="btn btn-info btn-flat" onclick="hashGenerate(event);">Auto Generate</button>`;
  htmlOutput += `</span>`;
  htmlOutput += `</div>`;
  htmlBody.html(htmlOutput);
  hashGenerate(e);
  $(".modal-content").addClass("form-new-resource");
  $(".modal-title").html("Form new resource");
  $("#modal-default").modal("show");
}

function editResource(e) {
  var data = { id: e.target.dataset.id, title: e.target.dataset.title };
  //   console.log(data);
  //   var htmlBody = $(".modal-body");
  var htmlOutput = `<div class="mb-3">`;
  htmlOutput += `<input type="hidden" name="id" value="${data.id}">`;
  htmlOutput += `<label for="title" class="form-label">Resource Title</label>`;
  htmlOutput += `<input type="text" name="title" value="${data.title}" class="form-control" required>`;
  htmlOutput += `</div>`;
  htmlOutput += `<label for="secret">Secret Input</label>`;
  htmlOutput += `<div class="input-group">`;
  htmlOutput += `<input type="text" class="form-control" id="secret" name="secret" minlength="6">`;
  htmlOutput += `<span class="input-group-append">`;
  htmlOutput += `<button type="button" class="btn btn-info btn-flat" onclick="hashGenerate(event);">Auto Generate</button>`;
  htmlOutput += `</span>`;
  htmlOutput += `</div>`;
  htmlBody.html(htmlOutput);
  $(".modal-content").addClass("form-edit-resource");
  $(".modal-title").html("Form edit resource");
  $("#modal-default").modal("show");
}

function deleteResource(e) {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      swalLoading("Processing");
      var targetLink =
        scriptLink + `?resource=delete&id=${e.target.dataset.id}`;
      var fetchDelete = await fetch(targetLink, { method: "POST" });
      //   console.log(targetLink);
      await fetchDelete.json().then((result) => {
        // console.log(result);
        if (result.message == "success") {
          Swal.hideLoading();
          swalLoading(
            "Deleted!",
            `Your resource '${e.target.dataset.title}' has been deleted.`,
            "success",
            3000,
            false
          ).then(() => {
            window.location.reload();
          });
        } else {
          swalMessage(
            "Something went wrong!",
            "Error: " + result.message,
            "error",
            "Try again"
          );
        }
      });
    }
  });
}

function newResourceType(e) {
  e.preventDefault();
  //   console.log(e.target.dataset);
  var htmlOutput = `<div class="mb-3">`;
  htmlOutput += `<label for="label" class="form-label">Resource Type Name</label>`;
  htmlOutput += `<input type="text" name="name" id="name" class="form-control" required>`;
  htmlOutput += `</div>`;
  htmlOutput += `<div class="mb-3">`;
  htmlOutput += `<label for="note" class="form-label">Resource Type Note</label>`;
  htmlOutput += `<textarea name="note" id="note" class="form-control"></textarea>`;
  htmlOutput += `</div>`;
  htmlBody.html(htmlOutput);

  $(".modal-content").addClass("form-new-resource-type");
  $(".modal-title").html("New resource type");
  $("#modal-default").modal("show");
}

function editResourceType(e) {
  var data = { id: e.target.dataset.id, title: e.target.dataset.title, options: e.target.dataset.options };
  //   console.log(data);
  //   var htmlBody = $(".modal-body");
  // var htmlOutput = `<div class="mb-3">`;
  // htmlOutput += `<input type="hidden" name="id" value="${data.id}">`;
  // htmlOutput += `<label for="title" class="form-label">Resource Title</label>`;
  // htmlOutput += `<input type="text" name="title" value="${data.title}" class="form-control">`;
  // htmlOutput += `</div>`;
  // htmlOutput += `<label for="secret">Secret Input</label>`;
  // htmlOutput += `<div class="input-group">`;
  // htmlOutput += `<input type="text" class="form-control" id="secret" name="secret" minlength="6">`;
  // htmlOutput += `<span class="input-group-append">`;
  // htmlOutput += `<button type="button" class="btn btn-info btn-flat" onclick="hashGenerate(event);">Auto Generate</button>`;
  // htmlOutput += `</span>`;
  // htmlOutput += `</div>`;
  // htmlBody.html(htmlOutput);

  var htmlOutput = `<div class="mb-3">`;
  htmlOutput += `<input type="hidden" name="id" value="${data.id}">`;
  htmlOutput += `<label for="label" class="form-label">Resource Type Name</label>`;
  htmlOutput += `<input type="text" name="name" value="${data.title}" class="form-control" required>`;
  htmlOutput += `</div>`;
  htmlOutput += `<div class="mb-3">`;
  htmlOutput += `<label for="note" class="form-label">Resource Type Note</label>`;
  htmlOutput += `<textarea name="note" id="note" class="form-control">${data.options}</textarea>`;
  htmlOutput += `</div>`;
  htmlBody.html(htmlOutput);

  $(".modal-content").addClass("form-edit-resource-type");
  $(".modal-title").html("Form edit resource type");
  $("#modal-default").modal("show");
}

function deleteResourceType(e) {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      swalLoading("Processing");
      var targetLink =
        scriptLink + `?resource=type-delete&id=${e.target.dataset.id}`;
      var fetchDelete = await fetch(targetLink, { method: "POST" });
      //   console.log(targetLink);
      await fetchDelete.json().then((result) => {
        // console.log(result);
        if (result.message == "success") {
          Swal.hideLoading();
          swalLoading(
            "Deleted!",
            `Your resource '${e.target.dataset.title}' has been deleted.`,
            "success",
            3000,
            false
          ).then(() => {
            window.location.reload();
          });
        } else {
          swalMessage(
            "Something went wrong!",
            "Error: " + result.message,
            "error",
            "Try again"
          );
        }
      });
    }
  });
}

function newCollection(e) {
  e.preventDefault();
  //   console.log(e.target.dataset);
  var htmlOutput = `<div class="mb-3">`;
  htmlOutput += `<input type="hidden" name="type" value="${e.target.dataset.typeId}">`;
  htmlOutput += `<label for="label" class="form-label">Collection Label</label>`;
  htmlOutput += `<input type="text" name="label" id="label" class="form-control" required>`;
  htmlOutput += `</div>`;
  htmlOutput += `<div class="mb-3">`;
  htmlOutput += `<label for="descriptions" class="form-label">Collection Descriptions</label>`;
  htmlOutput += `<textarea name="descriptions" id="descriptions" class="form-control"></textarea>`;
  htmlOutput += `</div>`;
  htmlBody.html(htmlOutput);
  var options = "";
  options += `<label for="secret">Secret Input</label>`;
  options += `<div class="input-group">`;
  options += `<input type="text" class="form-control" id="secret" name="secret" minlength="6" required>`;
  options += `<span class="input-group-append">`;
  options += `<button type="button" class="btn btn-info btn-flat" onclick="hashGenerate(event);">Auto Generate</button>`;
  options += `</span>`;
  options += `</div>`;
  htmlBody.append(options);
  if (e.target.dataset.secret == "true") {
    hashGenerate(e);
  }
  $(".modal-content").addClass("form-new-collection");
  $(".modal-title").html("New collection: " + e.target.dataset.typeName);
  $("#modal-default").modal("show");
}

function editCollection(e) {
  var data = { id: e.target.dataset.id, title: e.target.dataset.title, options: e.target.dataset.options };
  //   console.log(data);
  //   var htmlBody = $(".modal-body");
  // var htmlOutput = `<div class="mb-3">`;
  // htmlOutput += `<input type="hidden" name="id" value="${data.id}">`;
  // htmlOutput += `<label for="title" class="form-label">Resource Title</label>`;
  // htmlOutput += `<input type="text" name="title" value="${data.title}" class="form-control">`;
  // htmlOutput += `</div>`;
  // htmlOutput += `<label for="secret">Secret Input</label>`;
  // htmlOutput += `<div class="input-group">`;
  // htmlOutput += `<input type="text" class="form-control" id="secret" name="secret" minlength="6">`;
  // htmlOutput += `<span class="input-group-append">`;
  // htmlOutput += `<button type="button" class="btn btn-info btn-flat" onclick="hashGenerate(event);">Auto Generate</button>`;
  // htmlOutput += `</span>`;
  // htmlOutput += `</div>`;
  // htmlBody.html(htmlOutput);

  var htmlOutput = `<div class="mb-3">`;
  htmlOutput += `<input type="hidden" name="id" value="${data.id}">`;
  htmlOutput += `<input type="hidden" name="type" value="${e.target.dataset.typeId}">`;
  htmlOutput += `<label for="label" class="form-label">Collection Label</label>`;
  htmlOutput += `<input type="text" name="label" value="${data.title}" class="form-control" required>`;
  htmlOutput += `</div>`;
  htmlOutput += `<div class="mb-3">`;
  htmlOutput += `<label for="descriptions" class="form-label">Collection Descriptions</label>`;
  htmlOutput += `<textarea name="descriptions" id="descriptions" class="form-control">${data.options}</textarea>`;
  htmlOutput += `</div>`;
  htmlBody.html(htmlOutput);
  var options = "";
  options += `<label for="secret">Secret Input</label>`;
  options += `<div class="input-group">`;
  options += `<input type="text" class="form-control" id="secret" name="secret" minlength="6">`;
  options += `<span class="input-group-append">`;
  options += `<button type="button" class="btn btn-info btn-flat" onclick="hashGenerate(event);">Auto Generate</button>`;
  options += `</span>`;
  options += `</div>`;
  htmlBody.append(options);

  $(".modal-content").addClass("form-edit-collection");
  $(".modal-title").html("Form edit collection");
  $("#modal-default").modal("show");
}

function deleteCollection(e) {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      swalLoading("Processing");
      var targetLink =
        scriptLink + `?resource=collection-delete&id=${e.target.dataset.id}`;
      var fetchDelete = await fetch(targetLink, { method: "POST" });
      //   console.log(targetLink);
      await fetchDelete.json().then((result) => {
        // console.log(result);
        if (result.message == "success") {
          Swal.hideLoading();
          swalLoading(
            "Deleted!",
            `Your resource '${e.target.dataset.title}' has been deleted.`,
            "success",
            3000,
            false
          ).then(() => {
            window.location.reload();
          });
        } else {
          swalMessage(
            "Something went wrong!",
            "Error: " + result.message,
            "error",
            "Try again"
          );
        }
      });
    }
  });
}

function hashGenerate(e) {
  e.preventDefault();
  //   console.log(e.target);
  var length = 8,
    charset = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`,
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  $("input#secret").val(retVal);
  //   return retVal;
}

async function ggDecode(e) {
  e.preventDefault();
  var dataObj = { id: e.target.dataset.id, target: e.target.dataset.target };
  //   swalMessage("Deco")
  swalLoading("Decodeing");
  var dataLink =
    scriptLink + `?resource=decode&target=${dataObj.target}&id=${dataObj.id}`;
  //   console.log(dataLink);
  var data = await fetch(dataLink);
  await data.json().then((response) => {
    // swalMessage("Result", result.message);
    var icon = false,
      showCancelButton = true,
      showConfirmButton = true,
      confirmButtonText = "Copy";
    Swal.fire({
      title: "Result: " + response.message,
      icon,
      showCancelButton,
      showConfirmButton,
      confirmButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(response.message);
        swalLoading("Copied", false, "success", 1500, false);
      }
    });
    // console.log(result);
    // Swal.hideLoading();
    // console.log(result);
    // Swal.showValidationMessage(result.message);
  });
  //
  // console.log(dataObj);
}
