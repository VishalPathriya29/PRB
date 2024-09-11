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
exports.updateTemplate = exports.templateList = exports.addTemplate = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
const utility_1 = require("../../../../helper/utility");
const addTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, image, html, css } = req.body;
        const createdAt = (0, utility_1.utcDate)();
        const sql = `INSERT INTO templates (name, description, image, html, css, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
        const VALUES = [name, description, image, html, css, createdAt];
        yield db_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Template Added Successfully", {});
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.addTemplate = addTemplate;
// =======================================================================
// =======================================================================
const templateList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM templates`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Template List", rows);
        }
        else {
            return apiResponse.successResponse(res, "No Template Found", []);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.templateList = templateList;
// =======================================================================
// =======================================================================
const updateTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId, name, description, image, html, css } = req.body;
        const checkTemplate = `SELECT id FROM templates WHERE id = ?`;
        const [template] = yield db_1.default.query(checkTemplate, [templateId]);
        if (template.length === 0)
            return apiResponse.errorMessage(res, 400, "Template Not Found");
        const updateSql = `UPDATE templates SET name = ?, description = ?, image = ?, html = ?, css = ? WHERE id = ?`;
        const VALUES = [name, description, image, html, css, templateId];
        const [data] = yield db_1.default.query(updateSql, VALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Template Updated Successfully", {});
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Template, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.updateTemplate = updateTemplate;
// =======================================================================
// =======================================================================
