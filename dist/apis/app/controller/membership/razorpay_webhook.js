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
exports.razorpayWebhook = void 0;
const crypto_1 = __importDefault(require("crypto"));
const apiResponse = __importStar(require("../../../../helper/response"));
const utility = __importStar(require("../../../../helper/utility"));
// Razorpay Webhook Handler
const razorpayWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const webhookSecret = (_a = process.env.RAZORPAY_WEBHOOK_SECRET) !== null && _a !== void 0 ? _a : '';
        const receivedSignature = req.headers['x-razorpay-signature'];
        if (!webhookSecret) {
            console.error("Razorpay webhook secret not found");
            return apiResponse.errorMessage(res, 400, "Razorpay webhook secret not found");
        }
        const generatedSignature = crypto_1.default
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');
        if (generatedSignature !== receivedSignature) {
            console.error("Invalid webhook signature");
            return apiResponse.errorMessage(res, 400, "Invalid webhook signature");
        }
        const event = req.body;
        const resultz = {
            body: req.body,
            headers: req.headers,
        };
        const sendResponsez = yield utility.sendWebhokMail('Subscription webhook', resultz);
        console.log('Email Sent Response:', sendResponsez);
        return;
        // switch (event.event) {
        //     case 'order.paid':
        //         await handleOrderPaid(event.payload.payment.entity);
        //         await utility.sendMail('ruchimittal594@gmail.com', `test webhook ${event.payload.payment.entity}`, JSON.stringify(req.body))
        //         break;
        //     case 'payment.failed':
        //         await handlePaymentFailed(event.payload.payment.entity);
        //         await utility.sendMail('ruchimittal594@gmail.com', `test webhook ${event.payload.payment.entity}`, JSON.stringify(req.body))
        //         break;
        //     default:
        //         console.log(`Unhandled event type: ${event.event}`);
        // }
        // return apiResponse.successResponse(res,"Webhook success",event.payload);
    }
    catch (error) {
        console.error("Error in Razorpay webhook:", error);
        return apiResponse.errorMessage(res, 500, "Internal server error");
    }
});
exports.razorpayWebhook = razorpayWebhook;
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