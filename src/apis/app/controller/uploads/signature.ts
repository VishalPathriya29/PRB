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

const upload = multer({ storage }).single('signature'); 
export const uploadSignatures = async (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            console.log(err);
            return apiResponse.errorMessage(res, 400, 'Error uploading file');
        }

        const userId = req.body.user_id;
        const file = req.file;
        if (!userId || !file) {
            console.log(userId, file);
            return apiResponse.errorMessage(res, 400, "User id and signature file are required");
        }

        const [rows]: any = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const signatureUrl = `/uploads/signatures/${file.filename}`;
        try {
            const [result] = await pool.query(
                'INSERT INTO user_signatures (user_id, signature_url) VALUES (?, ?)',
                [userId, signatureUrl]
            );
            return apiResponse.successResponse(res, "Signature uploaded successfully", {
                signature: signatureUrl
            });
        } catch (error) {
            console.log(error);
            return apiResponse.errorMessage(res, 400, "Something went wrong");
        }
    });
};

export default uploadSignatures;
