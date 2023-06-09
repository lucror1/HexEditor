import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "./logging.js";

dotenv.config();

const connection = await mysql.createConnection({
    host: process.env.DBHOST,
    socketPath: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});

function detectSQLError(error): string {
    switch (error.code) {
        case "ER_DUP_ENTRY":
            return "nonunique username";
        case "ER_DATA_TOO_LONG":
            return "long username";
        case "PROTOCOL_CONNECTION_LOST":
            logger.error("Connection with the database was lost");
            return "no database";
        default:
            logger.error(error.toString());
            return "unknown";
    }
}

export { connection, detectSQLError };
export default { connection, detectSQLError };