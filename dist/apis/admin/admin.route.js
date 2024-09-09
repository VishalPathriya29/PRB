"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import authRouter from './controller/auth/index';
const index_1 = __importDefault(require("./controller/membership/index"));
const resume_1 = __importDefault(require("./controller/resume"));
const setting_1 = __importDefault(require("./controller/setting"));
const adminRoute = (0, express_1.Router)();
// indexRoute.use('/auth', authRouter);
adminRoute.use('/membership', index_1.default);
adminRoute.use('/resume', resume_1.default);
adminRoute.use('/setting', setting_1.default);
exports.default = adminRoute;
