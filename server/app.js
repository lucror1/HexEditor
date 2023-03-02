import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
const hostname = "127.0.0.1";
const port = 8080;
const server = http.createServer((req, res) => {
    let filePath = "." + req.url;
    if (filePath == "./") {
        filePath = "./index.html";
    }
    let extName = path.extname(filePath);
    let contentType = "text/plain";
    switch (extName) {
        case ".html":
            contentType = "text/html";
            break;
        case ".js":
        case ".mjs":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".png":
            contentType = "image/png";
            break;
    }
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === "ENOENT") {
                fs.readFile("./404.html", function (error, content) {
                    res.writeHead(404, {
                        "Content-Type": "text/html"
                    });
                    res.end(content, "utf-8");
                });
            }
            else {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                res.end("500 Internal Server Error\n");
                res.end();
            }
        }
        else {
            res.writeHead(200, {
                "Content-Type": contentType
            });
            res.end(content, "utf-8");
        }
    });
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
//# sourceMappingURL=app.js.map