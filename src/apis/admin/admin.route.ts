import {Router} from "express";

// import authRouter from './controller/auth/index';
import membershipRouter from "./controller/membership/index";
import resumeRouter from "./controller/resume";
import settingRouter from "./controller/setting";

const adminRoute = Router();

// indexRoute.use('/auth', authRouter);
adminRoute.use('/membership', membershipRouter);
adminRoute.use('/resume', resumeRouter);
adminRoute.use('/setting', settingRouter);

export default adminRoute;
