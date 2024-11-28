import { Request, Response, urlencoded } from "express";
import crypto from "crypto";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';
import config from '../../../../config/config';

// Razorpay Webhook Handler
export const razorpayWebhook = async (req: Request, res: Response) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';

        
        if (!webhookSecret) {
            console.error("Razorpay webhook secret not found");
            return apiResponse.errorMessage(res, 400 ,"Razorpay webhook secret not found");
        }

        const data = crypto.createHmac('sha256', webhookSecret)
        data.update(JSON.stringify(req.body))
        const digest = data.digest('hex')

        if (!(digest === req.headers['x-razorpay-signature'])) {
          console.log('Invalid signature',"req.headers:", req.headers['x-razorpay-signature']);
          return res.status(200).send('ok');
        }


        // const resultz = {
        //     body: req.body,
        //     headers: req.headers,
        //   };
      
        //   const sendResponsez = await utility.sendWebhokMail('Subscription webhook', resultz);
        //   console.log('Email Sent Response:', sendResponsez);
       
        //   return res.status(200).send('ok');


        const { AUTHORIZED, CAPTURED, FAILED, REFUNDED} = config.RAZORPAY_DETAIL.STATUS;
        const { PAID, PENDING} = config.PAYMENT_STATUS;
    
    
        const { id, order_id, status} = req.body.payload.payment.entity;


        let paymentStatus = "";

        if (status === CAPTURED || status === AUTHORIZED) paymentStatus = PAID;
        else if (status === FAILED)  paymentStatus = FAILED;
        else if(status === REFUNDED) paymentStatus = REFUNDED
        else  paymentStatus = PENDING;


        const updateOrder = `UPDATE gateway_created_orders SET payment_status = ?, order_status = ?, transaction_id = ? WHERE gateway_order_id = ? `;
        const updateOrderVal = [status, paymentStatus, id, order_id];
        const [rows]: any = await pool.query(updateOrder, updateOrderVal);


        return res.status(200).send('ok');

    } catch (error) {
        console.error("Error in Razorpay webhook:", error);
        return apiResponse.errorMessage(res,500 ,"Internal server error");
    }
};


// const handleOrderPaid = async (payment: any) => {
//     try {
//         const { id: transactionId, amount, currency, order_id: orderId, status } = payment;
//         const sql = `UPDATE gateway_created_orders SET transaction_id = ?, payment_status = ?, updated_at = ? WHERE gateway_order_id = ?`;
//         const values = [transactionId, status, utility.utcDate(), orderId];
//         await pool.query(sql, values);
//         console.log("Order payment successful:", transactionId);
//     } catch (error) { 
//         console.error("Error processing 'order.paid' event:", error);
//     }
// };


// const handlePaymentFailed = async (payment: any) => {
//     try {
//         const { id: transactionId, error_code, error_description, order_id: orderId } = payment;

//         const sql = `UPDATE gateway_created_orders SET payment_status = 'failed', error_code = ?, error_message = ?, updated_at = ? WHERE gateway_order_id = ?`;
//         const values = [error_code, error_description, utility.utcDate(), orderId];
//         await pool.query(sql, values);

//         console.error("Payment failed:", transactionId);
//     } catch (error) {
//         console.error("Error processing 'payment.failed' event:", error);
//     }
// };
