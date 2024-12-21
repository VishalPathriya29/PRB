import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';


export const getDashboard = async (req: Request, res: Response) => {
    try{
        const userId = res.locals.jwt.userId;
        const sql = `SELECT COUNT(*) as total FROM resumes WHERE user_id = ?`;
        const [rows]: any = await pool.query(sql, [userId]);
        const totalResumes = rows[0].total;
        const sqlQueryForGetPackage = `SELECT * FROM users_package WHERE user_id = ?`;
        const [packageData]: any = await pool.query(sqlQueryForGetPackage, [userId]);

        let dashboardDetails = {};
        if(packageData.length > 0){
            dashboardDetails = {
                totalResumes: totalResumes,
                packageData: packageData[0]
            }
        } else {
            dashboardDetails = {
                totalResumes: totalResumes,
                packageData: {}
            }
        }
        return apiResponse.successResponse(res, "Dashboard data fetched successfully", dashboardDetails)

  } catch(error){
      console.log(error);
      return apiResponse.errorMessage(res, 400, "Something Went Wrong")
      }
}