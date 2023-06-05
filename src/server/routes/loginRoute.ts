import express from "express";
import session from "express-session";

import loginController from "../controllers/loginController.js";

const router = express.Router();

// TODO: use "secure" in production for HTTPS only cookies
router.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,  // TODO: research this option more
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        //secure: true
    }
}));

router.get("/login", loginController.generateToken, loginController.loginGet);
router.post("/login", loginController.validateToken, loginController.loginPost);

router.get("/signup", loginController.generateToken, loginController.signupGet);
router.post("/signup", loginController.validateToken, loginController.signupPost);

export { router };
export default router;