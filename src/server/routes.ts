import express from "express";
export { app };

const app = express();

app.use(express.static("../www"));

app.get("/api", (req, res) => {
    res.send("Hello world!");
});