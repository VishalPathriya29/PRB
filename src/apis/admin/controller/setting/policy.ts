import e, { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import { utcDate } from '../../../../helper/utility';


export const addPolicy = async (req: Request, res: Response) => {
    try {
        const { name, slug, content, url } = req.body;

        const checkPolicy = `SELECT id FROM policies WHERE slug = ?`;
        const [policy]: any = await pool.query(checkPolicy, [slug]);
        if (policy.length > 0) return apiResponse.errorMessage(res, 400, "Policy Already Exist With This Slug");

        const sql = `INSERT INTO policies (name, slug, content, url) VALUES (?, ?, ?, ?)`;
        const VALUES = [name, slug, content, url];
        await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, "Policy Added Successfully", {});
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const policyList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM policies`;
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

export const updatePolicy = async (req: Request, res: Response) => {
    try {
        const { policy_id, name, slug, content, url, status } = req.body;

        const checkPolicy = `SELECT id, slug FROM policies WHERE id != ? AND slug = ?`;
        const [policy]: any = await pool.query(checkPolicy, [policy_id, slug]);
        if (policy.length > 0) return apiResponse.errorMessage(res, 400, "Policy Already Exist With This Slug");

        const updateSql = `UPDATE policies SET name = ?, slug = ?, content = ?, url = ?, status = ? WHERE id = ?`;
        const VALUES = [name, slug, content, url, status, policy_id];
        const [data]: any = await pool.query(updateSql, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Policy Updated Successfully", {});
        } else {
            return apiResponse.errorMessage(res, 400, "Something Went Wrong");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================
