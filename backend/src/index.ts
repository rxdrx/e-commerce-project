import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// Import routes
import analyticsRoutes from './routes/analytics';
import productsRoutes from './routes/products';
import ordersRoutes from './routes/orders';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' })); // CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.info(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server (only if not being imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.info('='.repeat(50));
    console.info(`🚀 Server running on port ${PORT}`);
    console.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.info(`🔗 API URL: http://localhost:${PORT}`);
    console.info('='.repeat(50));
  });
}

export default app;
