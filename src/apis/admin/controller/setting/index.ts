import { Router } from "express";

import * as blogController from './blog';
import * as policyController from './policy';

import { authenticatingToken } from '../../../../middleware/authorization';
import * as adminValidation from '../../../../middleware/admin.validation';

const settingRouter = Router();

settingRouter.post('/blog/category', authenticatingToken, adminValidation.addBlogCategoryValidation, blogController.addBlogCategory);
settingRouter.get('/blog/categories', authenticatingToken, blogController.blogCategoryList);
settingRouter.patch('/blog/category', authenticatingToken, adminValidation.updateBlogCategoryValidation, blogController.updateBlogCategory);

settingRouter.post('/blogPost', authenticatingToken, adminValidation.addBlogValidation, blogController.addBlog);
settingRouter.get('/blogPosts', authenticatingToken, blogController.blogList);
settingRouter.patch('/blogPost', authenticatingToken, adminValidation.updateBlogValidation, blogController.updateBlog);

settingRouter.post('/policy', authenticatingToken, adminValidation.addPolicyValidation, policyController.addPolicy);
settingRouter.get('/policies', authenticatingToken, policyController.policyList);
settingRouter.patch('/policy', authenticatingToken, adminValidation.updatePolicyValidation, policyController.updatePolicy);

export default settingRouter;

