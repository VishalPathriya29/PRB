import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';
import Razorpay from "razorpay"
import crypto from 'crypto';

export const membershipList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT id, name, slug, details FROM membership_plans WHERE status = 1`;
        const [rows]: any = await pool.query(sql);

        const membershipList = `SELECT membership_plan_id, name, currency, price, duration FROM membership_prices WHERE status = 1`;
        const [prices]: any = await pool.query(membershipList);
        let index = -1;
        for (const iterator of rows) {
            index++;
            rows[index].details = iterator.details.split(',');

            const priceList = prices.filter((price: any) => price.membership_plan_id === iterator.id);
            rows[index].prices = priceList;
        };

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Membership List", rows);
        } else {
            return apiResponse.successResponse(res, "No Membership Found", []);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

// Purchase Membership
export const purchaseMembership = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;

        // payment_details:- { transaction_id, payment_signature, payment_timestamp }
        const { membership_plan_id, payment_details } = req.body;
        const created_at = utility.utcDate();

        const membershipSql = `SELECT id, name, currency, price FROM membership_prices WHERE id = ? AND status = 1`;
        const [membership]: any = await pool.query(membershipSql, [membership_plan_id]);

        const sql = `INSERT INTO payment_details (user_id, membership_plan_id, transaction_id, payment_signature, payment_timestamp, amount, currency, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [userId, membership_plan_id, payment_details.transaction_id, payment_details.payment_signature, payment_details.payment_timestamp, membership?.price ?? 0, 'INR', created_at];

        // const sql = `INSERT INTO user_memberships (membership_plan_id, user_id, transaction_id, payment_status, amount, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
        // await pool.query(sql, [membership_plan_id, user_id, transaction_id, payment_status, payment_response, created_at]);

        return apiResponse.successResponse(res, "Membership Purchased Successfully", []);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const { amount, currency } = req.body;
        let instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID ?? '',
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

 
        const options = {
            amount: parseInt((amount * 100).toFixed(0)),
            currency: currency,
            receipt: `receipt_${Date.now()}`,
        }
        // const options = {
        //     amount: amount,
        //     currency: currency,
        //     receipt: receipt,
        //     payment_capture: payment_capture
        // }

        console.log(options, "opeionss");
        

        instance.orders.create(options, async (err: any, order: any) => {
            if (err) {
                console.log("err", err);
                return apiResponse.errorMessage(res, 400, "Failed to generate Razorpay order");
            }
            const resultResp = {
                gatewayOrderId: order.id,
            };
            const sql = `INSERT INTO gateway_created_orders(user_id, gateway_order_id, amount, currency, gateway_name, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [userId, order.id, amount, currency, 'razorpay', utility.utcDate()];
            const [rows]: any = await pool.query(sql, values);

            return apiResponse.successResponse(res, "Razorpay order generated successfully", resultResp);
        });
        // return apiResponse.successResponse(res, "Razorpay order generated successfully", {});
    } catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMsg(res);
    }
}

// ====================================================================================================
// ====================================================================================================


// =======================================================================
// =======================================================================

