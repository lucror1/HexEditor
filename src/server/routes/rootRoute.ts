import express from "express";

import rootController from "../controllers/rootController.js";
import securityController from "../controllers/securityController.js";

const router = express.Router();
router.use("/noauth", express.static("../www/noauth"));
router.use(
    // TODO: reenable authorization after development
    //securityController.requireAuth
    securityController.generateToken,
    rootController.getIndex,
    express.static("../www")
);

export { router };
export default router;