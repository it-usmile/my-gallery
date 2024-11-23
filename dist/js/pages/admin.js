var ssuid = localStorage.getItem("ssuid");
var contentResources = $(".content-resources");
var targetTable = 1;
var targetTableOptions = {
    "responsive": true, "autoWidth": false,
};
// var buttonArray = ["copy", "csv", "excel", "pdf", "print"];
targetTableOptions.columnDefs = [{ targets: [1, 2], searchable: false, orderable: false }];

// navTreeView.html('');

if (id) {
    contentResources = $(".content-collections");
    targetTable = 2;
    // targetTableOptions.order = [[2, 'asc']];
    // targetTableOptions.buttons = ["copy", "csv", "excel", "pdf", "print"];
    // targetTableOptions.buttons = new Array();
    // buttonArray.forEach((val, key) => {
    //     targetTableOptions.buttons.push({ extend: val, exportOptions: { columns: ':visible' } })
    // })
    targetTableOptions.columnDefs.push({ targets: 2, visible: false });
    targetTableOptions.columnDefs.push({ targets: 3, searchable: false, orderable: false });
    // targetTableOptions.lengthChange = false;
    targetTableOptions.rowGroup = {
        dataSrc: (row) => {
            let base = row[2] == 'true' ? 'group secret' : 'group resource';
            return base.toUpperCase();
        }
    };
}

pageLoad().then(async (response) => {
    // hidePreloader();
    var icon = 'success';
    var title = 'Your resources has been loaded';
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
        $("#example" + targetTable.toString()).DataTable(targetTableOptions).buttons().container().appendTo('#example' + targetTable.toString() + '_wrapper .col-md-6:eq(0)');
        // $("#example").addClass("nowrap");
    }
    Swal.fire({
        icon,
        title,
        showConfirmButton: false,
        timer: 1500,
    });
})

$("a.btn-logout").on('click', (e) => {
    e.preventDefault();
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, destroy session!"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("ssuid");
            Swal.fire({
                title: "Successfully",
                text: "Your session has been destroyed.",
                icon: "success"
            }).then(() => {
                swalLoading("Redirecting");
                window.location.reload();
            });
        }
    });
    // // console.log(e.target);
})

$("form#authen").on('submit', async (e) => {
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
        swalLoading("Your session is accessed", false, "success", 2000, false).then(function () {
            // Swal.hideLoading();
            swalLoading("Redirecting");
            window.location.reload();
        })
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
        mainAuthen.addClass('d-none');
        // // console.log(ssuid)
        var targetResource, navLink, message;
        switch (request) {
            case 'collections':
                targetResource = request;
                break;
            case 'resources':
                // nav-link-dropdown
                // $("a#" + id).addClass("active");
                $(".nav-item-dropdown").addClass('menu-is-opening menu-open');
                // message = "Collection";
                navLink = "dropdown";
                targetResource = "members"
            // break;
            default:
                message = message ? message : "Dashboard";
                navLink = navLink ? navLink : "index";
                targetResource = targetResource ? targetResource : "lists"
        }

        var resourceLists = await fetch(scriptLink + `?resource=lists`);
        var resourceRow = await resourceLists.json();
        resourceRow.forEach((row) => {
            // // console.log(row);
            if (row.id == id) {
                message = row.title;
            }
            navTreeView.append(navItemComponent(row));
        })
        contentHeader.html(`<h1>${message}</h1>`);

        hidePreloader();
        var targetLink = scriptLink + `?resource=` + targetResource;
        targetLink += targetResource == "members" ? '&src=' : '&id=';
        targetLink += id ? id : '';
        // //
        // console.log(targetLink);
        // //
        var target = await fetch(targetLink);
        await target.json().then((data) => {
            // //
            // console.log(data)
            // //
            if (data.length > 0) {
                data.forEach((val) => {
                    // // console.log(val);
                    // var tableBodyResources = $(".table-body-resources");
                    var tableBodyResources = $(".table-body-resources");
                    if (id) {
                        tableBodyResources = $(".table-body-collections");
                    }
                    if (val.row) {

                        // console.log(val);
                        val.row.forEach((row) => {
                            var dataObj = { id: row.info.id, title: row.info.label };
                            dataObj.secret = row.secret;
                            // console.log(row);
                            // dataArray.push(dataObj);
                            tableBodyResources.append(resourceRowComponent(dataObj));
                        })
                    } else {
                        // // console.log(val);
                        tableBodyResources.append(resourceRowComponent(val));
                    }
                    // // console.log(dataObj);
                    // if (dataArray.length > 0) {
                    //     dataArray.forEach((row) => {
                    //         tableBodyResources.append(resourceRowComponent(row));
                    //     })
                    // } else {
                    //     tableBodyResources.append(resourceRowComponent(dataObj));
                    // }
                    // navTreeView.append(navItemComponent(val));
                })
            }
            // // console.log(dataArray)
            // response.data = data;
        }).then(() => {
            contentResources.removeClass("d-none");
        })

        // contentHeader.html(`<h1>${message}</h1>`);
        $(`.nav-link-${navLink}`).addClass('active');
    }
    return response;
}


function navItemComponent(dataObj) {
    var elements = `<li class="nav-item">`;
    var active;
    if (id && id == dataObj.id) {
        active = 'active';
    }
    elements += `<a class="nav-link ${active}" id="${dataObj.id}" onclick="linkOpen(event, 'admin.html?request=resources');">`;
    elements += `<i class="far fa-circle nav-icon"></i>`;
    elements += `<p>${dataObj.title}</p>`;
    elements += `</a>`;
    elements += `</li>`;
    return elements;
}

function resourceRowComponent(dataObj) {
    var targetLink = publicLink + 'index.html?request=';
    targetLink += dataObj.resource ? 'lists&id=' : 'collections&id=';
    targetLink += dataObj.id;
    var elements = `<tr>`;
    // elements += `<td>${dataObj.title}</td>`;
    if (!id) {
        elements += `<td>`;
        elements += `<a class="mr-2" id="${dataObj.id}" onclick="linkOpen(event, 'admin.html?request=resources');" title="Detail">${dataObj.title}</a>`;
        elements += `</td>`;
        // 
    } else {
        elements += `<td>${dataObj.title}</td>`;
    }
    elements += `<td>`;
    elements += `<a class="" onclick="window.open('${targetLink}', '_blank');" title="Public Link">Example<i class="fas fa-external-link-alt ml-2"></i></a>`;
    elements += `</td>`;
    if (id) {
        elements += `<td>${dataObj.secret}</td>`;
    }
    elements += `<td>`;
    elements += `<a class="mr-2" id="${dataObj.id}" onclick="" title="RQCode"><i class="fas fa-qrcode"></i></a>`;
    if (id) {
        elements += `<a class="mr-2" id="${dataObj.id}" onclick="window.open('https://drive.google.com/drive/u/0/folders/${dataObj.id}', '_blank');" title="Uploads"><i class="fas fa-upload"></i></a>`;
    }
    elements += `<a class="mr-2" id="${dataObj.id}" onclick="" title="Trash"><i class="fas fa-trash text-danger"></i></a>`;
    elements += `</td>`;
    elements += `</tr>`;
    return elements;
}