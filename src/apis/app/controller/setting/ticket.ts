import e, { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';


export const createTicket = async (req: Request, res: Response)=>{
    try{
        const {first_name, email, last_name, message} = req.body;
        const fields: string[] = ["first name", "email", "message"];
        if(!first_name || !email || !message){
            return apiResponse.errorMessage(res,400,`Required fields are: ${fields.join(', ')}`);
        }
    
        const createTicketForContact = `INSERT INTO tickets( first_name, last_name,message, email) VALUES (?, ?, ?, ?)`;
        const VALUES = [first_name, last_name,message, email ];
        const [data]:any = await pool.query(createTicketForContact, VALUES);
        return apiResponse.successResponse(res,"Ticket Created Successfull",null);


    } catch(error){
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
    



}

