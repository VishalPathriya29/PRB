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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.purchaseMembership = exports.membershipList = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
const utility = __importStar(require("../../../../helper/utility"));
const membershipList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT id, name, slug, details FROM membership_plans WHERE status = 1`;
        const [rows] = yield db_1.default.query(sql);
        const membershipList = `SELECT membership_plan_id, name, currency, price, duration FROM membership_prices WHERE status = 1`;
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
// Purchase Membership
const purchaseMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { membership_plan_id, payment_details } = req.body;
        const created_at = utility.utcDate();
        // const sql = `INSERT INTO user_memberships (membership_plan_id, user_id, transaction_id, payment_status, amount, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
        // await pool.query(sql, [membership_plan_id, user_id, transaction_id, payment_status, payment_response, created_at]);
        return apiResponse.successResponse(res, "Membership Purchased Successfully", []);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.purchaseMembership = purchaseMembership;
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
