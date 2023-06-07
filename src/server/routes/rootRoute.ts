import express from "express";

import securityController from "../controllers/securityController.js";

const router = express.Router();
router.use("/noauth", express.static("../www/noauth"));
router.use(securityController.requireAuth);
router.use(express.static("../www"));

export { router };
export default router;