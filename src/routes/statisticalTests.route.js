import express from 'express';
import { processFile, uploadFile } from '../utils/file.util';
import { single_t_test } from '../controllers/statisticalTests.controller';

const router = express.Router();

router.post('/upload', uploadFile(), processFile(), (req, res) => {
  res.json({ message: 'Upload successful', files: req.body.files });
});

router.get('/single-t-test', single_t_test);

export default router;
