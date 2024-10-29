"use strict";
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
exports.uploadImage = exports.randomNumber = exports.randomString = exports.jwtGenerate = exports.timeDiff = exports.utcDateWithExtraTime = exports.utcDate = void 0;
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import nodemailer from "nodemailer";
require("dotenv/config");
const secretKey = process.env.SECRET;
const utcDate = () => {
    const format = "YYYY-MM-DD HH:mm:ss";
    const date = new Date();
    date.setFullYear(date.getFullYear());
    const utc = (0, moment_1.default)(date).tz('utc').format(format);
    // const utc = moment(date).tz('Asia/Kolkata').format(format);
    return utc;
};
exports.utcDate = utcDate;
// ====================================================================================================
// ====================================================================================================
const utcDateWithExtraTime = () => {
    const format = "YYYY-MM-DD HH:mm:ss";
    const date = new Date();
    date.setFullYear(date.getFullYear());
    const utc = (0, moment_1.default)().tz('utc').format(format);
    // const utc = moment(date).tz('Asia/Kolkata').format(format);
    return utc;
};
exports.utcDateWithExtraTime = utcDateWithExtraTime;
// ====================================================================================================
// ====================================================================================================
const timeDiff = (storedTimestamp) => {
    const date = new Date();
    const currentTimestamp = (0, moment_1.default)(date, 'YYYY-MM-DD HH:mm:ss').tz('utc');
    storedTimestamp = (0, moment_1.default)(storedTimestamp, 'YYYY-MM-DD HH:mm:ss');
    const expirationDurationInMinutes = 5;
    // const minutesDifference = currentTimestamp.diff(storedTimestamp, 'minute');
    const duration = moment_1.default.duration(currentTimestamp.diff(storedTimestamp));
    console.log("duration", JSON.stringify(duration));
    const minutesDifference = duration.asMinutes();
    console.log("currentTimestamp", currentTimestamp);
    console.log("storedTimestamp", storedTimestamp);
    console.log("minutesDifference", minutesDifference);
    console.log("expirationDurationInMinutes", expirationDurationInMinutes);
    if (minutesDifference <= expirationDurationInMinutes) {
        console.log("minutesDifference", minutesDifference);
        console.log("expirationDurationInMinutes", expirationDurationInMinutes);
        // if (userOTP === storedOTP.otp) {
        //     return true; // OTP is valid and not expired
        // }
        return true;
    }
    return false;
};
exports.timeDiff = timeDiff;
// ====================================================================================================
// ====================================================================================================
const jwtGenerate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let token = jsonwebtoken_1.default.sign({ userId: id }, secretKey, {
        expiresIn: "30d", // expires in 24 hours
    });
    return token;
});
exports.jwtGenerate = jwtGenerate;
// ====================================================================================================
// ====================================================================================================
// export const sendMail = async (email: string, subject: string, message: string) => {
// 	let result:any;
// 	try {
// 		// create reusable transporter object using the default SMTP transport
// 		let transporter = nodemailer.createTransport(config.smtp);
// 		// send mail with defined transport object
// 		let info = await transporter.sendMail({
// 			from: "noreply@bosone.com", // sender address
// 			to: email, // list of receivers
// 			subject: subject, // Subject line
// 			text: message, // plain text body
// 			html: "", // html body
// 		})
// 		result = info.messageId;
// 		console.log("Message sent: %s", info.messageId);
// 		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// 		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
// 	} catch (err) {
// 		console.log("error", err);
// 		result = false;
// 		throw err;
// 	}
// 	return result;
// };
// ====================================================================================================
// ====================================================================================================
function randomString(length) {
    var text = "";
    var possibleChar = "abcdefghijklmnopqrstuvwxyz1234567890";
    for (var i = 0; i < length; i++) {
        var sup = Math.floor(Math.random() * possibleChar.length);
        text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
    }
    return text;
}
exports.randomString = randomString;
// ====================================================================================================
// ====================================================================================================
function randomNumber(length) {
    var text = "";
    var possibleChar = "1234567890";
    for (var i = 0; i < length; i++) {
        var sup = Math.floor(Math.random() * possibleChar.length);
        text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
    }
    return Number(text);
}
exports.randomNumber = randomNumber;
function uploadImage() {
}
exports.uploadImage = uploadImage;
// ====================================================================================================
// ====================================================================================================
