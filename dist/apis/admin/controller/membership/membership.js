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
exports.membershipList = exports.addMembership = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
const utility_1 = require("../../../../helper/utility");
const addMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, details, prices } = req.body;
        const createdAt = (0, utility_1.utcDate)();
        const packageDetails = details.toString();
        const checkMembership = `SELECT * FROM membership_plans WHERE slug = ?`;
        const [membership] = yield db_1.default.query(checkMembership, [slug]);
        if (membership.length > 0)
            return apiResponse.errorMessage(res, 400, "Membership Already Exist With This Slug");
        const sql = `INSERT INTO membership_plans (name, slug, details, created_at) VALUES (?, ?, ?, ?)`;
        const VALUES = [name, slug, packageDetails, createdAt];
        const [data] = yield db_1.default.query(sql, VALUES);
        if (data.affectedRows > 0) {
            const membershipId = data.insertId;
            const priceSql = `INSERT INTO membership_prices (membership_plan_id, name, currency, price, duration, created_at) VALUES ?`;
            const priceValues = prices.map((price) => [membershipId, price.price_name, price.currency, price.price, price.duration, createdAt]);
            yield db_1.default.query(priceSql, [priceValues]);
            return apiResponse.successResponse(res, "Membership Added Successfully", {});
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Add Membership, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.addMembership = addMembership;
// =======================================================================
// =======================================================================
const membershipList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM membership_plans`;
        const [rows] = yield db_1.default.query(sql);
        const membershipList = `SELECT * FROM membership_prices`;
        const [prices] = yield db_1.default.query(membershipList);
        let index = -1;
        for (const iterator of rows) {
            index++;
            rows[index].details = iterator.details.split(',');
            const priceList = prices.filter((price) => price.membership_plan_id === iterator.id);
            rows[index].prices = priceList;
        }
        ;
        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Membership List", rows);
        }
        else {
            return apiResponse.successResponse(res, "No Membership Found", []);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.membershipList = membershipList;
// =======================================================================
// =======================================================================
