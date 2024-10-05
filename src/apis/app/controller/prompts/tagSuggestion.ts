import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';


export const suggestionList = async (req: Request, res: Response) => {
    try{

        const keyword = req.query.keyword as string; 
        // if (!keyword){
        //     return apiResponse.successResponse(res, "Type a word to get suggestions", []);
        // } 

        // const sql = `SELECT id, suggestedText FROM tagPrompts WHERE suggestedText LIKE ?`;
        // const [rows]: any = await pool.query(sql, [`%${keyword}%`]);
        const sql = `SELECT id, suggestedText FROM tagPrompts`;
        const [rows]: any = await pool.query(sql);

        if (rows.length <= 0) {
            return apiResponse.successResponse(res, "No Suggestion Found", []);
        } else {
            return apiResponse.successResponse(res, "Suggestions Found", rows);
        }

    } catch(error){
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
 
};