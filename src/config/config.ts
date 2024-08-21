import 'dotenv/config';

export default {
    smtp:{
        name:"",
        host:"", //process.env.SMTP_HOST, 
        secure: true,//true
        port: 465, //process.env.SMTP_PORT,//465
        secureConnection: false,
        // requireTLS: true,

        auth: {
            user: process.env.DB_HOST,
            pass: process.env.SMTP_PASSWORD,
        },  
        // tls: {
        //     // ciphers:'SSLv3',
        //     rejectUnauthorized: false
        // }
    },
}