import mysql from "mysql";
import fs from "fs";

const secrets = JSON.parse(fs.readFileSync("./secrets.json", "utf-8"));
const database = mysql.createConnection(secrets.db);

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

export { database };
export default database;