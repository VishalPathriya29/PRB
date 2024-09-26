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

/** AUTH VALIDATIONS */

export const registrationValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(70).allow("", null),
        email: Joi.string().email().max(80).required(),
        password: Joi.string().min(3).max(30).required(),
        fcm_token: Joi.string().trim().required(),
        device_id: Joi.string().allow("", null),
        device_type: Joi.string().allow("", null),
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

export const loginValidation = async (req: Request,res: Response,next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().max(80).required(),
        password: Joi.string().min(3).max(30).required(),
        fcm_token: Joi.string().trim().required(),
        device_id: Joi.string().allow("", null),
        device_type: Joi.string().allow("", null),
    });
  
    const value = schema.validate(req.body);
  
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
};

// ===========================================================================
// ===========================================================================

/** USERS VALIDATIONS */
export const updateProfileValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(70).required(),
        phone: Joi.string().min(10).max(15).allow("", null),
        image: Joi.string().trim().allow("", null),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
}

// ===========================================================================
// ===========================================================================

/** RESUMES VALIDATIONS */
export const addResumeValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        resume_data: Joi.required(),
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

export const updateResumeValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        resume_id: Joi.number().required(),
        resume_data: Joi.required(),
    });
    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
}

// ===========================================================================
// ===========================================================================

// Purchase membership
export const purchaseMembershipValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        membership_plan_id: Joi.number().required(),
        payment_details: Joi.object({
            transaction_id: Joi.string().required(),
            payment_signature: Joi.string().required(),
            payment_timestamp: Joi.string().required(),
        }).required(),
    });
    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
}


// ===========================================================================
// ===========================================================================

// Generate Resume Validation
export const generateResumeValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        resume_id: Joi.number().required(),
        template_id: Joi.number().required(),
    });
    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.validationErrorWithData(res, errMsg);
    }
    next();
}

// ===========================================================================
// ===========================================================================

export const createOrderValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        amount: Joi.number().required(),
        currency: Joi.string().required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================
