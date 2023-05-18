import mysql from "mysql";
import fs from "fs";
export { database };

const secrets = JSON.parse(fs.readFileSync("./secrets.json", "utf-8"));
const database = mysql.createConnection(secrets.db);