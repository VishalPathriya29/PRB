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
exports.generateResumeValidation = exports.purchaseMembershipValidation = exports.updateResumeValidation = exports.addResumeValidation = exports.updateProfileValidation = exports.loginValidation = exports.registrationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const apiResponse = __importStar(require("../helper/response"));
const validationCheck = (value) => __awaiter(void 0, void 0, void 0, function* () {
    let msg = value.error.details[0].message;
    console.log(msg);
    msg = msg.replace(/"/g, "");
    msg = msg.replace('_', " ");
    msg = msg.replace('.', " ");
    const errorMessage = "Validation error : " + msg;
    return errorMessage;
});
// ===========================================================================
/** AUTH VALIDATIONS */
const registrationValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().min(3).max(70).allow("", null),
        email: joi_1.default.string().email().max(80).required(),
        password: joi_1.default.string().min(3).max(30).required(),
        fcm_token: joi_1.default.string().trim().required(),
        device_id: joi_1.default.string().allow("", null),
        device_type: joi_1.default.string().allow("", null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
});
exports.registrationValidation = registrationValidation;
// ===========================================================================
// ===========================================================================
const loginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().max(80).required(),
        password: joi_1.default.string().min(3).max(30).required(),
        fcm_token: joi_1.default.string().trim().required(),
        device_id: joi_1.default.string().allow("", null),
        device_type: joi_1.default.string().allow("", null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.loginValidation = loginValidation;
// ===========================================================================
// ===========================================================================
/** USERS VALIDATIONS */
const updateProfileValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().min(3).max(70).required(),
        phone: joi_1.default.string().min(10).max(15).allow("", null),
        image: joi_1.default.string().trim().allow("", null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
});
exports.updateProfileValidation = updateProfileValidation;
// ===========================================================================
// ===========================================================================
/** RESUMES VALIDATIONS */
const addResumeValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        resume_data: joi_1.default.required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
});
exports.addResumeValidation = addResumeValidation;
// ===========================================================================
// ===========================================================================
const updateResumeValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        resume_id: joi_1.default.number().required(),
        resume_data: joi_1.default.required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
});
exports.updateResumeValidation = updateResumeValidation;
// ===========================================================================
// ===========================================================================
// Purchase membership
const purchaseMembershipValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        membership_plan_id: joi_1.default.number().required(),
        payment_details: joi_1.default.object({
            transaction_id: joi_1.default.string().required(),
            paymentSignature: joi_1.default.string().required(),
            paymentTimestamp: joi_1.default.string().required(),
        }).required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
});
exports.purchaseMembershipValidation = purchaseMembershipValidation;
// ===========================================================================
// ===========================================================================
// Generate Resume Validation
const generateResumeValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        resume_id: joi_1.default.number().required(),
        template_id: joi_1.default.number().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
});
exports.generateResumeValidation = generateResumeValidation;
// ===========================================================================
// ===========================================================================
