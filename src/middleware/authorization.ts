import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const secret = process.env.SECRET_KEY;

export const authetocatingToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeaders = req.headers['authorization'];
    const token =  authHeaders?.split(" ")[1];

}