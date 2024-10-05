import {Router} from "express";

import authRouter from './controller/auth/index';
import userRouter from "./controller/users";
import membershipRouter from "./controller/membership";
import resumeRouter from "./controller/resume";
import settingRouter from "./controller/setting";
import promptsRouter from "./controller/prompts";

const appRoute = Router();

appRoute.use('/auth', authRouter);
appRoute.use('/users', userRouter);
appRoute.use('/membership', membershipRouter);  
appRoute.use('/resume', resumeRouter);
appRoute.use('/setting', settingRouter);
appRoute.use('/prompts', promptsRouter);

export default appRoute;
