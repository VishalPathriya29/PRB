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

/** MEMBERSHIP VALIDATIONS */

export const addMembershipValidation = async (req: Request,res: Response,next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(70).required(),
        slug: Joi.string().trim().min(3).max(70).required(),
        details: Joi.array().required(),
        prices: Joi.array().items({
            price_name: Joi.string().required(),
            currency: Joi.string().required(),
            price: Joi.number().required(),
            duration: Joi.number().required()
        }),
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

export const addTemplateValidation = async (req: Request,res: Response,next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(70).required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        html: Joi.string().required(),
        css: Joi.string().required(),
    });
    const value = schema.validate(req.body);
    
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}

// ===========================================================================
// ===========================================================================

export const updateTemplateValidation = async (req: Request,res: Response,next: NextFunction) => {
    const schema = Joi.object({
        templateId: Joi.number().required(),
        name: Joi.string().trim().min(3).max(70).required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        html: Joi.string().required(),
        css: Joi.string().required(),
    });
    const value = schema.validate(req.body);
  
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}

// ===========================================================================
// ===========================================================================

export const addBlogCategoryValidation = async (req: Request,res: Response,next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(70).required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
    });
    const value = schema.validate(req.body);
  
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}

// ===========================================================================
// ===========================================================================

export const updateBlogCategoryValidation = async (req: Request,res: Response,next: NextFunction) => {
    const schema = Joi.object({
        cat_id: Joi.number().required(),
        name: Joi.string().trim().min(3).max(70).required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
    });
    const value = schema.validate(req.body);
  
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}

// ===========================================================================
// ===========================================================================

export const addBlogValidation = async (req: Request,res: Response,next: NextFunction) => {
    const schema = Joi.object({
        cat_id: Joi.number().required(),
        slug: Joi.string().trim().min(3).max(70).required(),
        title: Joi.string().trim().min(3).max(70).required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
    });
    const value = schema.validate(req.body);
  
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}

// ===========================================================================
// ===========================================================================

export const updateBlogValidation = async (req: Request,res: Response,next: NextFunction) => {
    const schema = Joi.object({
        blog_id: Joi.number().required(),
        cat_id: Joi.number().required(),
        slug: Joi.string().trim().min(3).max(70).required(),
        title: Joi.string().trim().min(3).max(70).required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
    });
    const value = schema.validate(req.body);
  
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}

// ===========================================================================
// ===========================================================================

