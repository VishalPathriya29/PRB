import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import * as apiResponse from '../helper/response'

const validationCheck = async (value: any) => {
    let msg = value.error.details[0].message;
    console.log(msg);

    msg = msg.replace(/"/g, "");
    msg = msg.replace('_', " ");
    msg = msg.replace('.', " ");

    const errorMessage = "Validation error : " + msg;
    return errorMessage;
}

// ===========================================================================

export const registrationValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(70).trim().required(),
        email: Joi.string().email().max(80).required(),
        password: Joi.string().min(3).max(30).required(),
        username: Joi.string().trim().min(2).max(50).required(),
        country: Joi.number().integer(),
        phone: Joi.string().trim().min(8).max(20).trim().required(),
        country_name: Joi.string().trim().allow(''),
        dial_code: Joi.string().required(),
        fcmToken: Joi.string().trim().required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
};

// ===========================================================================
// ===========================================================================
