import {Router} from "express";

import * as templateController from './template';
import * as resumeController from './resume';

import {authenticatingToken} from '../../../../middleware/authorization';
import * as validation from '../../../../middleware/validation';

const resumeRouter = Router();

resumeRouter.post('/addResume', authenticatingToken, validation.addResumeValidation, resumeController.addResume);
resumeRouter.get('/resumes', authenticatingToken, resumeController.resumeList);
resumeRouter.patch('/updateResume', authenticatingToken, validation.updateResumeValidation, resumeController.updateResume);
resumeRouter.delete('/deleteResume', authenticatingToken, resumeController.deleteResume);

resumeRouter.get('/template', templateController.templateList);

export default resumeRouter;