import {Router} from "express";

import authRouter from './auth/index';
import userRouter from "./users";

const indexRoute = Router();

indexRoute.use('/auth', authRouter);
indexRoute.use('/users', userRouter);

export default indexRoute;
