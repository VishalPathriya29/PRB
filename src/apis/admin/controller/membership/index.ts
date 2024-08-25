import {Router} from "express";

import * as membershipController from './membership';

import {authenticatingToken} from '../../../../middleware/authorization';
import * as adminValidation from '../../../../middleware/admin.validation';

const membershipRouter = Router();

membershipRouter.post('/membership', authenticatingToken, adminValidation.addMembershipValidation, membershipController.addMembership);
membershipRouter.get('/membership', authenticatingToken, membershipController.membershipList);

export default membershipRouter;
