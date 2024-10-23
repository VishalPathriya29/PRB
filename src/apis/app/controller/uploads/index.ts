import {Router} from "express";

import * as uploadSignatures from './signature';

const uploadRouter = Router();

uploadRouter.post('/uploadSignature', uploadSignatures.uploadSignatures);

export default uploadRouter;