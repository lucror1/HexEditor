import crypto from "crypto";
import dotenv from "dotenv";

import { sendError } from "../common.js";
import logger from "../services/logging.js";

dotenv.config();

// Generate CSRF tokens on GET requests if one is not provided
function generateToken(req, res, next) {
    if (req.session.csrftoken === undefined) {
        logger.verbose(`CSRF token: ${req.ip} was issued a token`);
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
            logger.error(`CSRF token failed: ${req.ip} provided an invalid CSRF token`);
            error = true;
        }

    } else {
        logger.warn(`CSRF token failed: ${req.ip} did not provide a CSRF token`);
        error = true;
    }

    if (error) {
        // No token was provided, respond with an error
        sendError(res, "csrftoken");
    } else {
        logger.verbose(`CSRF token verified: ${req.ip} provided a valid token`);
        next();
    }
}

// Require that the user be authenticated, or else redirect to the login page
function requireAuth(req, res, next) {
    if (req.session.authenticated !== true) {
        logger.verbose(`Auth: unauthenticated ${req.ip} tried to access an authenticated route`);
        res.redirect("/login");
        return;
    }

    next();
}

// Require that a user not be authenticated, or else redirect to the root page
function requireNoAuth(req, res, next) {
    if (req.session.authenticated === true) {
        logger.silly(`Auth: authenticated ${req.session.username}@${req.ip} tried to access an unauthenticated route`);
        res.redirect("/");
        return;
    }

    next();
}

export { generateToken, validateToken, requireAuth, requireNoAuth };
export default { generateToken, validateToken, requireAuth, requireNoAuth };