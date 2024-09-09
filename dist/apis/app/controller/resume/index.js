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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const templateController = __importStar(require("./template"));
const resumeController = __importStar(require("./resume"));
const authorization_1 = require("../../../../middleware/authorization");
const validation = __importStar(require("../../../../middleware/validation"));
const resumeRouter = (0, express_1.Router)();
resumeRouter.post('/addResume', authorization_1.authenticatingToken, validation.addResumeValidation, resumeController.addResume);
resumeRouter.get('/resumes', authorization_1.authenticatingToken, resumeController.resumeList);
resumeRouter.patch('/updateResume', authorization_1.authenticatingToken, validation.updateResumeValidation, resumeController.updateResume);
resumeRouter.delete('/deleteResume', authorization_1.authenticatingToken, resumeController.deleteResume);
resumeRouter.get('/template', templateController.templateList);
exports.default = resumeRouter;
