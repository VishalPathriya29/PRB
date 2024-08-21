import {Router} from "express";

import * as profileController from './profile';

import {authenticatingToken} from '../../middleware/authorization';
import * as validation from '../../middleware/validation';

const userRouter = Router();

userRouter.get('/profile', authenticatingToken, profileController.profile);
userRouter.put('/profile', authenticatingToken, validation.updateProfileValidation, profileController.updateProfile);

export default userRouter;
