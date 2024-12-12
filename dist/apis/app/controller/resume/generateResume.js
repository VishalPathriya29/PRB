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
exports.downloadResume = exports.createResume = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
const utility = __importStar(require("../../../../helper/utility"));
const html_docx_js_1 = __importDefault(require("html-docx-js"));
// import mammoth from '';
const config_1 = __importDefault(require("../../../../config/config"));
const HtmlToDocx = require('html-to-docx');
const puppeteer_1 = __importDefault(require("puppeteer"));
// =======================================================================
// =======================================================================
const createResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { template_id, resume_id } = req.body;
        const getTemplateDataSql = `SELECT template_data FROM templates WHERE id = ${template_id}`;
        const [templateRow] = yield db_1.default.query(getTemplateDataSql);
        if (templateRow.length === 0) {
            return apiResponse.errorMessage(res, 400, "Template Not Found");
        }
        const getResumeDataSql = `SELECT * FROM resumes WHERE id = ? AND user_id = ?`;
        const Value = [resume_id, userId];
        const [resumeData] = yield db_1.default.query(getResumeDataSql, Value);
        if (resumeData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Resume Not Found");
        }
        const userJson = JSON.parse(resumeData[0].resume_data);
        console.log(userJson, "userJson");
        const templateData = handlebars_1.default.compile(templateRow[0].template_data);
        const UserHtmlData = {
            name: userJson.personaldetails.name,
            address: userJson.personaldetails.address,
            phone: userJson.personaldetails.phone,
            email: userJson.personaldetails.email,
            website: userJson.personaldetails.website,
            nationality: userJson.personaldetails.nationality,
            dob: userJson.personaldetails.dob,
            maritalStatus: userJson.personaldetails.maritalStatus,
            educationDetails: userJson.educationDetails,
            skill: userJson.skill,
            languageDetails: userJson.languageDetails,
            interest: userJson.interest,
            achievementDetails: userJson.achievementDetails,
            socialLinks: userJson.socialLinks,
            experienceDetails: userJson.experienceDetails,
            activities: userJson.activities,
            strength: userJson.strength,
            // aboutUser: userJson.aboutUser,
            internshipDetails: userJson.internshipDetails,
            projectDetails: userJson.projectDetails,
            certificateDetails: userJson.certificateDetails,
            referenceDetails: userJson.referenceDetails,
            Declaration: userJson.Declaration,
        };
        const resumeHTML = templateData(UserHtmlData);
        return res.send(resumeHTML);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.createResume = createResume;
// =======================================================================
// =======================================================================
const downloadResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { template_id, resume_id, type } = req.body;
        const { DOCUMENT, PDF, TEXT } = config_1.default.DOWNLOAD_TYPE;
        const getTemplateDataSql = `SELECT template_data FROM templates WHERE id = ${template_id}`;
        const [templateRow] = yield db_1.default.query(getTemplateDataSql);
        if (templateRow.length === 0) {
            return apiResponse.errorMessage(res, 400, "Template Not Found");
        }
        const getResumeDataSql = `SELECT * FROM resumes WHERE id = ? AND user_id = ?`;
        const Value = [resume_id, userId];
        const [resumeData] = yield db_1.default.query(getResumeDataSql, Value);
        if (resumeData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Resume Not Found");
        }
        const userJson = JSON.parse(resumeData[0].resume_data);
        const templateData = handlebars_1.default.compile(templateRow[0].template_data);
        const UserHtmlData = {
            name: userJson.personaldetails.name,
            address: userJson.personaldetails.address,
            phone: userJson.personaldetails.phone,
            email: userJson.personaldetails.email,
            website: userJson.personaldetails.website,
            nationality: userJson.personaldetails.nationality,
            dob: userJson.personaldetails.dob,
            maritalStatus: userJson.personaldetails.maritalStatus,
            educationDetails: userJson.educationDetails,
            skill: userJson.skill,
            languageDetails: userJson.languageDetails,
            interest: userJson.interest,
            achievementDetails: userJson.achievementDetails,
            socialLinks: userJson.socialLinks,
            experienceDetails: userJson.experienceDetails,
            activities: userJson.activities,
            strength: userJson.strength,
            // aboutUser: userJson.aboutUser,
            internshipDetails: userJson.internshipDetails,
            projectDetails: userJson.projectDetails,
            certificateDetails: userJson.certificateDetails,
            referenceDetails: userJson.referenceDetails,
            Declaration: userJson.Declaration,
        };
        const resumeHTML = templateData(UserHtmlData);
        if (type === DOCUMENT) {
            const options = { format: 'A4' };
            const fileName = `${utility.randomString(10)}.docx`;
            const filePath = path_1.default.join(__dirname, '../../../../../public/resumes', fileName);
            const url = 'localhost:3000/' + fileName;
            const docxsBuffer = html_docx_js_1.default.asBlob(resumeHTML);
            fs_1.default.writeFileSync(filePath, (docxsBuffer).toString());
            return apiResponse.successResponse(res, "Resume Generated Successfully", { url });
        }
        else if (type === PDF) {
            const options = { format: 'A4' };
            const fileName = `${utility.randomString(10)}.pdf`;
            const filePath = path_1.default.join(__dirname, '../../../../../public', fileName);
            const browser = yield puppeteer_1.default.launch({
                args: [
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                    "--single-process",
                    "--no-zygote",
                ],
                headless: true
            });
            const page = yield browser.newPage();
            yield page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36");
            // Set content and wait for rendering
            yield page.setContent(resumeHTML, { waitUntil: 'networkidle0' });
            // Generate PDF with more options
            yield page.pdf({
                path: filePath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '10mm',
                    right: '10mm',
                    bottom: '10mm',
                    left: '10mm'
                }
            });
            console.log("h5");
            yield browser.close();
            const pdfLink = `https://prb-vqqd.onrender.com/${fileName}`;
            console.log("h6");
            return apiResponse.successResponse(res, "Resume Generated Successfully", { pdfLink });
        }
        ;
        // pdf.create(resumeHTML, options).toFile(filePath, async function (err: any, response: any) {
        //     if (err) {
        //         console.log(err);
        //         return apiResponse.errorMessage(res, 400, "Failed to Generate Resume, Please try again later");
        //     }
        //     const url = `http://localhost:3000/resumes/${fileName}`;
        //     return apiResponse.successResponse(res, "Resume Generated Successfully", { url });
        // });
        //  }
        console.log("h7");
        return res.send("Else case !");
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.downloadResume = downloadResume;
