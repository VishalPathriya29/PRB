import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import { utcDate } from '../../../../helper/utility';

export const addMembership = async (req: Request, res: Response) => {
    try {
        const { name, slug, details, prices } = req.body;
        const createdAt = utcDate();
        const packageDetails = details.toString();

        const checkMembership = `SELECT * FROM membership_plans WHERE slug = ?`;
        const [membership]: any = await pool.query(checkMembership, [slug]);
        if (membership.length > 0) return apiResponse.errorMessage(res, 400, "Membership Already Exist With This Slug");

        const sql = `INSERT INTO membership_plans (name, slug, details, created_at) VALUES (?, ?, ?, ?)`;
        const VALUES = [name, slug, packageDetails, createdAt];
        const [data]: any = await pool.query(sql, VALUES);

        if (data.affectedRows > 0) {
            const membershipId = data.insertId;
            const priceSql = `INSERT INTO membership_prices (membership_plan_id, name, currency, price, duration, created_at) VALUES ?`;
            const priceValues = prices.map((price: any) => [membershipId, price.price_name, price.currency, price.price, price.duration, createdAt]);
            await pool.query(priceSql, [priceValues]);

            return apiResponse.successResponse(res, "Membership Added Successfully", {});
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Add Membership, Please try again later")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// =======================================================================
// =======================================================================

export const membershipList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM membership_plans`;
        const [rows]: any = await pool.query(sql);

        const membershipList = `SELECT * FROM membership_prices`;
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

