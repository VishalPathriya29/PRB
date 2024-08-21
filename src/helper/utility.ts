import moment from "moment";
import 'moment-timezone';
import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
import 'dotenv/config';
import config from "../config/config";

const secretKey:any = process.env.SECRET 

export const utcDate = () => {
    const format = "YYYY-MM-DD HH:mm:ss";
    const date = new Date();
    date.setFullYear(date.getFullYear());

    const utc = moment(date).tz('utc').format(format);
    // const utc = moment(date).tz('Asia/Kolkata').format(format);
    return utc;
};

// ====================================================================================================
// ====================================================================================================

export const utcDateWithExtraTime = () => {
    const format = "YYYY-MM-DD HH:mm:ss";
    const date = new Date();
    date.setFullYear(date.getFullYear());

    const utc = moment().tz('utc').format(format);
    // const utc = moment(date).tz('Asia/Kolkata').format(format);
    return utc;
};

// ====================================================================================================
// ====================================================================================================


export const timeDiff = (storedTimestamp:any) => {
	const date = new Date();
	const currentTimestamp = moment(date, 'YYYY-MM-DD HH:mm:ss').tz('utc');
    storedTimestamp = moment(storedTimestamp, 'YYYY-MM-DD HH:mm:ss');
	const expirationDurationInMinutes = 5;

	// const minutesDifference = currentTimestamp.diff(storedTimestamp, 'minute');
	const duration = moment.duration(currentTimestamp.diff(storedTimestamp));
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
		return true
    }
    return false;
}

// ====================================================================================================
// ====================================================================================================

export const jwtGenerate = async (id: string) => {
    let token = jwt.sign({ userId: id }, secretKey, {
        expiresIn: "30d", // expires in 24 hours
    });
    return token;
};

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

export function randomString(length: number) {
	var text = "";
	var possibleChar = "abcdefghijklmnopqrstuvwxyz1234567890";
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possibleChar.length);
		text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
	}
	return text;
}

// ====================================================================================================
// ====================================================================================================

export function randomNumber(length: number) {
	var text = "";
	var possibleChar = "1234567890";
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possibleChar.length);
		text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
	}
	return Number(text);
}

// ====================================================================================================
// ====================================================================================================
