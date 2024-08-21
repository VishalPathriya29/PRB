"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    smtp: {
        name: "",
        host: "",
        secure: true,
        port: 465,
        secureConnection: false,
        // requireTLS: true,
        auth: {
            user: process.env.DB_HOST,
            pass: process.env.SMTP_PASSWORD,
        },
        // tls: {
        //     // ciphers:'SSLv3',
        //     rejectUnauthorized: false
        // }
    },
};
