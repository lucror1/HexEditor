import dotenv from "dotenv";
import argon2 from "argon2";

import loginService from "../services/loginService.js";
import { sendError } from "../common.js";

dotenv.config();

function loginGet(req, res) {
    res.render("login", {
        csrftoken: req.session.csrftoken
    });
}

async function loginPost(req, res) {
    // Verify presence of username and password
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        sendError(res, "no username")
        return;
    }
    if (!password) {
        sendError(res, "no password");
        return;
    }

    // Prevent DOS attack via long password
    if (password.length > 100) {
        sendError(res, "bad login");
        return;
    }

    // Get user's hash from db
    const info = await loginService.getAuthInfo(username);

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
    res.render("signup", {
        csrftoken: req.session.csrftoken
    });
}

async function signupPost(req, res) {
    // Verify presence of username, password, and access code
    const username = req.body.username;
    const password = req.body.password;
    const accessCode = req.body.accessCode;
    
    // Validate username, password, and access code
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

    let codeError = validateAccessCode(accessCode);
    if (codeError !== null) {
        sendError(res, codeError);
        return;
    }

    // Compute hash of password w/ pepper
    const hash = await argon2.hash(password, {
        secret: Buffer.from(process.env.ARGONSECRET)
    });

    // Add user to database
    const error = await loginService.addUser(username, hash);
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

// Prevent people from signing up without knowing the code
function validateAccessCode(accessCode: string): string {
    if (accessCode !== process.env.ACCESSCODE) {
        return "bad code";
    }
    return null;
}

export { loginGet, loginPost, signupGet, signupPost };
export default { loginGet, loginPost, signupGet, signupPost };