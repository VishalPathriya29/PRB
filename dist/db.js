"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
require("dotenv/config");
let dbConfig;
if (process.env.ENVIRONMENT === 'development') {
    dbConfig = {
        host: "localhost",
        user: "root",
        password: "",
        database: "todo_resume",
        // connectTimeout: 10000,
    };
}
else {
    dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        // port: 23621,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 10000,
    };
}
const pool = mysql2_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    // port: 23621,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // port: process.env.DB_PORT,
    // connectTimeout: 10000,
});
pool.getConnection((err, connection) => {
    if (err)
        throw err;
    console.log("Database connected successfully");
    connection.release();
});
exports.default = pool.promise();
