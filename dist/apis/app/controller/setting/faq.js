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
exports.getFaqs = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
const getFaqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.query.type;
        if (!type || type === "all") {
            const faqCategoriesQuery = `SELECT * FROM faq_category`;
            const [faqCategories] = yield db_1.default.query(faqCategoriesQuery);
            const faqsQuery = `SELECT * FROM faqs`;
            const [faqs] = yield db_1.default.query(faqsQuery);
            const result = faqCategories.map((category) => {
                const categoryFaqs = faqs.filter((faq) => faq.category_id === category.id);
                return {
                    type: category.type,
                    faqData: categoryFaqs.map((faq) => ({
                        question: faq.question,
                        answer: faq.answer
                    }))
                };
            });
            return apiResponse.successResponse(res, "FAQs fetched successfully", result);
        }
        else {
            const faqCategoryQuery = `SELECT * FROM faq_category WHERE type = ?`;
            const [faqCategory] = yield db_1.default.query(faqCategoryQuery, [type]);
            if (faqCategory.length === 0) {
                return apiResponse.errorMessage(res, 400, "FAQ category not found");
            }
            const faqsQuery = `SELECT * FROM faqs WHERE category_id = ?`;
            const [faqs] = yield db_1.default.query(faqsQuery, [faqCategory[0].id]);
            const result = faqCategory.map((category) => ({
                type: category.type,
                faqData: faqs.map((faq) => ({
                    question: faq.question,
                    answer: faq.answer
                }))
            }));
            return apiResponse.successResponse(res, "FAQs fetched successfully", result);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.getFaqs = getFaqs;
