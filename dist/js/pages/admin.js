var ssuid = localStorage.getItem("ssuid");
// var mainHeader = $(".main-header");
var mainSidebar = $(".main-sidebar");
var mainAuthen = $(".main-authen");
var contentWrapper = $(".content-wrapper");
var mainFooter = $(".main-footer");

pageLoad().then((response) => {
    console.log(response);
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
    // console.log(e.target);
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
    console.log(result);
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
    } else {
        var targetResource;
        switch (request) {
            case 'collections':
                targetResource = request;
                break;
            case 'resources':
            default:
                targetResource = "lists"
        }
        var targetLink = scriptLink + `?resource=` + targetResource;
        targetLink = id ? `&id=` + id : targetLink;
        var target = await fetch(targetLink);
        await target.json().then((data) => {
            // console.log(data)
            response = data;
        })
    }
    return response;
}