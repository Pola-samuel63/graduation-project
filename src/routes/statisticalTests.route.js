import express from 'express';
import { processFile, uploadFile } from '../utils/file.util';
import { single_t_test } from '../controllers/statisticalTests.controller';

const router = express.Router();

router.post('/upload', uploadFile(), processFile(), (req, res) => {
  try {
    res.json({ message: 'Upload successful', files: req.body.files });
  } catch (error) {
    res.json({ message: error.message, error: error });
  }
});

router.post('/single-t-test', single_t_test);

export default router;
