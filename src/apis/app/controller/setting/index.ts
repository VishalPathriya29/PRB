import {Router} from "express";

import * as blogsController from './blogs';

import {authenticatingToken} from '../../../../middleware/authorization';
import * as validation from '../../../../middleware/validation';

const settingRouter = Router();

settingRouter.get('/blog/list', blogsController.blogList);

export default settingRouter;