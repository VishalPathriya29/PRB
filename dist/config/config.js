"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    smtp: {
        name: "",
        host: "", //process.env.SMTP_HOST, 
        secure: true, //true
        port: 465, //process.env.SMTP_PORT,//465
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
    PACKAGE_STATUS: {
        ACTIVE: "active",
        INACTIVE: "inactive",
        DELETED: "deleted",
        PACKAGESLUG: "pro"
    },
    DOWNLOAD_TYPE: {
        DOCUMENT: "document",
        PDF: "pdf",
        TEXT: "text",
    },
    RAZORPAY_DETAIL: {
        STATUS: {
            // created, authorized, captured, refunded, failed
            AUTHORIZED: "authorized",
            CAPTURED: "captured",
            REFUNDED: "refunded",
            FAILED: "failed",
            CREATED: "created"
        }
    },
    PAYMENT_STATUS: {
        PAID: "paid",
        PENDING: "pending",
        FAILED: "failed",
        REFUNDED: "refunded",
        CANCELLED: "cancelled",
    },
};
