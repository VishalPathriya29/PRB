"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlog = exports.blogList = exports.addBlog = exports.updateBlogCategory = exports.blogCategoryList = exports.addBlogCategory = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
// Add blog category
const addBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, image } = req.body;
        const sql = `INSERT INTO blog_categories (name, description, url) VALUES (?, ?, ?)`;
        const VALUES = [name, description, image];
        yield db_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Category Added Successfully", {});
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.addBlogCategory = addBlogCategory;
// =======================================================================
// =======================================================================
// Blog Category List
const blogCategoryList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM blog_categories`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Category List", rows);
        }
        else {
            return apiResponse.successResponse(res, "No Category Found", []);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.blogCategoryList = blogCategoryList;
// =======================================================================
// =======================================================================
// Update Blog Category
const updateBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cat_id, name, description, image } = req.body;
        const checkCategory = `SELECT category_id FROM blog_categories WHERE category_id = ?`;
        const [category] = yield db_1.default.query(checkCategory, [cat_id]);
        if (category.length === 0)
            return apiResponse.errorMessage(res, 400, "Category Not Found");
        const updateSql = `UPDATE blog_categories SET name = ?, description = ?, url = ? WHERE category_id = ?`;
        const VALUES = [name, description, image, cat_id];
        const [data] = yield db_1.default.query(updateSql, VALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Category Updated Successfully", {});
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Category, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.updateBlogCategory = updateBlogCategory;
// =======================================================================
// =======================================================================
// Add Blog
const addBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cat_id, slug, title, description, image } = req.body;
        const sql = `INSERT INTO blog_posts (cat_id, slug, title, description, image) VALUES (?, ?, ?, ?, ?)`;
        const VALUES = [cat_id, slug, title, description, image];
        yield db_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Blog Added Successfully", {});
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.addBlog = addBlog;
// =======================================================================
// =======================================================================
// Blog List
const blogList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM blog_posts`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Blog List", rows);
        }
        else {
            return apiResponse.successResponse(res, "No Blog Found", []);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.blogList = blogList;
// =======================================================================
// =======================================================================
// Update Blog
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blog_id, cat_id, slug, title, description, image } = req.body;
        const checkBlog = `SELECT id FROM blog_posts WHERE id = ?`;
        const [blog] = yield db_1.default.query(checkBlog, [blog_id]);
        if (blog.length === 0)
            return apiResponse.errorMessage(res, 400, "Blog Not Found");
        const updateSql = `UPDATE blog_posts SET cat_id = ?, slug = ?, title = ?, description = ?, image = ? WHERE id = ?`;
        const VALUES = [cat_id, slug, title, description, image, blog_id];
        const [data] = yield db_1.default.query(updateSql, VALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Blog Updated Successfully", {});
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Blog, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.updateBlog = updateBlog;
// =======================================================================
// =======================================================================
