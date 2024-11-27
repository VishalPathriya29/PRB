import { Request, Response, urlencoded } from "express";
import crypto from "crypto";
import pool from "../../../../db";
import * as apiResponse from '../../../../helper/response';
import * as utility from '../../../../helper/utility';

// Razorpay Webhook Handler
export const razorpayWebhook = async (req: Request, res: Response) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
        const receivedSignature = req.headers['x-razorpay-signature'] as string;
        
        


        const generatedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (generatedSignature !== receivedSignature) {
            console.error("Invalid webhook signature");
            return apiResponse.errorMessage(res, 400 ,"Invalid webhook signature");
        }

        const event = req.body;

        switch (event.event) {
            case 'order.paid':
                await handleOrderPaid(event.payload.payment.entity);
                await utility.sendMail('ruchimittal594@gmail.com', `test webhook ${event.payload.payment.entity}`, JSON.stringify(req.body))
                break;

            case 'payment.failed':
                await handlePaymentFailed(event.payload.payment.entity);
                await utility.sendMail('ruchimittal594@gmail.com', `test webhook ${event.payload.payment.entity}`, JSON.stringify(req.body))
                
                break;
                
            default:
                console.log(`Unhandled event type: ${event.event}`);
        }

        return apiResponse.successResponse(res,"Webhook success",event.payload);
    } catch (error) {
        console.error("Error in Razorpay webhook:", error);
        return apiResponse.errorMessage(res,500 ,"Internal server error");
    }
};


const handleOrderPaid = async (payment: any) => {
    try {
        const { id: transactionId, amount, currency, order_id: orderId, status } = payment;
        const sql = `UPDATE gateway_created_orders SET transaction_id = ?, payment_status = ?, updated_at = ? WHERE gateway_order_id = ?`;
        const values = [transactionId, status, utility.utcDate(), orderId];
        await pool.query(sql, values);
        console.log("Order payment successful:", transactionId);
    } catch (error) { 
        console.error("Error processing 'order.paid' event:", error);
    }
};


const handlePaymentFailed = async (payment: any) => {
    try {
        const { id: transactionId, error_code, error_description, order_id: orderId } = payment;

        const sql = `UPDATE gateway_created_orders SET payment_status = 'failed', error_code = ?, error_message = ?, updated_at = ? WHERE gateway_order_id = ?`;
        const values = [error_code, error_description, utility.utcDate(), orderId];
        await pool.query(sql, values);

        console.error("Payment failed:", transactionId);
    } catch (error) {
        console.error("Error processing 'payment.failed' event:", error);
    }
};
