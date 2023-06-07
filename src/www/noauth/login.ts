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
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": token
            },
            body: JSON.stringify({
                username: form.username.value,
                password: form.password.value
            })
        }).then((res) => {
            res.json().then((data) => {
                if (data.error) {
                    switch(data.type) {
                        case "no username":
                            alert("Please provide a username.");
                            break;
                        case "no password":
                            alert("Please provide a passsword.");
                            break;
                        case "bad login":
                            alert("Incorrect username or password.");
                            break;
                        case "locked":
                            alert("Your account has been locked.");
                            break;
                        default:
                            alert("An unknown error has occurred. Please try again.");
                            break;
                    }
                } else {
                    alert("Log in successful. Redirecting...");
                    window.location.replace(`${window.location.origin}`);
                }
            });
        });
    });
});