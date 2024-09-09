import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';

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
        const { membership_plan_id, payment_details } = req.body;
        const created_at = utility.utcDate();

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

