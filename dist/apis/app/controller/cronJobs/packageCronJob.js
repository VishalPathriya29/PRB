"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.packageExpireCronJob = void 0;
const db_1 = __importDefault(require("../../../../db"));
const utility = __importStar(require("../../../../helper/utility"));
const config_1 = __importDefault(require("../../../../config/config"));
// Package Expire Cron Job Handler
const packageExpireCronJob = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created_at = utility.dateWithFormat();
        const currentDate = yield utility.getTimeAndDate();
        const date = currentDate[0];
        const time = currentDate[1];
        const sql = `SELECT user_id FROM user_packages WHERE DATE_FORMAT(end_date, "%Y-%m-%d") = '${date}'`;
        const [rows] = yield db_1.default.query(sql);
        for (const iterator of rows) {
            const updateSql = `UPDATE user_packages SET package_slug = ?, package_status = ?, updated_at = ? WHERE id = ?`;
            const values = [null, config_1.default.PACKAGE_STATUS.INACTIVE, created_at, iterator.user_id];
            const [data] = yield db_1.default.query(updateSql, values);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.packageExpireCronJob = packageExpireCronJob;
