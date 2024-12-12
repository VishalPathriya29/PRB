import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';
// import pdf from 'html-pdf';
import axios from "axios";
import htmlDocx from 'html-docx-js';
// import mammoth from '';
import config from '../../../../config/config';
const HtmlToDocx: any = require('html-to-docx');
import puppeteer from 'puppeteer';


// =======================================================================
// =======================================================================

export const createResume = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;

        const { template_id, resume_id } = req.body;

        const getTemplateDataSql = `SELECT template_data FROM templates WHERE id = ${template_id}`;
        const [templateRow]: any = await pool.query(getTemplateDataSql);

        if (templateRow.length === 0) {
            return apiResponse.errorMessage(res, 400, "Template Not Found")
        }

        const getResumeDataSql = `SELECT * FROM resumes WHERE id = ? AND user_id = ?`;
        const Value = [resume_id, userId];
        const [resumeData]: any = await pool.query(getResumeDataSql, Value);

        if (resumeData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Resume Not Found")
        }

        const userJson = JSON.parse(resumeData[0].resume_data);
        console.log(userJson, "userJson");

        const templateData = Handlebars.compile(templateRow[0].template_data);

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
        }

        const resumeHTML = templateData(UserHtmlData);

        return res.send(resumeHTML);

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const downloadResume = async (req: Request, res: Response) => {

    try {
        const userId = res.locals.jwt.userId;

        const { template_id, resume_id, type } = req.body;

        const { DOCUMENT, PDF, TEXT } = config.DOWNLOAD_TYPE

        const getTemplateDataSql = `SELECT template_data FROM templates WHERE id = ${template_id}`;
        const [templateRow]: any = await pool.query(getTemplateDataSql);

        if (templateRow.length === 0) {
            return apiResponse.errorMessage(res, 400, "Template Not Found")
        }

        const getResumeDataSql = `SELECT * FROM resumes WHERE id = ? AND user_id = ?`;
        const Value = [resume_id, userId];
        const [resumeData]: any = await pool.query(getResumeDataSql, Value);

        if (resumeData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Resume Not Found")
        }

        const userJson = JSON.parse(resumeData[0].resume_data);

        const templateData = Handlebars.compile(templateRow[0].template_data);

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
        }

        const resumeHTML = templateData(UserHtmlData);


        if (type === DOCUMENT) {
            const options: any = { format: 'A4' };
            
                            const fileName = `${utility.randomString(10)}.docx`;
                            
                            const filePath = path.join(__dirname, '../../../../../public/resumes', fileName);
                
                            const url = 'localhost:3000/' + fileName;
                
                            const docxsBuffer = htmlDocx.asBlob(resumeHTML);
                            fs.writeFileSync(filePath, (docxsBuffer).toString());
                
                            return apiResponse.successResponse(res, "Resume Generated Successfully", { url });
                
        } else if (type === PDF) {

            const options: any = { format: 'A4' };
            const fileName = `${utility.randomString(10)}.pdf`;
            const filePath = path.join(__dirname, '../../../../../public', fileName);

  
            const browser = await puppeteer.launch({
                args: [
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                    "--single-process",
                    "--no-zygote",
                  ],
                  headless: true
            });   
            
            
            const page = await browser.newPage();

            await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")

            // Set content and wait for rendering
            await page.setContent(resumeHTML, { waitUntil: 'networkidle0' });

            // Generate PDF with more options
            await page.pdf({
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

            console.log("h5")

            await browser.close();

            const pdfLink = `https://prb-vqqd.onrender.com/${fileName}`;

            console.log("h6")

            return apiResponse.successResponse(res, "Resume Generated Successfully", { pdfLink });
        };

        // pdf.create(resumeHTML, options).toFile(filePath, async function (err: any, response: any) {
        //     if (err) {
        //         console.log(err);
        //         return apiResponse.errorMessage(res, 400, "Failed to Generate Resume, Please try again later");
        //     }

        //     const url = `http://localhost:3000/resumes/${fileName}`;
        //     return apiResponse.successResponse(res, "Resume Generated Successfully", { url });
        // });
        //  }

        console.log("h7")

        return res.send("Else case !")



    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}