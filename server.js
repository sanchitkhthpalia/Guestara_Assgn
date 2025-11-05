import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

// Route modules
import categoryRoutes from './routes/category.js';
import subcategoryRoutes from './routes/subcategory.js';
import itemRoutes from './routes/item.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Root route for convenience on hosted environments
app.get('/', (req, res) => {
  return res.status(200).json({
    name: 'Guestara Menu Backend',
    status: 'ok',
    docs: 'See README for API usage',
    health: '/health',
    api: '/api',
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/items', itemRoutes);

// Not found handler
app.use((req, res, next) => {
  return res.status(404).json({ error: 'Route not found' });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  // Provide structured error response
  return res.status(status).json({ error: message, details: err.details || undefined });
});

// DB connection and server start
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/guestara';

async function start() {
  try {
    // StrictQuery to reduce deprecation warnings and better filter behavior
    mongoose.set('strictQuery', true);

    await mongoose.connect(MONGO_URI, {
      dbName: 'guestara',
    });

    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
