import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';


export const getFieldSuggestions = async (req: Request, res: Response) => {
    try{

        const keyword = req.query.keyword as string; 
        // if (!keyword){
        //     return apiResponse.successResponse(res, "Type a word to get suggestions", []);
        // } 

        // const sql = `SELECT * FROM field_of_study WHERE fieldName LIKE ?`;
        // const [rows]: any = await pool.query(sql, [`%${keyword}%`]);

        const sql = `SELECT * FROM field_of_study`;
        const [rows]: any = await pool.query(sql);

        const suggestions = rows.map((row: { fieldName: string }) => row.fieldName);
    
        if (rows.length <= 0) {
            return apiResponse.successResponse(res, "No Suggestion Found", []);
        } else {
            return apiResponse.successResponse(res, "Suggestions Found", suggestions);
        }

    } catch(error){
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
 
};