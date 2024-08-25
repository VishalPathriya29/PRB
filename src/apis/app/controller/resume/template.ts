import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';

export const templateList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM templates WHERE status = 1`;
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

// =======================================================================
// =======================================================================

