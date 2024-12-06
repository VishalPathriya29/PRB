import { Request, Response, urlencoded } from "express";
import crypto from "crypto";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';
import config from '../../../../config/config';


// Package Expire Cron Job Handler

export const packageExpireCronJob = async () => {
    try {

        const created_at = utility.dateWithFormat();
        
        const currentDate: any = await utility.getTimeAndDate();
        
        const date = currentDate[0];
        const time = currentDate[1];


        const sql = `SELECT user_id FROM user_packages WHERE DATE_FORMAT(end_date, "%Y-%m-%d") = '${date}'`;
        const [rows]: any = await pool.query(sql);
      

        for (const iterator of rows) {
            const updateSql = `UPDATE user_packages SET package_slug = ?, package_status = ?, updated_at = ? WHERE id = ?`;
            const values = [null, config.PACKAGE_STATUS.INACTIVE, created_at, iterator.user_id];
            const [data]: any = await pool.query(updateSql, values);            
        }
        
    } catch (error) {
        console.log(error);
    }
}