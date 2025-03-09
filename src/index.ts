import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { IDestination } from './types/destination.types';

// Import routes
import destinationRoutes from './routes/destination.routes';
import userRoutes from './routes/user.routes';
import gameRoutes from './routes/game.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize Prisma client
export const prisma = new PrismaClient();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Load destinations from JSON file
const destinationsFilePath = path.join(__dirname, '..', 'data', 'destinations.json');
let destinations: IDestination[] = [];

try {
  if (fs.existsSync(destinationsFilePath)) {
    const destinationsData = fs.readFileSync(destinationsFilePath, 'utf8');
    destinations = JSON.parse(destinationsData);
    console.log(`Loaded ${destinations.length} destinations from destinations.json`);
  } else {
    console.warn('destinations.json file not found');
  }
} catch (error) {
  console.error('Error loading destinations:', error);
}

// Make destinations available app-wide
app.locals.destinations = destinations;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Globetrotter API is running',
    destinationsLoaded: destinations.length
  });
});

// Register routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
}); 