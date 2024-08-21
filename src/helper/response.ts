import { Request, Response } from "express";

export const successResponse = async  (res:Response, msg:String , data:any) => {
	var resData = {
		status: true,
		data: data,
		message: msg,
	};
	return res.status(200).json(resData);
}

// ====================================================================================================
// ====================================================================================================

export const successResponseWithCreated = async  (res:Response, msg:String , data:any) => {
    var resData = {
        status: true,
        data: data,
        message: msg,
    };
    return res.status(201).json(resData);
}

// ====================================================================================================
// ====================================================================================================

export const validationErrorWithData = async (res:Response, msg:String) => {
	var resData = {
		status: false,
        error : msg,
		data: null,
		// message: null
	};
	return res.status(400).json(resData);
}

// ====================================================================================================
// ====================================================================================================
	
export const errorMessage = async (res:Response, statusCode:number ,msg:string) => {
	return res.status(statusCode).json({
		status:false,
        error: msg,
		data:null,
		// message:msg
	})
}

// ====================================================================================================
// ====================================================================================================

export const somethingWentWrongMsg = async (res:Response) => {
	return res.status(400).json({
		status:false,
		error:"Something went wrong",
		data:null,
	})
}

// ====================================================================================================
// ====================================================================================================

export const successResponseWithPagination = async  (res:Response, msg:String , data:any, totalPage:number, currentPage:number, totalLength:number) => {
	var resData = {
		status: true,
		data: data,
		paginationData: {totalPage, currentPage, totalLength},
		message: msg,
	};
	return res.status(200).json(resData);
}

// ====================================================================================================
// ====================================================================================================

export const unauthorizedMsg = async  (res:Response) => {
	var resData = {
		status: false,
		data: null,
		error: "Unauthorized access!",
	};
	return res.status(401).json(resData);
}

// ====================================================================================================
// ====================================================================================================
