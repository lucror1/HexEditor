import { connection, detectSQLError } from "./database.js";

async function addUser(username: string, hash: string) {
    try {
        const [rows, fields] = await connection.execute(
            "INSERT INTO User (username, password) VALUES (?, ?);", [username, hash]
        );
        return null;
    } catch(error) {
        return detectSQLError(error);
    }
}

async function getAuthInfo(username: string) {     
    const [rows, fields] = await connection.execute(
        "SELECT password, locked FROM User WHERE username=? LIMIT 1;", [username]
    );
    return rows[0];
}

export { addUser, getAuthInfo };
export default { addUser, getAuthInfo };