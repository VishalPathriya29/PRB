"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const index_route_1 = __importDefault(require("./controller/index.route"));
const rateLimiter_1 = require("./middleware/rateLimiter");
exports.default = (app) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
    app.use((0, cors_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)());
    // app.use(morgan('dev'));
    app.use((0, morgan_1.default)('common', {
        stream: fs_1.default.createWriteStream(__dirname + '/access.log', { flags: 'a' })
    }));
    app.use('/api/v1', rateLimiter_1.rateLimiterUsingThirdParty, index_route_1.default);
    app.use('*', (req, res) => {
        res.status(404).json({ message: 'Resource not available' });
    });
    app.use((err, req, res, next) => {
        if (err) {
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: err
            });
        }
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({
            status: false,
            data: null,
            error: "Unexpected Error Occurred. Please contact our support team."
        });
    });
};
