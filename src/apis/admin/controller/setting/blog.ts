import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import { utcDate } from '../../../../helper/utility';

// Add blog category
export const addBlogCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, image } = req.body;

        const sql = `INSERT INTO blog_categories (name, description, url) VALUES (?, ?, ?)`;
        const VALUES = [name, description, image];
        await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, "Category Added Successfully", {});
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

// Blog Category List
export const blogCategoryList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM blog_categories`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Category List", rows);
        } else {
            return apiResponse.successResponse(res, "No Category Found", []);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

// Update Blog Category
export const updateBlogCategory = async (req: Request, res: Response) => {
    try {
        const { cat_id, name, description, image } = req.body;

        const checkCategory = `SELECT category_id FROM blog_categories WHERE category_id = ?`;
        const [category]: any = await pool.query(checkCategory, [cat_id]);
        if (category.length === 0) return apiResponse.errorMessage(res, 400, "Category Not Found");

        const updateSql = `UPDATE blog_categories SET name = ?, description = ?, url = ? WHERE category_id = ?`;
        const VALUES = [name, description, image, cat_id];
        const [data]: any = await pool.query(updateSql, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Category Updated Successfully", {});
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Category, Please try again later")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

// Add Blog
export const addBlog = async (req: Request, res: Response) => {
    try {
        const { cat_id, slug, title, description, image } = req.body;

        const sql = `INSERT INTO blog_posts (cat_id, slug, title, description, image) VALUES (?, ?, ?, ?, ?)`;
        const VALUES = [cat_id, slug, title, description, image];
        await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, "Blog Added Successfully", {});
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}


// =======================================================================
// =======================================================================

// Blog List
export const blogList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM blog_posts`;
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

// Update Blog
export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { blog_id, cat_id, slug, title, description, image } = req.body;

        const checkBlog = `SELECT id FROM blog_posts WHERE id = ?`;
        const [blog]: any = await pool.query(checkBlog, [blog_id]);
        if (blog.length === 0) return apiResponse.errorMessage(res, 400, "Blog Not Found");

        const updateSql = `UPDATE blog_posts SET cat_id = ?, slug = ?, title = ?, description = ?, image = ? WHERE id = ?`;
        const VALUES = [cat_id, slug, title, description, image, blog_id];
        const [data]: any = await pool.query(updateSql, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Blog Updated Successfully", {});
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Blog, Please try again later")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================
