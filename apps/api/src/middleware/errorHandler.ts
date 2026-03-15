import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, error: err.message });
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    res.status(409).json({ success: false, error: `${field} already exists` });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ success: false, error: 'File size limit exceeded (max 10MB)' });
      return;
    }
    res.status(400).json({ success: false, error: err.message });
    return;
  }

  res.status(500).json({ success: false, error: 'Internal server error' });
};
