import {Router} from "express";

import adminRouter from './admin/admin.route';
import appRouter from './app/app.route';

const indexRoute = Router();

indexRoute.use('/admin/v1', adminRouter);
indexRoute.use('/v1', appRouter);

export default indexRoute;
