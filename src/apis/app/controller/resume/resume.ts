import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';

export const addResume = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        let { resume_data } = req.body;
        resume_data = JSON.stringify(resume_data);
        const createdAt = utility.utcDate();

        const sql = `INSERT INTO resumes (user_id, resume_data, created_at) VALUES (?, ?, ?)`;
        const VALUES = [userId, resume_data, createdAt];
        const result: any = await pool.query(sql, VALUES);

        const resumeId = result.insertId;

        const checkResume = `SELECT id FROM resumes WHERE id = ? AND user_id = ?`;
        const [resume]: any = await pool.query(checkResume, [resumeId, userId]);

        if (resume.length === 0) return apiResponse.errorMessage(res, 400, "Resume Not Found");

        return apiResponse.successResponse(res, "Resume Added Successfully", { id: resumeId });
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
};

// =======================================================================
// =======================================================================

export const resumeList = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT id, resume_data, url FROM resumes WHERE user_id = ${userId} AND deleted_at IS NULL`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Resume List", rows);
        } else {
            return apiResponse.successResponse(res, "No Resume Found", []);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const updateResume = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        let { resume_id, resume_data } = req.body;
        resume_data = JSON.stringify(resume_data);

        const checkResume = `SELECT id FROM resumes WHERE id = ? AND user_id = ?`;
        const [resume]: any = await pool.query(checkResume, [resume_id, userId]);
        if (resume.length === 0) return apiResponse.errorMessage(res, 400, "Resume Not Found");

        const updateSql = `UPDATE resumes SET resume_data = ? WHERE id = ?`;
        const VALUES = [`${resume_data}`, resume_id];
        const [data]: any = await pool.query(updateSql, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Resume Updated Successfully", {});
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Resume, Please try again later")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const deleteResume = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const { resume_id } = req.body;
        if (!resume_id) return apiResponse.errorMessage(res, 400, "Resume Id is Required");

        const checkResume = `SELECT id FROM resumes WHERE id = ? AND user_id = ?`;
        const [resume]: any = await pool.query(checkResume, [resume_id, userId]);
        if (resume.length === 0) return apiResponse.errorMessage(res, 400, "Resume Not Found");

        const updateSql = `UPDATE resumes SET deleted_at = ? WHERE id = ?`;
        const VALUES = [utility.utcDate(), resume_id];
        const [data]: any = await pool.query(updateSql, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Resume Deleted Successfully", {});
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Delete Resume, Please try again later")
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
