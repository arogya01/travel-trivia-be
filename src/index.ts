import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { IDestination, IUser, IVerifyAnswerRequest } from './types/destination.types';

// Import routes (to be created later)
// import userRoutes from './routes/user.routes';
// import gameRoutes from './routes/game.routes';
// import challengeRoutes from './routes/challenge.routes';

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

// Routes (to be implemented)
// app.use('/api/users', userRoutes);
// app.use('/api/game', gameRoutes);
// app.use('/api/challenges', challengeRoutes);

// Destination endpoints
app.get('/api/destinations', (req, res) => {
  // Return destinations without exposing clues (to prevent cheating)
  const sanitizedDestinations = destinations.map(({ id, name, country, continent, category }) => ({
    id, name, country, continent, category
  }));
  res.json(sanitizedDestinations);
});

app.get('/api/destinations/:id', (req, res) => {
  const id = req.params.id;
  const destination = destinations.find(d => d.id === id);
  
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  
  // Return destination without exposing all clues (to prevent cheating)
  const { name, country, continent, category, facts } = destination;
  // Only return the first clue, as a sample
  const sampleClue = destination.clues.length > 0 ? destination.clues[0] : '';
  
  res.json({
    id, name, country, continent, category, facts,
    clue: sampleClue
  });
});

// Game endpoints
app.get('/api/game/random', (req, res) => {
  if (destinations.length === 0) {
    return res.status(404).json({ message: 'No destinations available' });
  }
  
  // Pick a random destination
  const randomIndex = Math.floor(Math.random() * destinations.length);
  const destination = destinations[randomIndex];
  
  // Return only necessary data (without exposing all clues)
  const { id, name, country, continent, category } = destination;
  
  // Pick a random clue (or two for variety)
  const clues = [];
  if (destination.clues.length > 0) {
    const clueIndex = Math.floor(Math.random() * destination.clues.length);
    clues.push(destination.clues[clueIndex]);
    
    // Add a second clue if available (and different from the first)
    if (destination.clues.length > 1) {
      let secondClueIndex;
      do {
        secondClueIndex = Math.floor(Math.random() * destination.clues.length);
      } while (secondClueIndex === clueIndex);
      clues.push(destination.clues[secondClueIndex]);
    }
  }
  
  // Generate multiple choices
  const choices = [name];
  while (choices.length < 4) {
    const randomDestIndex = Math.floor(Math.random() * destinations.length);
    const randomDestName = destinations[randomDestIndex].name;
    if (!choices.includes(randomDestName)) {
      choices.push(randomDestName);
    }
  }
  
  // Shuffle choices
  const shuffledChoices = choices.sort(() => Math.random() - 0.5);
  
  res.json({
    id,
    clues,
    choices: shuffledChoices
  });
});

app.post('/api/game/verify', async (req, res) => {
  const { destinationId, answer, userId } = req.body as IVerifyAnswerRequest;
  
  const destination = destinations.find(d => d.id === destinationId);
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  
  const isCorrect = destination.name === answer;
  
  // If a user ID is provided, update their statistics
  if (userId) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          gamesPlayed: { increment: 1 },
          ...(isCorrect 
            ? { correctAnswers: { increment: 1 } } 
            : { incorrectAnswers: { increment: 1 } })
        }
      });
      
      return res.json({
        isCorrect,
        fact: destination.facts[Math.floor(Math.random() * destination.facts.length)],
        user: {
          gamesPlayed: user.gamesPlayed,
          correctAnswers: user.correctAnswers,
          incorrectAnswers: user.incorrectAnswers
        }
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
      // Continue with response even if user update fails
    }
  }
  
  // Response without user statistics
  res.json({
    isCorrect,
    fact: destination.facts[Math.floor(Math.random() * destination.facts.length)]
  });
});

// User endpoints
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  
  try {
    const user = await prisma.user.create({
      data: {
        username,
        gamesPlayed: 0,
        correctAnswers: 0,
        incorrectAnswers: 0
      }
    });
    
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

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