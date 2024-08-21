"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorizedMsg = exports.successResponseWithPagination = exports.somethingWentWrongMsg = exports.errorMessage = exports.validationErrorWithData = exports.successResponseWithCreated = exports.successResponse = void 0;
const successResponse = (res, msg, data) => __awaiter(void 0, void 0, void 0, function* () {
    var resData = {
        status: true,
        data: data,
        message: msg,
    };
    return res.status(200).json(resData);
});
exports.successResponse = successResponse;
// ====================================================================================================
// ====================================================================================================
const successResponseWithCreated = (res, msg, data) => __awaiter(void 0, void 0, void 0, function* () {
    var resData = {
        status: true,
        data: data,
        message: msg,
    };
    return res.status(201).json(resData);
});
exports.successResponseWithCreated = successResponseWithCreated;
// ====================================================================================================
// ====================================================================================================
const validationErrorWithData = (res, msg) => __awaiter(void 0, void 0, void 0, function* () {
    var resData = {
        status: false,
        error: msg,
        data: null,
        // message: null
    };
    return res.status(400).json(resData);
});
exports.validationErrorWithData = validationErrorWithData;
// ====================================================================================================
// ====================================================================================================
const errorMessage = (res, statusCode, msg) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(statusCode).json({
        status: false,
        error: msg,
        data: null,
        // message:msg
    });
});
exports.errorMessage = errorMessage;
// ====================================================================================================
// ====================================================================================================
const somethingWentWrongMsg = (res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(400).json({
        status: false,
        error: "Something went wrong",
        data: null,
    });
});
exports.somethingWentWrongMsg = somethingWentWrongMsg;
// ====================================================================================================
// ====================================================================================================
const successResponseWithPagination = (res, msg, data, totalPage, currentPage, totalLength) => __awaiter(void 0, void 0, void 0, function* () {
    var resData = {
        status: true,
        data: data,
        paginationData: { totalPage, currentPage, totalLength },
        message: msg,
    };
    return res.status(200).json(resData);
});
exports.successResponseWithPagination = successResponseWithPagination;
// ====================================================================================================
// ====================================================================================================
const unauthorizedMsg = (res) => __awaiter(void 0, void 0, void 0, function* () {
    var resData = {
        status: false,
        data: null,
        error: "Unauthorized access!",
    };
    return res.status(401).json(resData);
});
exports.unauthorizedMsg = unauthorizedMsg;
// ====================================================================================================
// ====================================================================================================
