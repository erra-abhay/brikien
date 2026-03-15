import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // Reduced to 5 minutes
  max: 20, // Increased to 20
  message: { success: false, error: 'Too many login attempts, please try again after 5 minutes' }
});

export const contactLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // Reduced to 30 minutes
  max: 10, // Increased to 10
  message: { success: false, error: 'Too many messages sent, please try again later' }
});

export const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // Reduced to 5 minutes
  max: 1000, // Increased significantly for development
  message: { success: false, error: 'Too many API requests, please try again later' }
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Reduced to 15 minutes
  max: 50, // Increased to 50
  message: { success: false, error: 'Upload limit exceeded, please try again later' }
});
