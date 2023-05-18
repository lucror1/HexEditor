import express from "express";
//import router from "./routes/api.js";
import rootRoutes from "./routes/rootRoute.js"
import loginRoutes from "./routes/loginRoute.js";
import editorRoutes from "./routes/editorRoute.js";

const app = express()

app.use("/", rootRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/editor", editorRoutes);

const port = 8080;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});