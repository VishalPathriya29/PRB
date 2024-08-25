import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';


export const profile = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1`;
        const [rows]: any = await pool.query(sql, [userId]);

        if (rows.length > 0) {
            delete rows[0].password;
            delete rows[0].id;
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows[0]);
        } else {
            return apiResponse.errorMessage(res, 400, "Profile not found");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// =======================================================================
// =======================================================================

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const { name, phone, image } = req.body;
        const updatedAt = utility.utcDate();

        const updateSql = `UPDATE users SET name = ?, phone = ?, image = ? WHERE id = ?`;
        const VALUES = [name, phone, image, userId];
        const [data]: any = await pool.query(updateSql, VALUES);

        if (data.affectedRows > 0) {
            const userQuery = `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL limit 1`;
            const [userData]: any = await pool.query(userQuery, [userId]);

            if (userData.length > 0) {
                delete userData[0].password;
                delete userData[0].id;
                return apiResponse.successResponse(res, "Profile Updated Successfully", userData[0]);
            } else {
                return apiResponse.errorMessage(res, 400, "User Not Updated, try again")
            }
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Profile, Please try again later")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================
