import dotenv from "dotenv";
import argon2 from "argon2";

import loginService from "../services/loginService.js";
import { sendError } from "../common.js";
import logger from "../services/logging.js";

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
        logger.warn(`Failed log on: ${req.ip} provided no username`);
        sendError(res, "no username");
        return;
    }
    if (!password) {
        logger.warn(`Failed log on: ${username}@${req.ip} provided no password`);
        sendError(res, "no password");
        return;
    }

    // Prevent DOS attack via long password
    if (password.length > 100) {
        logger.warn(`Failed log on: ${username}@${req.ip} provided a password of length ${password.length}`);
        sendError(res, "bad login");
        return;
    }

    // Get user's hash from db
    const info = await loginService.getAuthInfo(username);

    // If info in undefined, that user does not exist
    if (info === undefined) {
        logger.warn(`Failed log on: ${username}@${req.ip} does not exist`);
        sendError(res, "bad login");
        return;
    }

    const validPassword = await argon2.verify(info.password, password, {
        secret: Buffer.from(process.env.ARGONSECRET)
    });
    if (!validPassword) {
        logger.error(`Failed log on: ${username}@${req.ip} provided a bad password`);
        sendError(res, "bad login");
        return;
    }

    if (info.locked) {
        logger.error(`Failed log on: ${username}@${req.ip} tried to access a locked account`);
        sendError(res, "locked");
        return;
    }

    logger.info(`Successful log on: ${username}@${req.ip} logged on`);

    // Invalidate CSRF token
    // See https://security.stackexchange.com/a/22936
    req.session.csrftoken = undefined;

    // Associate username with session
    req.session.username = username;

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
        logger.warn(`Failed sign up: ${req.ip} provided no username`);
        sendError(res, userError);
        return;
    }

    let passError = validatePassword(password);
    if (passError !== null) {
        logger.warn(`Failed sign up: ${username}@${req.ip} provided an invalid password`);
        sendError(res, passError);
        return;
    }

    let codeError = validateAccessCode(accessCode);
    if (codeError !== null) {
        logger.error(`Failed sign up: ${username}@${req.ip} provided an invalid access code`);
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
        logger.error(`Failed sign up: ${username}@${req.ip} failed w/ ${error}`);
        sendError(res, error);
        return;
    } else {
        logger.info(`Successful sign up: ${username}@${req.ip} signed up`);
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