import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';


export const blogList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM blog_posts WHERE status = 1`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Blog List", rows);
        } else {
            return apiResponse.successResponse(res, "No Blog Found", []);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const getBlogDetails = async (req: Request, res: Response) => {
    try {
        const blogId = req.query.id;
        
        
        if (!blogId) return apiResponse.errorMessage(res, 400, "Blog Id is Required");

        const checkBlog = `SELECT * FROM blog_posts WHERE id = ?`;
        
        const [blog] :any = await pool.query(checkBlog, [blogId]);

        if (blog.length ===0) return apiResponse.errorMessage(res, 400, "Blog Not Found");
        
        apiResponse.successResponse(res, "Data Found",blog[0])
        
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}
