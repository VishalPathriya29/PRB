import {Router} from "express";

import * as blogsController from './blogs';
import * as policyController from './policy';
import * as contactController from './ticket';
import * as faqController from './faq';

const settingRouter = Router();

settingRouter.get('/blog/list', blogsController.blogList);


settingRouter.get('/blog', blogsController.getBlogDetails);

settingRouter.get('/plolicy/list', policyController.policyList);
settingRouter.get('/legal/pages', policyController.getLegalPages);
settingRouter.get('/faqs', faqController.getFaqs);
settingRouter.post('/contact/createTicket', contactController.createTicket);

export default settingRouter;