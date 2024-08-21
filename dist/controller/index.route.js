"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("./auth/index"));
const users_1 = __importDefault(require("./users"));
const indexRoute = (0, express_1.Router)();
indexRoute.use('/auth', index_1.default);
indexRoute.use('/users', users_1.default);
exports.default = indexRoute;
