document.addEventListener("DOMContentLoaded", () => {
    let form = document.querySelector("form");

    let token = form.dataset.csrftoken;
    if (token === undefined) {
        alert("CSRF token is not defined");
        window.location.reload();
    }

    // Custom submission
    form.addEventListener("submit", (evt) => {
        evt.preventDefault();

        // Custom post data
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "X-CSRF-TOKEN": token
            },
            body: new FormData(form)
        }).then((data) => {
            console.log(data);
        });
    });
});