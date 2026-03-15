import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const processImage = async (inputPath: string, category: string): Promise<string> => {
  try {
    let width, height, fit;
    switch (category) {
      case 'profile':
        width = 400; height = 400; fit = sharp.fit.cover;
        break;
      case 'project':
      case 'blog':
        width = 1200; height = 630; fit = sharp.fit.cover;
        break;
      case 'content':
      default:
        width = 1920; height = 1080; fit = sharp.fit.inside;
        break;
    }

    const dir = category || 'content';
    const filename = `${uuidv4()}-${Date.now()}.webp`;
    const outputPath = path.join(path.dirname(inputPath), filename);

    await sharp(inputPath)
      .resize({ width, height, fit })
      .webp({ quality: category === 'content' ? 80 : 85 })
      .toFile(outputPath);

    // Delete the temporary file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    return `/uploads/${dir}/${filename}`;
  } catch (error) {
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    throw error;
  }
};

export const deleteImage = async (relativePath: string): Promise<void> => {
  try {
    if (!relativePath || !relativePath.startsWith('/uploads/')) return;
    
    // Construct absolute path from relative path
    const basePath = process.env.UPLOADS_BASE_PATH || '/srv/uploads';
    const cleanPath = relativePath.replace('/uploads', '');
    const absolutePath = path.join(basePath, cleanPath);
    
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`✅ Deleted file: ${absolutePath}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting file ${relativePath}:`, error);
  }
};
