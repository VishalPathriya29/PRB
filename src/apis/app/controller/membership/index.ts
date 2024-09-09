import {Router} from "express";

import * as membershipController from './membership';

import {authenticatingToken} from '../../../../middleware/authorization';

const membershipRouter = Router();

membershipRouter.get('/membership', membershipController.membershipList);

export default membershipRouter;