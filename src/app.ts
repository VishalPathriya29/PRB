import {Express} from 'express';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import apiRouter from "./apis/index.route";
import path from 'path'
// import { rateLimiterUsingThirdParty } from '../public';yyy
import cron from "node-cron";
import * as cronFn from "./apis/app/controller/cronJobs/packageCronJob";

export default (app: Express) => {


    app.use('/public', express.static(path.join(__dirname, '../public')));
    app.use('/uploads/signatures', express.static(path.join(__dirname, '../uploads/signatures')));
    app.use(express.json());
    app.use(express.urlencoded({extended: true, limit: '50mb'}));
    app.use(cors());
    app.use(compression());
    app.use(helmet());
    // app.use(morgan('dev'));

    app.use(morgan('common', {
        stream: fs.createWriteStream(__dirname+ '/access.log', {flags: 'a'})
    }));


    // app.use('/api', rateLimiterUsingThirdParty, apiRouter);
    app.use('/api', apiRouter);
    app.get('/', (req, res) => {
        res.status(200).json('OK');
    });
    app.use('*', (req, res) => {
        res.status(404).json({message: 'Resource not available'});
    })


    cron.schedule("0 1 * * *", async function() {
        console.log("Running a cron job");
        await cronFn.packageExpireCronJob();
        fs.appendFile("logs.txt", "running cron job every day (hh/mm/05)/n", function(err:any) {
            if (err) throw err;
        });
    }, {
        scheduled: true, //true/false
        timezone: "Asia/Kolkata"         
    });
    
    app.use((err: any, req: any, res: any, next: any) => {
        if(err){ 
            res.status(500).json({
                status: false, 
                message: "Something went wrong",
                error : err 
            });
        }
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({
            status: false,
            data: null,
            error: "Unexpected Error Occurred. Please contact our support team."
        });
    });
}
