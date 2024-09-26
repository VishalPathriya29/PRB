import e, { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import { utcDate } from '../../../../helper/utility';


export const policyList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM policies WHERE status = 1`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Policy List", rows);
        } else {
            return apiResponse.successResponse(res, "No Policy Found", []);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================