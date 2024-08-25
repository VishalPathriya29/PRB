import {Router} from "express";

import * as authController from './auth';

import {authenticatingToken} from '../../../../middleware/authorization';
import * as validation from '../../../../middleware/validation';

const authRouter = Router();

authRouter.post('/register', validation.registrationValidation, authController.register);
authRouter.post('/login', validation.loginValidation, authController.login);
authRouter.post('/forgotPassword', authController.forgotPassword);
authRouter.patch('/resetPassword', authenticatingToken, authController.changePassword);

export default authRouter;
