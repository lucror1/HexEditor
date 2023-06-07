import dotenv from "dotenv";
import argon2 from "argon2";

import { connection } from "../services/database.js";
import { sendError } from "../common.js";

dotenv.config();

function loginGet(req, res) {
    // Check if already authenticated
    if (req.session.authenticated) {
        res.redirect("/");
        return;
    }

    res.render("login", {
        csrftoken: req.session.csrftoken
    });
}

async function loginPost(req, res) {
    // Verify presence of username and password
    const username = req.body.username;
    const password = req.body.password;
    if (username === undefined || password === undefined) {
        sendError(res, "no username")
        return;
    }
    if (password === undefined) {
        sendError(res, "no password");
        return;
    }

    // Prevent DOS attack via long password
    if (password.length > 100) {
        sendError(res, "bad login");
        return;
    }

    // Get user's hash from db
    const info = await connection.getAuthInfo(username);

    // If info in undefined, that user does not exist
    if (info === undefined) {
        sendError(res, "bad login");
        return;
    }

    const validPassword = await argon2.verify(info.password, password, {
        secret: Buffer.from(process.env.ARGONSECRET)
    });
    if (!validPassword) {
        sendError(res, "bad login");
        return;
    }

    if (info.locked) {
        sendError(res, "locked");
        return;
    }

    // Invalidate CSRF token
    // See https://security.stackexchange.com/a/22936
    req.session.csrftoken = undefined;

    // Mark session as authenticated
    req.session.authenticated = true;

    res.send({
        error: false
    });
}

function signupGet(req, res) {
    // Check if already authenticated
    if (req.session.authenticated) {
        res.redirect("/");
        return;
    }

    res.render("signup", {
        csrftoken: req.session.csrftoken
    });
}

async function signupPost(req, res) {
    // Verify presence of username and password
    const username = req.body.username;
    const password = req.body.password;
    
    // Validate username and password
    let userError = validateUsername(username);
    if (userError !== null) {
        sendError(res, userError);
        return;
    }

    let passError = validatePassword(password);
    if (passError !== null) {
        sendError(res, passError);
        return;
    }

    // Compute hash of password w/ pepper
    const hash = await argon2.hash(password, {
        secret: Buffer.from(process.env.ARGONSECRET)
    });

    // Add user to database
    /* connection.query("INSERT INTO User (username, password) VALUES (?, ?);", [username, hash],
        function(error, results, fields) {
            if (!error) {
                res.send({
                    error: false
                });
            } else {
                detectSQLError(res, error);
            }
        }
    ); */
    const error = await connection.addUser(username, hash);
    if (error != null) {
        sendError(res, error);
        return;
    } else {
        res.send({
            error: false
        });
    }
}

function validateUsername(username: string): string {
    if (username.length < 1) {
        return "short username";
    }
    if (username.length > 25) {
        return "long username";
    }

    return null;
}

function validatePassword(password: string): string {
    if (password === undefined) {
        return "no password";
    }

    if (password.length < 12) {
        return "short password";
    }

    if (password.length > 100) {
        return "long password";
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        return "bad password";
    }

    return null;
}

export { loginGet, loginPost, signupGet, signupPost };
export default { loginGet, loginPost, signupGet, signupPost };