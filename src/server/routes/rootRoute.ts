import express from "express";

const router = express.Router();
router.use(express.static("../www"));

export { router };
export default router;