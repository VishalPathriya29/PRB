import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const secretKey:any = process.env.SECRET;

export function authenticatingToken(req:Request, res : Response, next :NextFunction){
    const authHeaders = req.headers['authorization'];
    const token =  authHeaders?.split(" ")[1];

    if(token === null || token === undefined){
        return res.status(401).json({
            status: false,
            data: null,
            message: "Unauthorized access!",
          });
    }
    
    jwt.verify(token, secretKey, async (err:any, user:any) => {
        if(err){
            return res.status(401).json({
                status: false,
                data: null,
                message: "Unauthorized access!",
              });
        }
        res.locals.jwt = user;
        next();
    })
}