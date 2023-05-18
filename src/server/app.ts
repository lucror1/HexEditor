import express from "express";
import { app } from "./routes.js";
import { database } from "./database.js";

const port = 8080;

database.connect((err) => {
    if (err) {
        console.log("error");
        throw err;
    }
    console.log("Connected!");
    database.query("SHOW TABLES;", (err, result, fields) => {
        if (err) {
            throw err;
        }
        console.log(result);
    });
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});