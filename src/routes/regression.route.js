import express from 'express';
import { linearReg } from '../controllers/regression.controller';

const router = express.Router();

router.get('/linear', linearReg);

export default router;
