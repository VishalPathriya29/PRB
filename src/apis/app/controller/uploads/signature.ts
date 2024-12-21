import e, { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import multer from 'multer';
import path from 'path';



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/signatures/');  
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);  
        console.log(file);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log("File being uploaded:", file);
        cb(null, true); 
    },
}).single('signature');


export const uploadSignatures = async (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            console.log("Upload error:", err);
            return apiResponse.errorMessage(res, 400, 'Error uploading file');
        }
    
        const file = req.file;
        if (!file) {
            console.log("File upload issue: req.file is undefined");
            return apiResponse.errorMessage(res, 400, "No file uploaded");
        }
    
        const signatureUrl = `/uploads/signatures/${file.filename}`;
        try {
            const [result] = await pool.query(
                'INSERT INTO user_signatures ( signature_url, type) VALUES (?, ?)',
                [ signatureUrl, "signature_url"]
            );
            return apiResponse.successResponse(res, "Signature uploaded successfully", {
                signature: signatureUrl
            });
        } catch (error) {
            console.log("Error uploading signature:", error);
            return apiResponse.errorMessage(res, 400, "Something went wrong");
        }
    });
    
};

export default uploadSignatures;
