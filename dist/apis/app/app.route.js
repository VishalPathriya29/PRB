"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("./controller/auth/index"));
const users_1 = __importDefault(require("./controller/users"));
const membership_1 = __importDefault(require("./controller/membership"));
const resume_1 = __importDefault(require("./controller/resume"));
const setting_1 = __importDefault(require("./controller/setting"));
const appRoute = (0, express_1.Router)();
appRoute.use('/auth', index_1.default);
appRoute.use('/users', users_1.default);
appRoute.use('/membership', membership_1.default);
appRoute.use('/resume', resume_1.default);
appRoute.use('/setting', setting_1.default);
exports.default = appRoute;
