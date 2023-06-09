import express from "express";
import dotenv from "dotenv";
import session from "express-session";

import loginRoutes from "./routes/loginRoute.js";
import editorRoutes from "./routes/editorRoute.js";
import rootRoutes from "./routes/rootRoute.js"
import error404 from "./routes/errorRoute.js";
import { detectMiddlewareError } from "./common.js";
import { logger, logHTTPRequest} from "./services/logging.js";

dotenv.config();

logger.info("Starting application");

const app = express();
app.set("view engine", "pug");

// Log HTTP requests
app.use(logHTTPRequest);

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
//app.use(detectMiddlewareError);
app.use(express.urlencoded({extended: true}));

// Temporary, just for testing
app.disable("view cache");

app.use("/editor", editorRoutes);
app.use("/", loginRoutes);
app.use("/", rootRoutes);
app.use(error404);

const port = 8080;
app.listen(port, () => {
    logger.info(`Listening on TCP ${port}`);
});