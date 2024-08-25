import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import { utcDate } from '../../../../helper/utility';


export const addTemplate = async (req: Request, res: Response) => {
    try {
        const { name, description, image, html } = req.body;
        const createdAt = utcDate();

        const sql = `INSERT INTO templates (name, description, image, html, created_at) VALUES (?, ?, ?, ?, ?)`;
        const VALUES = [name, description, image, html, createdAt];
        await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, "Template Added Successfully", {});
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const templateList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM templates`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Template List", rows);
        } else {
            return apiResponse.successResponse(res, "No Template Found", []);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const updateTemplate = async (req: Request, res: Response) => {
    try {
        const { templateId, name, description, image, html } = req.body;

        const checkTemplate = `SELECT id FROM templates WHERE id = ?`;
        const [template]: any = await pool.query(checkTemplate, [templateId]);
        if (template.length === 0) return apiResponse.errorMessage(res, 400, "Template Not Found");

        const updateSql = `UPDATE templates SET name = ?, description = ?, image = ?, html = ? WHERE id = ?`;
        const VALUES = [name, description, image, html, templateId];
        const [data]: any = await pool.query(updateSql, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Template Updated Successfully", {});
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Template, Please try again later")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================
