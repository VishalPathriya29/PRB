import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';
import pdf from 'html-pdf';

// Generate Resume
export const generateResume = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const { resume_id, template_id } = req.body;

        const checkResume = `SELECT id, resume_data FROM resumes WHERE id = ? AND user_id = ?`;
        const [resume]: any = await pool.query(checkResume, [resume_id, userId]);
        if (resume.length === 0) return apiResponse.errorMessage(res, 400, "Resume Not Found");

        const checkTemplate = `SELECT * FROM templates WHERE id = ? AND status = 1`;
        const [template]: any = await pool.query(checkTemplate, [template_id]);
        if (template.length === 0) return apiResponse.errorMessage(res, 400, "Template Not Found");

        const resumeData = JSON.parse(resume[0].resume_data);
        const templateData = template[0];

        // get html and css from templateData and use them
        const html = templateData.html;
        const css = templateData.css;

        // create template from html
        const templateHtml = Handlebars.compile(html);
        const templateCss = Handlebars.compile(css);

        // create resume html and css
        const resumeHtml = templateHtml({ resumeData });
        const resumeCss = templateCss({ resumeData });

        // merge html and css
        const resumeHtmlWithCss = `
        <html>
            <head>
            <title>Resume</title>
                <style>
                    ${resumeCss}
                </style>
            </head>
            <body>
                ${resumeHtml}
            </body>
        </html>
        `;

        // create resume pdf
        const options: any = { format: 'A4' };
        const fileName = `${utility.randomString(10)}.pdf`;
        const filePath = path.join(__dirname, '../../../../../public/resumes', fileName);

        pdf.create(resumeHtmlWithCss, options).toFile(filePath, async function (err: any, response: any) {
            if (err) {
                console.log(err);
                return apiResponse.errorMessage(res, 400, "Failed to Generate Resume, Please try again later")
            }

            const url = `${process.env.BASE_URL}/resumes/${fileName}`;
            const updateSql = `UPDATE resumes SET url = ? WHERE id = ?`;
            await pool.query(updateSql, [url, resume_id]);

            return apiResponse.successResponse(res, "Resume Generated Successfully", { url });
        });




    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================


