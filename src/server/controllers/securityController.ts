import crypto from "crypto";
import dotenv from "dotenv";

import { sendError } from "../common.js";

dotenv.config();

// Generate CSRF tokens on GET requests if one is not provided
function generateToken(req, res, next) {
    if (req.session.csrftoken === undefined) {
        req.session.csrftoken = crypto.randomBytes(Number.parseInt(process.env.CSRFTOKENLENGTH))
            .toString("base64");
    }

    next();
}

// Validate CSRF tokens on POST requests
function validateToken(req, res, next) {
    let error = false;

    if (req.session.csrftoken) {
        let headerToken = req.get("X-CSRF-TOKEN");
        if (headerToken !== req.session.csrftoken) {
            error = true;
        }

    } else {
        error = true;
    }

    if (error) {
        // No token was provided, respond with an error
        sendError(res, "csrftoken");
    } else {
        next();
    }
}

// Require that the user be authenticated, or else redirect to the login page
function requireAuth(req, res, next) {
    if (req.session.authenticated !== true) {
        res.redirect("/login");
        return;
    }

    next();
}

// Require that a user not be authenticated, or else redirect to the root page
function requireNoAuth(req, res, next) {
    if (req.session.authenticated === true) {
        console.log(req.url);
        console.log(req.session);
        res.redirect("/");
        return;
    }

    next();
}

export { generateToken, validateToken, requireAuth, requireNoAuth };
export default { generateToken, validateToken, requireAuth, requireNoAuth };