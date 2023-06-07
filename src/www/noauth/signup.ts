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

        // Check if passwords match
        let password = (document.querySelector("#password") as HTMLInputElement).value;
        let password2 = (document.querySelector("#password2") as HTMLInputElement).value;
        if (password !== password2) {
            alert("The passwords don't match.");
            return;
        }

        // Check the password requirements
        if (!/[a-z]/.test(password)) {
            alert("Your password must have a lowercase letter.");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            alert("Your password must have an uppercase letter.");
            return;
        }

        // Custom post data
        fetch("/signup", {
            method: "POST",
            mode: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": token
            },
            body: JSON.stringify({
                username: form.username.value,
                password: form.password.value,
                accessCode: form.accessCode.value
            })
        }).then((res) => {
            res.json().then((data) => {
                if (data.error) {
                    switch(data.type) {
                        case "short username":
                            alert("Your username is too short.");
                            break;
                        case "long username":
                            alert("Your username is too long.");
                            break;
                        case "short password":
                            alert("Your password is too short.");
                            break;
                        case "long password":
                            alert("Your password is too long.");
                            break;
                        case "bad password":
                            alert("Your password does not meet the requirements.");
                            break;
                        case "bad code":
                            alert("The access code you provided is incorrect.");
                            break;
                    }
                } else {
                    alert("Sign up successful. Redirecting...");
                    window.location.replace(`${window.location.origin}/login`);
                }
            });
        });
    });
});