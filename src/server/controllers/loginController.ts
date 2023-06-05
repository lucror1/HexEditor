import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config()

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
        res.send({
            error: true,
            type: "csrftoken"
        });
    } else {
        next();
    }
}

function loginGet(req, res) {
    res.render("login", {
        csrftoken: req.session.csrftoken
    });
}

function loginPost(req, res) {
    // Invalidate CSRF token on login attempt to prevent session fixation
    req.session.csrftoken = undefined;
    res.send({
        error: false,
        body: "hi"
    });
}

function signupGet(req, res) {
    res.render("signup", {
        csrftoken: req.session.csrftoken
    });
}

function signupPost(req, res) {
    res.send({
        error: "Signing up is not yet supported."
    });
}

export { generateToken, validateToken, loginGet, loginPost, signupGet, signupPost };
export default { generateToken, validateToken, loginGet, loginPost, signupGet, signupPost };