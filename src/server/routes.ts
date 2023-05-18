import express from "express";
export { app };

const app = express();

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.get("/status", (req, res) => {
    res.send({
        status: "working"
    });
});