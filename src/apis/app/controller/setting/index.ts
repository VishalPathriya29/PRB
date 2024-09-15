import {Router} from "express";

import * as blogsController from './blogs';
import * as policyController from './policy';

import {authenticatingToken} from '../../../../middleware/authorization';
import * as validation from '../../../../middleware/validation';

const settingRouter = Router();

settingRouter.get('/blog/list', blogsController.blogList);

settingRouter.get('/plolicy/list', policyController.policyList);

export default settingRouter;