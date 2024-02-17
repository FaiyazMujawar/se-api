import { NextFunction, Request, Response, Router } from 'express';
import { UploadedFile } from 'express-fileupload';
import { uploadFile } from '../services/upload';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image = req.files.image as UploadedFile;
    const url = await uploadFile(image);
    return res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

export default router;
