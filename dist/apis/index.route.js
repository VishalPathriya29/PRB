"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_route_1 = __importDefault(require("./admin/admin.route"));
const app_route_1 = __importDefault(require("./app/app.route"));
const indexRoute = (0, express_1.Router)();
indexRoute.use('/admin/v1', admin_route_1.default);
indexRoute.use('/v1', app_route_1.default);
exports.default = indexRoute;
