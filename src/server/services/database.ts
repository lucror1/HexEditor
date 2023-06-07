import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

class Connection {
    #connection: mysql.Connection;

    constructor() {
        mysql.createConnection({
            host: process.env.DBHOST,
            socketPath: process.env.DBPORT,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBDATABASE
        }).then(connection => {
            this.#connection = connection;
        });
    }

    // Can theoretically get called before connection is initialized, hopefully not an issue
    async getAuthInfo(username: string) {     
        const [rows, fields] = await this.#connection.execute(
            "SELECT password, locked FROM User WHERE username=? LIMIT 1;", [username]
        );
        return rows[0];
    }

    async addUser(username: string, hash: string) {
        try {
            const [rows, fields] = await this.#connection.execute(
                "INSERT INTO User (username, password) VALUES (?, ?);", [username, hash]
            );
            console.log(rows, fields);
            return null;
        } catch(error) {
            console.log(error);
            return this.#detectSQLError(error);
        }
    }

    #detectSQLError(error): string {
        switch (error.code) {
            case "ER_DUP_ENTRY":
                return "nonunique username";
            case "ER_DATA_TOO_LONG":
                return "long username";
            case "PROTOCOL_CONNECTION_LOST":
                return "no database";
            default:
                console.log(error);
                return "unknown";
        }
    }
}

const connection = new Connection();

export { connection };
export default connection;