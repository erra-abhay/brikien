import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { sanitizeBody } from './middleware/sanitize';
import { apiLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import dashboardRoutes from './routes/dashboard.routes';
import adminRoutes from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();
app.set('trust proxy', true);

// Security and middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [process.env.PUBLIC_WEB_URL || 'http://localhost:3000', process.env.ADMIN_URL || 'http://localhost:4000'],
  credentials: true
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(sanitizeBody);

// Serve uploads statically
app.use('/uploads', express.static(process.env.UPLOADS_BASE_PATH || '/srv/uploads', {
  maxAge: '1y',
  immutable: true
}));

// Apply general API rate limiter
app.use('/api', apiLimiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ API Server running on port ${PORT}`);
  });
});
