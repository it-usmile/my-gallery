var ssuid = localStorage.getItem("ssuid");
var contentResources = $(".content-resources");

pageLoad().then(async (response) => {
    hidePreloader();
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
        mainAuthen.addClass('d-none');
        $("#example").DataTable({
            "responsive": true, "autoWidth": false,
        }).buttons().container().appendTo('#example_wrapper .col-md-6:eq(0)');
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
    var response = { auth: true };
    // response.resource = new Array();
    if (!ssuid) {
        response.auth = false;

        return response;
    } else {

        // // console.log(ssuid)
        var targetResource, navLink, message;
        switch (request) {
            case 'collections':
                targetResource = request;
                break;
            case 'resources':
                // nav-link-dropdown
                $("a#" + id).addClass("active");
                $(".nav-item-dropdown").addClass('menu-is-opening menu-open');
                message = "Collection";
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
                message += ` ${row.title}`;
            }
            navTreeView.append(navItemComponent(row));
        })


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
                    var tableBodyResources = $(".table-body-resources");
                    if (val.row) {

                        val.row.forEach((row) => {
                            // console.log(row);
                            var dataObj = { id: row.info.id, title: row.info.label };
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

        contentHeader.html(`<h1>${message}</h1>`);
        $(`.nav-link-${navLink}`).addClass('active');
    }
    return response;
}


function navItemComponent(dataObj) {
    var elements = `<li class="nav-item">`;
    elements += `<a class="nav-link" id="${dataObj.id}" onclick="linkOpen(event, 'admin.html?request=resources');">`;
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
    elements += `<td>${dataObj.title}</td>`;
    elements += `<td>`;
    elements += `<a class="" onclick="window.open('${targetLink}', '_blank');" title="Public Link">Example<i class="fas fa-external-link-alt ml-2"></i></a>`;
    elements += `</td>`;
    elements += `<td>`;
    elements += `<a class="mr-2" id="${dataObj.id}" onclick="linkOpen(event, 'admin.html?request=resources');"><i class="fas fa-search"></i></a>`;
    elements += `</td>`;
    elements += `</tr>`;
    return elements;
}