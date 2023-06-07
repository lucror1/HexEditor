import express from "express";
import dotenv from "dotenv";
import session from "express-session";

import loginRoutes from "./routes/loginRoute.js";
import editorRoutes from "./routes/editorRoute.js";
import rootRoutes from "./routes/rootRoute.js"
import error404 from "./routes/errorRoute.js";

dotenv.config();

const app = express();
app.set("view engine", "pug");

// TODO: use "secure" in production for HTTPS only cookies
app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,  // TODO: research this option more
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        //secure: true
    }
}));
app.use(express.json());
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