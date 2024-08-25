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
exports.deleteResume = exports.updateResume = exports.resumeList = exports.addResume = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
const utility = __importStar(require("../../../../helper/utility"));
const addResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        let { resume_data } = req.body;
        resume_data = JSON.stringify(resume_data);
        const createdAt = utility.utcDate();
        const sql = `INSERT INTO resumes (user_id, resume_data, created_at) VALUES (?, ?, ?)`;
        const VALUES = [userId, `${resume_data}`, createdAt];
        yield db_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Resume Added Successfully", {});
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.addResume = addResume;
// =======================================================================
// =======================================================================
const resumeList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT id, resume_data, url FROM resumes WHERE user_id = ${userId} AND deleted_at IS NULL`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Resume List", rows);
        }
        else {
            return apiResponse.successResponse(res, "No Resume Found", []);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.resumeList = resumeList;
// =======================================================================
// =======================================================================
const updateResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        let { resume_id, resume_data } = req.body;
        resume_data = JSON.stringify(resume_data);
        const checkResume = `SELECT id FROM resumes WHERE id = ? AND user_id = ?`;
        const [resume] = yield db_1.default.query(checkResume, [resume_id, userId]);
        if (resume.length === 0)
            return apiResponse.errorMessage(res, 400, "Resume Not Found");
        const updateSql = `UPDATE resumes SET resume_data = ? WHERE id = ?`;
        const VALUES = [`${resume_data}`, resume_id];
        const [data] = yield db_1.default.query(updateSql, VALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Resume Updated Successfully", {});
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Resume, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.updateResume = updateResume;
// =======================================================================
// =======================================================================
const deleteResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { resume_id } = req.body;
        if (!resume_id)
            return apiResponse.errorMessage(res, 400, "Resume Id is Required");
        const checkResume = `SELECT id FROM resumes WHERE id = ? AND user_id = ?`;
        const [resume] = yield db_1.default.query(checkResume, [resume_id, userId]);
        if (resume.length === 0)
            return apiResponse.errorMessage(res, 400, "Resume Not Found");
        const updateSql = `UPDATE resumes SET deleted_at = ? WHERE id = ?`;
        const VALUES = [utility.utcDate(), resume_id];
        const [data] = yield db_1.default.query(updateSql, VALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Resume Deleted Successfully", {});
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Delete Resume, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.deleteResume = deleteResume;
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
