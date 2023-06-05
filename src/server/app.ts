import express from "express";
import dotenv from "dotenv";

import loginRoutes from "./routes/loginRoute.js";
import editorRoutes from "./routes/editorRoute.js";
import rootRoutes from "./routes/rootRoute.js"
import error404 from "./routes/errorRoute.js";

dotenv.config();

const app = express()
app.set("view engine", "pug");
app.use(express.urlencoded({extended: true}));

// Temporary, just for testing
app.disable("view cache");

app.use("/editor", editorRoutes);
app.use("/", loginRoutes);
app.use("/", rootRoutes);
app.use(error404);

const port = 8080;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});