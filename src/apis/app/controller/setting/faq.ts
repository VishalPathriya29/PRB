import e, { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';

export const getFaqs = async (req: Request, res: Response)=>{
    try{
       const type = req.query.type;
       if ( !type || type ==="all"){
       const faqCategories = `select * from faq_category`;
       const [faqCategory] = await pool.query(faqCategories);
        
       const  getFaq = `select * from faqs`;
       const [faqs] :any = await pool.query(getFaq);

    //    for (let index = 0; index < faqCategories.length; index++) {
    //     const categoryFaqs = faqs.filter(faq => faq.category_id ===  );
        
        
    //    }







        



      
        
       
       
       } 
      
     } catch (error){
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}