import express from 'express';
import { linearReg } from '../controllers/regression.controller';

const router = express.Router();

router.post('/linear', linearReg);

export default router;
