import express from "express";

import securityController from "../controllers/securityController.js";
import loginController from "../controllers/loginController.js";

const router = express.Router();

router.get("/login", securityController.requireNoAuth, securityController.generateToken,
    loginController.loginGet);
router.post("/login", securityController.validateToken, loginController.loginPost);

router.get("/signup", securityController.requireNoAuth, securityController.generateToken,
    loginController.signupGet);
router.post("/signup", securityController.validateToken, loginController.signupPost);

export { router };
export default router;