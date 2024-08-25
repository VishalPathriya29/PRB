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
exports.updateProfile = exports.profile = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
const utility = __importStar(require("../../../../helper/utility"));
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1`;
        const [rows] = yield db_1.default.query(sql, [userId]);
        if (rows.length > 0) {
            delete rows[0].password;
            delete rows[0].id;
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows[0]);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Profile not found");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.profile = profile;
// =======================================================================
// =======================================================================
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { name, phone, image } = req.body;
        const updatedAt = utility.utcDate();
        const updateSql = `UPDATE users SET name = ?, phone = ?, image = ? WHERE id = ?`;
        const VALUES = [name, phone, image, userId];
        const [data] = yield db_1.default.query(updateSql, VALUES);
        if (data.affectedRows > 0) {
            const userQuery = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL limit 1`;
            const [userData] = yield db_1.default.query(userQuery, [userId]);
            if (userData.length > 0) {
                delete userData[0].password;
                delete userData[0].id;
                return apiResponse.successResponse(res, "Profile Updated Successfully", userData[0]);
            }
            else {
                return apiResponse.errorMessage(res, 400, "User Not Updated, try again");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Profile, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.updateProfile = updateProfile;
// =======================================================================
// =======================================================================
