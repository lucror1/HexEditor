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
                password: form.password.value
            })
        }).then((res) => {
            res.json().then((data) => {
                if (data.error) {
                    // TODO: handle errors
                    console.log(data);
                } else {
                    alert("Sign up successful. Redirecting...");
                    window.location.replace(`${window.location.origin}/login`);
                }
            });
        });
    });
});