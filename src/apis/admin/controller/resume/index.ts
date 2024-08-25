import { Router } from "express";

import * as templateController from './template';

import { authenticatingToken } from '../../../../middleware/authorization';
import * as adminValidation from '../../../../middleware/admin.validation';

const resumeRouter = Router();

resumeRouter.get('/template', authenticatingToken, templateController.templateList);
resumeRouter.post('/template', authenticatingToken, adminValidation.addTemplateValidation, templateController.addTemplate);
resumeRouter.put('/template', authenticatingToken, adminValidation.updateTemplateValidation, templateController.updateTemplate);

export default resumeRouter;

