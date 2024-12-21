import {Router} from "express";

import * as resumeController from './dashboard';

import {authenticatingToken} from '../../../../middleware/authorization';

const dashboardRouter = Router();

dashboardRouter.get('/getDashboard', authenticatingToken, resumeController.getDashboard);

export default dashboardRouter;