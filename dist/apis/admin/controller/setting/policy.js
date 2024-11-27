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
exports.updatePolicy = exports.policyList = exports.addPolicy = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
const addPolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, content, url } = req.body;
        const checkPolicy = `SELECT id FROM policies WHERE slug = ?`;
        const [policy] = yield db_1.default.query(checkPolicy, [slug]);
        if (policy.length > 0)
            return apiResponse.errorMessage(res, 400, "Policy Already Exist With This Slug");
        const sql = `INSERT INTO policies (name, slug, content, url) VALUES (?, ?, ?, ?)`;
        const VALUES = [name, slug, content, url];
        yield db_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Policy Added Successfully", {});
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.addPolicy = addPolicy;
// =======================================================================
// =======================================================================
const policyList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM policies`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Policy List", rows);
        }
        else {
            return apiResponse.successResponse(res, "No Policy Found", []);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.policyList = policyList;
// =======================================================================
// =======================================================================
const updatePolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { policy_id, name, slug, content, url, status } = req.body;
        const checkPolicy = `SELECT id, slug FROM policies WHERE id != ? AND slug = ?`;
        const [policy] = yield db_1.default.query(checkPolicy, [policy_id, slug]);
        if (policy.length > 0)
            return apiResponse.errorMessage(res, 400, "Policy Already Exist With This Slug");
        const updateSql = `UPDATE policies SET name = ?, slug = ?, content = ?, url = ?, status = ? WHERE id = ?`;
        const VALUES = [name, slug, content, url, status, policy_id];
        const [data] = yield db_1.default.query(updateSql, VALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Policy Updated Successfully", {});
        }
        else {
            return apiResponse.errorMessage(res, 400, "Something Went Wrong");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.updatePolicy = updatePolicy;
// =======================================================================
// =======================================================================
