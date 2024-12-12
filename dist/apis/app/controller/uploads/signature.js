"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSignatures = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../../../helper/response"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/signatures/');
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
        console.log(file);
    }
});
const upload = (0, multer_1.default)({ storage }).single('signature');
const uploadSignatures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return apiResponse.errorMessage(res, 400, 'Error uploading file');
        }
        // const userId = req.body.user_id;
        const file = req.file;
        // if (!userId || !file) {
        //     console.log(userId, file);
        //     return apiResponse.errorMessage(res, 400, "User id and signature file are required");
        // }
        // const [rows]: any = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
        // if (rows.length === 0) {
        //     return res.status(404).json({ message: 'User not found' });
        // }
        const signatureUrl = `/uploads/signatures/${file.filename}`;
        try {
            const [result] = yield db_1.default.query('INSERT INTO user_signatures (user_id, signature_url) VALUES (?, ?)', [null, signatureUrl]);
            return apiResponse.successResponse(res, "Signature uploaded successfully", {
                signature: signatureUrl
            });
        }
        catch (error) {
            console.log(error);
            return apiResponse.errorMessage(res, 400, "Something went wrong");
        }
    }));
});
exports.uploadSignatures = uploadSignatures;
exports.default = exports.uploadSignatures;
