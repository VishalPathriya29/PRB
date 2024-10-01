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

export const getLegalPages = async (req: Request, res: Response)=>{
    try{
       const type = req.query.type;
       if ( !type ){
        return apiResponse.errorMessage(res, 400, "Type is required");
       } 
       const types: string[] = ["cookiesPolicy", "privacyPolicy", "refundPolicy", "termAndCondition"];
       if (types.includes(type.toString())){
        const checkpagetype = `select description from legalAndPolicyPages where type = ?`

        const [page] :any = await pool.query(checkpagetype, [type]);
        apiResponse.successResponse(res, "Data Found",page[0])
       } else {
        return apiResponse.errorMessage(res, 400, `Type must be one of: ${types.join(', ')}`);
       }
     } catch (error){
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}



// =======================================================================
// =======================================================================
