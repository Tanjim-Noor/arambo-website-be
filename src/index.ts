import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PORT, CORS_ORIGIN, isDevelopment } from './config';
import { connectToDatabase } from './database';
import propertyRoutes from './routes/property.routes';
import truckRoutes from './routes/truck.routes';
import tripRoutes from './routes/trip.routes';
import { errorHandler, notFoundHandler, requestLogger } from './middlewares/error.middleware';

// Create Express application
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS middleware
app.use(cors({
  origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Logging middleware
if (isDevelopment()) {
  app.use(morgan('dev'));
  app.use(requestLogger);
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api/properties', propertyRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/trips', tripRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Arambo Property API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/properties/health',
      properties: {
        create: 'POST /properties',
        list: 'GET /properties',
        getById: 'GET /properties/:id',
        update: 'PUT /properties/:id',
        stats: 'GET /properties/stats',
      },
    },
    documentation: 'See README.md for detailed API documentation',
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    api: 'Arambo Property API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await connectToDatabase();
    console.log('✅ MongoDB connection established');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 CORS enabled for: ${CORS_ORIGIN}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      
      if (isDevelopment()) {
        console.log(`🔧 Development mode - detailed logging enabled`);
        console.log(`📖 API documentation: http://localhost:${PORT}/`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

export default app;