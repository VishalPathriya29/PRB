import { Request, Response } from "express";
import path from 'path';
import fs, { linkSync } from 'fs';
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
        
        const templateData = Handlebars.compile(templateRow[0].template_data);

      
        let Base_URL = config.Base_URL;
        let imageUrl = userJson.personaldetails.imageUrl;
   
        let fileImageUrl:any 
        if (imageUrl===null || imageUrl=== undefined || imageUrl==="") {
            fileImageUrl = null
        }else
        fileImageUrl = Base_URL+imageUrl
       


       
        const UserHtmlData = {

            name: userJson.personaldetails.name,
            address: userJson.personaldetails.address,
            phone: userJson.personaldetails.phone,
            email: userJson.personaldetails.email,
            website: userJson.personaldetails.website,
            nationality: userJson.personaldetails.nationality,
            dob: userJson.personaldetails.dob,
            maritalStatus: userJson.personaldetails.maritalStatus,
            imageUrl: fileImageUrl??null,
            educationDetails: userJson.educationDetails??null,
            skill: userJson.skill??null,
            languageDetails: userJson.languageDetails,
            interest: userJson.interest??null,
            achievementDetails: userJson.achievementDetails??null,
            socialLinks: userJson.socialLinks,
            experienceDetails: userJson.experienceDetails??null,
            activities: userJson.activities??null,
            strength: userJson.strength??null,
            // aboutUser: userJson.aboutUser,
            internshipDetails: userJson.internshipDetails,
            projectDetails: userJson.projectDetails,
            certificateDetails: userJson.certificateDetails??null,
            referenceDetails: userJson.referenceDetails??null,
            Declaration: userJson.declarations??null,
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

        const checkUserSusbcription = `SELECT * FROM users_package WHERE user_id = ?`;
        console.log(userId, "here is user id");
        const [subscriptionData]: any = await pool.query(checkUserSusbcription, userId);

        if(subscriptionData.length === 0){
            return apiResponse.errorMessage(res, 400, "You have not subscribed to any package")
        }

        const userJson = JSON.parse(resumeData[0].resume_data);
      

        const templateData = Handlebars.compile(templateRow[0].template_data);


        let Base_URL = config.Base_URL;
        let imageUrl = userJson.personaldetails.imageUrl;
        
 
        let fileImageUrl:any 
        if (imageUrl===null || imageUrl=== undefined || imageUrl==="") {
            fileImageUrl = null
        }else
        fileImageUrl = Base_URL+imageUrl

        const UserHtmlData = {
            name: userJson.personaldetails.name,
            address: userJson.personaldetails.address,
            phone: userJson.personaldetails.phone,
            email: userJson.personaldetails.email,
            website: userJson.personaldetails.website,
            nationality: userJson.personaldetails.nationality,
            dob: userJson.personaldetails.dob,
            maritalStatus: userJson.personaldetails.maritalStatus,
            imageUrl: fileImageUrl,
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
            Declaration: userJson.declarations,
        }

        const resumeHTML = templateData(UserHtmlData);

        if (type === DOCUMENT) {
            try {
                const fileName = `${utility.randomString(10)}.docx`;
                const filePath = path.resolve(__dirname, '../../../../../public', fileName);
                
                const url = `http://localhost:3000/${fileName}`;
        
                // Generate Word document as Blob or Buffer
                const docxBuffer = htmlDocx.asBlob(resumeHTML);
        
                // Convert Blob to Buffer if required
                const bufferData = docxBuffer instanceof Buffer
                    ? docxBuffer
                    : Buffer.from(await docxBuffer.arrayBuffer());
        
                // Write Buffer to file
                fs.writeFileSync(filePath, bufferData);
        
                return apiResponse.successResponse(res, "Resume Generated Successfully", { url });
            } catch (error) {
                console.error("Error generating document:", error);
                return apiResponse.errorMessage(res,400, "Failed to generate resume");
            }
        }
        
        
        else if (type === PDF) {
            const fileName = `${utility.randomString(10)}.pdf`;
            const filePath = path.join(__dirname, '../../../../../public', fileName);
            const browser = await puppeteer.launch({
                    args: [
                        '--disable-gpu',
                        '--disable-dev-shm-usage',
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--single-process',
                        '--no-zygote',
                    ],
                    headless: false,
                    pipe: true,

                });
            try{
                const page = await browser.newPage();
              
        
                await page.setUserAgent(
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
                );
               
                await page.setContent(resumeHTML, {   waitUntil: 'networkidle2',
                });
                console.log("HTML content loaded into page");
                
                await page.pdf({
                    path: filePath,
                    format: 'A4',
                    printBackground: true,
                    margin: {
                        top: '10mm',
                        right: '10mm',
                        bottom: '10mm',
                        left: '10mm',
                    },
                });


                await browser.close(); 

                console.log("PDF generated successfully");
        
                const pdfLink = `https://prb-vqqd.onrender.com/${fileName}`;
                return apiResponse.successResponse(res, 'Resume Generated Successfully', { pdfLink });


            } catch (err) {
                console.error("Error generating PDF:", err);
                return apiResponse.errorMessage(res, 400, "Failed to Generate Resume, Please try again later");
            } finally {
                console.log("Browser instance closed");
            }
        }
        
        } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

