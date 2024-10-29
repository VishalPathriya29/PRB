"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatingToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const secretKey = process.env.SECRET;
function authenticatingToken(req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders === null || authHeaders === void 0 ? void 0 : authHeaders.split(" ")[1];
    if (token === null || token === undefined) {
        return res.status(401).json({
            status: false,
            data: null,
            message: "Unauthorized access!",
        });
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, user) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: false,
                data: null,
                message: "Unauthorized access!",
            });
        }
        res.locals.jwt = user;
        next();
    }));
}
exports.authenticatingToken = authenticatingToken;
