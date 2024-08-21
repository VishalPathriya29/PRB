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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.changePassword = exports.forgotPassword = exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../../db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const apiResponse = __importStar(require("../../helper/response"));
const utility = __importStar(require("../../helper/utility"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, device_id, device_type, fcm_token } = req.body;
        const createdAt = utility.utcDate();
        const sql = `SELECT email FROM users WHERE deleted_at IS NULL AND email = '${email}' LIMIT 1`;
        const [rows] = yield db_1.default.query(sql);
        const dupli = [];
        if (rows.length > 0) {
            // if (rows[0].email === email) {
            //     dupli.push("email");
            // }
            // const msg = `${dupli.join()} is Already used, Please change it`;
            return apiResponse.errorMessage(res, 400, 'Email is Already used, Please change it');
        }
        bcryptjs_1.default.hash(password, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
            }
            else {
                const registerSql = `INSERT INTO users(name, email, password, fcm_token, device_id, device_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                const VALUES = [name, email, hash, fcm_token, device_id, device_type, createdAt];
                const [data] = yield db_1.default.query(registerSql, VALUES);
                if (data.affectedRows > 0) {
                    const userQuery = `SELECT * FROM users WHERE email = '${email}' AND deleted_at IS NULL limit 1`;
                    const [userData] = yield db_1.default.query(userQuery);
                    if (userData.length > 0) {
                        let token = yield utility.jwtGenerate(userData[0].id);
                        delete userData[0].password;
                        delete userData[0].id;
                        return res.status(200).json({
                            status: true,
                            token,
                            data: userData[0],
                            message: "Congratulations, Registered Successfully!!`"
                        });
                    }
                    else {
                        return apiResponse.errorMessage(res, 400, "User Not Registered, try again");
                    }
                }
                else {
                    return apiResponse.errorMessage(res, 400, "Failed to Register, Please try again later");
                }
            }
        }));
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.register = register;
// ====================================================================================================
// ====================================================================================================
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, device_id, device_type, fcm_token } = req.body;
        const createdAt = utility.utcDate();
        const sql = `SELECT * FROM users WHERE email = '${email}' AND deleted_at IS NULL limit 1`;
        const [rows] = yield db_1.default.query(sql);
        let checkEmail = rows;
        const userDetail = checkEmail[0];
        if (checkEmail.length > 0) {
            const hashedPassword = checkEmail[0].password;
            bcryptjs_1.default.compare(password, hashedPassword, (err, isMatch) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    return apiResponse.errorMessage(res, 400, "Failed to login, Please try");
                if (isMatch) {
                    let token = yield utility.jwtGenerate(checkEmail[0].id);
                    const sql = `UPDATE users SET device_id = ?, device_type = ?, fcm_token = ? WHERE id = ?`;
                    const val = [device_id, device_type, fcm_token, checkEmail[0].id];
                    const [rows] = yield db_1.default.query(sql, val);
                    if (rows.affectedRows > 0) {
                        delete userDetail.password;
                        delete userDetail.id;
                        return res.status(200).json({
                            status: true,
                            token,
                            data: userDetail,
                            message: "Successfully logged in !"
                        });
                    }
                    else {
                        return apiResponse.errorMessage(res, 400, "Something went wrong");
                    }
                }
                if (!isMatch) {
                    return apiResponse.errorMessage(res, 400, "Unfortunately, Email and Password is incorrect!!");
                }
            }));
        }
        else {
            return apiResponse.errorMessage(res, 400, "Email not registered with us, please sign up");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somethng Went Wrong");
    }
});
exports.login = login;
// ====================================================================================================
// ====================================================================================================
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        if (!email)
            return yield apiResponse.errorMessage(res, 400, "Email required");
        const emailCheckSql = `SELECT email, id FROM users WHERE email = '${email}' AND deleted_at IS NULL LIMIT 1`;
        const [data] = yield db_1.default.query(emailCheckSql);
        if (data.length > 0) {
            const tempPass = utility.randomString(8);
            bcryptjs_1.default.hash(tempPass, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
                const updatePassSql = `Update users Set password = '${hash}' where id = ${data[0].id} `;
                const [updatePassword] = yield db_1.default.query(updatePassSql);
                if (updatePassword.affectedRows > 0) {
                    // await sendMail( email, "Password Reset", "You have requested a new password here it is: " + tempPass);
                    return yield apiResponse.successResponse(res, `Check your mail inbox for new Password`, tempPass);
                }
                else {
                    return yield apiResponse.errorMessage(res, 400, "Something Went Wrong, Please Try again later");
                }
            }));
        }
        else {
            return apiResponse.errorMessage(res, 400, "Email Not Registered with us");
        }
    }
    catch (e) {
        console.log(e);
        return yield apiResponse.errorMessage(res, 400, "Smething went wrong");
    }
});
exports.forgotPassword = forgotPassword;
// ====================================================================================================
// ====================================================================================================
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { oldPassword, newPassword } = req.body;
        const sql = `SELECT password from users WHERE id = ${userId}`;
        const [data] = yield db_1.default.query(sql);
        const hashedPassword = data[0].password;
        if (data.length > 0) {
            bcryptjs_1.default.compare(oldPassword, hashedPassword, (err, isMatch) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return apiResponse.errorMessage(res, 400, "Failed to login, Please try again or Contact support team");
                }
                if (isMatch) {
                    bcryptjs_1.default.hash(newPassword, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                        if (err)
                            return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
                        const updatePassSql = `Update users Set password = ? where id = ?`;
                        const VALUES = [hash, userId];
                        const [updatePassword] = yield db_1.default.query(updatePassSql, VALUES);
                        if (updatePassword.affectedRows > 0) {
                            return yield apiResponse.successResponse(res, "Password updated successfully !", null);
                        }
                        else {
                            return yield apiResponse.errorMessage(res, 400, "Something Went Wrong, Please Try again later");
                        }
                    }));
                }
                if (!isMatch) {
                    return apiResponse.errorMessage(res, 400, "Wrong old password !!");
                }
            }));
        }
        else {
            return apiResponse.errorMessage(res, 400, "User not found !");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.changePassword = changePassword;
// ====================================================================================================
// ====================================================================================================
