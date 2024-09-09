"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiterUsingThirdParty = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.rateLimiterUsingThirdParty = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute in milliseconds
    max: 1000,
    message: 'Please try again later, To many request',
    headers: true,
});
// ====================================================================================================
// ====================================================================================================
