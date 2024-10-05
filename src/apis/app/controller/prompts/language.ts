import { Request, Response } from "express";
import * as apiResponse from '../../../../helper/response';
import languages from "../../../../config/language.json";

export const getLanguageSuggestion = async (req: Request, res: Response) => {
    try {
        // const keyword = req.query.keyword as string;
        // if (!keyword) {
        //     return apiResponse.successResponse(res, "Type a word to get suggestions", []);
        // }
        const suggestions = languages.languages
        // .filter((lang: string) =>
        //     lang.toLowerCase().includes(keyword.toLowerCase())
        // );
        if (suggestions.length <= 0) {
            return apiResponse.successResponse(res, "No Data Found", []);
        } else {
            return apiResponse.successResponse(res, "Data fetch successfully", suggestions);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
};
