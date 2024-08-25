import {Router} from "express";

import authRouter from './controller/auth/index';
import userRouter from "./controller/users";
import membershipRouter from "./controller/membership";
import resumeRouter from "./controller/resume";

const appRoute = Router();

appRoute.use('/auth', authRouter);
appRoute.use('/users', userRouter);
appRoute.use('/membership', membershipRouter);  
appRoute.use('/resume', resumeRouter);

export default appRoute;
