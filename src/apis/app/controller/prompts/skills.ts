import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';


export const getSkillSuggestions = async (req: Request, res: Response) => {
    try{

        const keyword = req.query.keyword as string; 
        // if (!keyword){
        //     return apiResponse.successResponse(res, "Type a word to get suggestions", []);
        // } 
        const sql = `SELECT * FROM skill`;
        const [rows]: any = await pool.query(sql);

        // const sql = `SELECT * FROM field_of_study WHERE fieldName LIKE ?`;
        // const [rows]: any = await pool.query(sql, [`%${keyword}%`]);

        const suggestions = rows.map((row: { skill: string }) => row.skill);
    
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