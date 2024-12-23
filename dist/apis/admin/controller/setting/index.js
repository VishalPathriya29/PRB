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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogController = __importStar(require("./blog"));
const policyController = __importStar(require("./policy"));
const authorization_1 = require("../../../../middleware/authorization");
const adminValidation = __importStar(require("../../../../middleware/admin.validation"));
const settingRouter = (0, express_1.Router)();
settingRouter.post('/blog/category', authorization_1.authenticatingToken, adminValidation.addBlogCategoryValidation, blogController.addBlogCategory);
settingRouter.get('/blog/categories', authorization_1.authenticatingToken, blogController.blogCategoryList);
settingRouter.patch('/blog/category', authorization_1.authenticatingToken, adminValidation.updateBlogCategoryValidation, blogController.updateBlogCategory);
settingRouter.post('/blogPost', authorization_1.authenticatingToken, adminValidation.addBlogValidation, blogController.addBlog);
settingRouter.get('/blogPosts', authorization_1.authenticatingToken, blogController.blogList);
settingRouter.patch('/blogPost', authorization_1.authenticatingToken, adminValidation.updateBlogValidation, blogController.updateBlog);
settingRouter.post('/policy', authorization_1.authenticatingToken, adminValidation.addPolicyValidation, policyController.addPolicy);
settingRouter.get('/policies', authorization_1.authenticatingToken, policyController.policyList);
settingRouter.patch('/policy', authorization_1.authenticatingToken, adminValidation.updatePolicyValidation, policyController.updatePolicy);
exports.default = settingRouter;
