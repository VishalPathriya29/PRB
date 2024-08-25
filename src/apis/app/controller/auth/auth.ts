import { Request, Response } from "express";
import pool from "../../../../db";
import bcrypt from 'bcryptjs';
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';

export const register =async (req:Request, res:Response) => {
    try {
        const {name, email, password, device_id, device_type, fcm_token} = req.body;
        const createdAt = utility.utcDate();
        
        const sql = `SELECT email FROM users WHERE deleted_at IS NULL AND email = '${email}' LIMIT 1`;
        const [rows]:any = await pool.query(sql);
        
        const dupli: any = [];
        if (rows.length > 0) {
            // if (rows[0].email === email) {
            //     dupli.push("email");
            // }
            // const msg = `${dupli.join()} is Already used, Please change it`;
            return apiResponse.errorMessage(res, 400, 'Email is Already used, Please change it');
        }
        
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
            } else {                
                const registerSql = `INSERT INTO users(name, email, password, fcm_token, device_id, device_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                const VALUES = [name, email, hash, fcm_token, device_id, device_type, createdAt];
                const [data]:any = await pool.query(registerSql, VALUES);

                if (data.affectedRows > 0) {                
                    const userQuery = `SELECT * FROM users WHERE email = '${email}' AND deleted_at IS NULL limit 1`;
                    const [userData]:any = await pool.query(userQuery);

                    if (userData.length > 0) {
                        let token = await utility.jwtGenerate(userData[0].id);
                        delete userData[0].password;
                        delete userData[0].id;
                        return res.status(200).json({
                            status: true,
                            token,
                            data: userData[0],
                            message: "Congratulations, Registered Successfully!!`"
                        })
                    } else{
                        return apiResponse.errorMessage(res, 400, "User Not Registered, try again")
                    }
                } else {
                    return apiResponse.errorMessage(res, 400, "Failed to Register, Please try again later")
                }
            }
        });
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// ====================================================================================================
// ====================================================================================================

export const login =async (req:Request, res:Response) => {
    try {
        const { email, password, device_id, device_type, fcm_token } = req.body;
        const createdAt = utility.utcDate();

        const sql = `SELECT * FROM users WHERE email = '${email}' AND deleted_at IS NULL limit 1`;
        const [rows] = await pool.query(sql)
        let checkEmail:any = rows;
        const userDetail:any = checkEmail[0];
        
        if(checkEmail.length > 0){
            const hashedPassword = checkEmail[0].password;
            bcrypt.compare(password, hashedPassword, async(err, isMatch) => {
                if (err) return apiResponse.errorMessage(res, 400, "Failed to login, Please try")
                if (isMatch) {
                    let token = await utility.jwtGenerate(checkEmail[0].id);
                    
                    const sql = `UPDATE users SET device_id = ?, device_type = ?, fcm_token = ? WHERE id = ?`;
                    const val = [device_id, device_type, fcm_token, checkEmail[0].id];
                    const [rows]:any = await pool.query(sql, val);
                    
                    if(rows.affectedRows > 0) { 
                        delete userDetail.password;
                        delete userDetail.id;
                        
                        return res.status(200).json({
                            status:true,
                            token,
                            data:userDetail,
                            message:"Successfully logged in !"
                        })
                    } else {
                        return apiResponse.errorMessage(res, 400, "Something went wrong");
                    }
                }
                if (!isMatch) {
                    return apiResponse.errorMessage(res, 400, "Unfortunately, Email and Password is incorrect!!");
                }
            })
        }
        else {
            return apiResponse.errorMessage(res, 400, "Email not registered with us, please sign up");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somethng Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const forgotPassword = async (req: Request, res: Response) => {
    try{
        const email: string = req.body.email;
        if (!email) return await apiResponse.errorMessage(res, 400, "Email required");
        
        const emailCheckSql = `SELECT email, id FROM users WHERE email = '${email}' AND deleted_at IS NULL LIMIT 1`;
        const [data]:any = await pool.query(emailCheckSql)
                
        if (data.length > 0) {
            const tempPass = utility.randomString(8);
            bcrypt.hash(tempPass, 10, async (err, hash) => {
                if (err) return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
            
                const updatePassSql = `Update users Set password = '${hash}' where id = ${data[0].id} `;
                const [updatePassword]:any = await pool.query(updatePassSql)
                if (updatePassword.affectedRows > 0) {
                    // await sendMail( email, "Password Reset", "You have requested a new password here it is: " + tempPass);
                    return await apiResponse.successResponse(res, `Check your mail inbox for new Password`,tempPass );
                } else {
                    return await apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
                }
            })
        } else {
            return apiResponse.errorMessage(res, 400, "Email Not Registered with us");
        }
    }catch(e){
        console.log(e);
        return await apiResponse.errorMessage( res, 400, "Smething went wrong");
    }
};

// ====================================================================================================
// ====================================================================================================

export const changePassword =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;        
        const {oldPassword, newPassword} = req.body;

        const sql = `SELECT password from users WHERE id = ${userId}`;
        const [data]:any = await pool.query(sql);

        const hashedPassword = data[0].password;
        if (data.length > 0) {
            bcrypt.compare(oldPassword, hashedPassword, async(err, isMatch) => {
                if (err) {
                    return apiResponse.errorMessage(res, 400, "Failed to login, Please try again or Contact support team")
                }
                if (isMatch) {
                    bcrypt.hash(newPassword, 10, async (err, hash) => {
                        if (err) return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
                        
                        const updatePassSql = `Update users Set password = ? where id = ?`;
                        const VALUES = [hash, userId]
                        const [updatePassword]:any = await pool.query(updatePassSql, VALUES)
                        
                        if (updatePassword.affectedRows > 0) {                    
                            return await apiResponse.successResponse(res,"Password updated successfully !", null);
                        } else {
                            return await apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
                        }
                    })
                }
                if (!isMatch) {
                    return apiResponse.errorMessage(res, 400, "Wrong old password !!");
                }    
            })
        } else{
            return apiResponse.errorMessage(res, 400, "User not found !")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
