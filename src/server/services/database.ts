import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const database = mysql.createConnection({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});

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