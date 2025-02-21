import express from 'express';
import { processFile, uploadFile } from '../utils/file.util';

const router = express.Router();

router.post('/upload', uploadFile(), processFile(), (req, res) => {
  res.json({ message: 'Upload successful', files: req.body.files });
});

export default router;
