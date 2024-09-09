import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';


export const blogList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM blog_posts WHERE status = 1`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Blog List", rows);
        } else {
            return apiResponse.successResponse(res, "No Blog Found", []);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================