import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send({
        endpoint: "editor",
        status: "okay"
    });
});

export { router };
export default router;