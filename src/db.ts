import mysql from 'mysql2';
import 'dotenv/config';

let dbConfig;
if (process.env.ENVIRONMENT === 'development') {
    dbConfig = {
        host: "localhost",
        user: "root",
        password: "",
        database: "todo_resume",
        // connectTimeout: 10000,
    };
} else {
    dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        // port: 23621,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 10000,
    }
}
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    // port: 23621,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // port: process.env.DB_PORT,
    // connectTimeout: 10000,
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Database connected successfully");
    connection.release();
});

export default pool.promise();