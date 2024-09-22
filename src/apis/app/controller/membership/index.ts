import {Router} from "express";

import * as membershipController from './membership';

import {authenticatingToken} from '../../../../middleware/authorization';
import * as validation from '../../../../middleware/validation';

const membershipRouter = Router();

membershipRouter.get('/membership', membershipController.membershipList);
membershipRouter.post('/purchase', authenticatingToken, validation.purchaseMembershipValidation, membershipController.purchaseMembership);
membershipRouter.post('/createOrder', authenticatingToken, validation.createOrderValidation, membershipController.createOrder);

export default membershipRouter;