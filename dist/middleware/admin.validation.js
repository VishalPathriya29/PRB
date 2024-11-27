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
exports.updatePolicyValidation = exports.addPolicyValidation = exports.updateBlogValidation = exports.addBlogValidation = exports.updateBlogCategoryValidation = exports.addBlogCategoryValidation = exports.updateTemplateValidation = exports.addTemplateValidation = exports.addMembershipValidation = exports.loginValidation = void 0;
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
/** MEMBERSHIP VALIDATIONS */
const addMembershipValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().min(3).max(70).required(),
        slug: joi_1.default.string().trim().min(3).max(70).required(),
        details: joi_1.default.array().required(),
        prices: joi_1.default.array().items({
            price_name: joi_1.default.string().required(),
            currency: joi_1.default.string().required(),
            price: joi_1.default.number().required(),
            duration: joi_1.default.number().required()
        }),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.addMembershipValidation = addMembershipValidation;
// ===========================================================================
// ===========================================================================
const addTemplateValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().min(3).max(70).required(),
        description: joi_1.default.string().required(),
        image: joi_1.default.string().allow("", null),
        html: joi_1.default.string().required(),
        css: joi_1.default.string().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.addTemplateValidation = addTemplateValidation;
// ===========================================================================
// ===========================================================================
const updateTemplateValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        templateId: joi_1.default.number().required(),
        name: joi_1.default.string().trim().min(3).max(70).required(),
        description: joi_1.default.string().required(),
        image: joi_1.default.string().allow("", null),
        html: joi_1.default.string().required(),
        css: joi_1.default.string().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.updateTemplateValidation = updateTemplateValidation;
// ===========================================================================
// ===========================================================================
const addBlogCategoryValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().min(3).max(70).required(),
        description: joi_1.default.string().required(),
        image: joi_1.default.string().allow("", null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.addBlogCategoryValidation = addBlogCategoryValidation;
// ===========================================================================
// ===========================================================================
const updateBlogCategoryValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        cat_id: joi_1.default.number().required(),
        name: joi_1.default.string().trim().min(3).max(70).required(),
        description: joi_1.default.string().required(),
        image: joi_1.default.string().allow("", null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.updateBlogCategoryValidation = updateBlogCategoryValidation;
// ===========================================================================
// ===========================================================================
const addBlogValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        cat_id: joi_1.default.number().required(),
        slug: joi_1.default.string().trim().min(3).max(70).required(),
        title: joi_1.default.string().trim().min(3).max(70).required(),
        description: joi_1.default.string().required(),
        image: joi_1.default.string().allow("", null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.addBlogValidation = addBlogValidation;
// ===========================================================================
// ===========================================================================
const updateBlogValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        blog_id: joi_1.default.number().required(),
        cat_id: joi_1.default.number().required(),
        slug: joi_1.default.string().trim().min(3).max(70).required(),
        title: joi_1.default.string().trim().min(3).max(70).required(),
        description: joi_1.default.string().required(),
        image: joi_1.default.string().allow("", null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.updateBlogValidation = updateBlogValidation;
// ===========================================================================
// ===========================================================================
const addPolicyValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().min(3).max(70).required(),
        slug: joi_1.default.string().trim().min(3).max(70).required(),
        content: joi_1.default.string().trim().required(),
        url: joi_1.default.string().trim().allow("", null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
});
exports.addPolicyValidation = addPolicyValidation;
// ===========================================================================
// ===========================================================================
const updatePolicyValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        policy_id: joi_1.default.number().required(),
        name: joi_1.default.string().trim().min(3).max(70).required(),
        slug: joi_1.default.string().trim().min(3).max(70).required(),
        content: joi_1.default.string().trim().required(),
        url: joi_1.default.string().trim().allow("", null),
        status: joi_1.default.number().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
});
exports.updatePolicyValidation = updatePolicyValidation;
// ===========================================================================
// ===========================================================================
