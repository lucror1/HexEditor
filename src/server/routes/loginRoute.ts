import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send({
        endpoint: "login",
        status: "okay"
    });
});

export { router };
export default router;