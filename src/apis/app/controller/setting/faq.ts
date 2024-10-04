import e, { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const type = req.query.type;
    if (!type || type === "all") {
      const faqCategoriesQuery = `SELECT * FROM faq_category`;
      const [faqCategories]: any = await pool.query(faqCategoriesQuery);
      
      const faqsQuery = `SELECT * FROM faqs`;
      const [faqs]: any = await pool.query(faqsQuery);
      const result = faqCategories.map((category: any) => {
        const categoryFaqs = faqs.filter((faq: any) => faq.category_id === category.id);
        return {
          type: category.type, 
          faqData: categoryFaqs.map((faq: any) => ({
            question: faq.question,
            answer: faq.answer
          }))
        };
      });
     return apiResponse.successResponse(res, "FAQs fetched successfully", result);
    } else {
      const faqCategoryQuery = `SELECT * FROM faq_category WHERE type = ?`;
      const [faqCategory]: any = await pool.query(faqCategoryQuery, [type]);

      if (faqCategory.length === 0) {
        return apiResponse.errorMessage(res, 400, "FAQ category not found");
      }

      const faqsQuery = `SELECT * FROM faqs WHERE category_id = ?`; 
      const [faqs]: any = await pool.query(faqsQuery, [faqCategory[0].id]);

      const result = faqCategory.map((category: any) => ({
        type: category.type,
        faqData: faqs.map((faq: any) => ({
          question: faq.question,
          answer: faq.answer
        }))
      }));

      return apiResponse.successResponse(res,"FAQs fetched successfully", result);
    }
  } catch (error) {
    console.log(error);
    return apiResponse.errorMessage(res, 400, "Something Went Wrong");
  }
};
