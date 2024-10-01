import {Router} from "express";

import * as blogsController from './blogs';
import * as policyController from './policy';
import * as contactController from './ticket';

import {authenticatingToken} from '../../../../middleware/authorization';
import * as validation from '../../../../middleware/validation';

const settingRouter = Router();

settingRouter.get('/blog/list', blogsController.blogList);


settingRouter.get('/blog', blogsController.getBlogDetails);

settingRouter.get('/plolicy/list', policyController.policyList);
settingRouter.get('/legal/pages', policyController.getLegalPages);
settingRouter.post('/contact/createTicket', contactController.createTicket);

export default settingRouter;