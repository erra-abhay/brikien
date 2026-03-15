import { Request, Response } from 'express';
import { processImage, deleteImage as utilDeleteImage } from '../utils/image.utils';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No image file provided' });
      return;
    }

    const category = (req.query.category as string) || 'content';
    const filePath = req.file.path;
    
    // Process image: resize, convert to webp, delete tmp file, return relative URL
    const url = await processImage(filePath, category);

    res.json({ success: true, data: { url } });
  } catch (error: any) {
    console.error('Upload process error:', error);
    res.status(500).json({ success: false, error: error.message || 'Image processing failed' });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ success: false, error: 'URL is required' });
      return;
    }

    await utilDeleteImage(url);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete file' });
  }
};
