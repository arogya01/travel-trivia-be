import { IDestination } from '../types/destination.types';
import * as UserService from './user.service';

/**
 * Get a random destination
 */
export const getRandomDestination = (destinations: IDestination[]) => {
  if (destinations.length === 0) {
    throw new Error('No destinations available');
  }
  
  const randomIndex = Math.floor(Math.random() * destinations.length);
  return destinations[randomIndex];
};

/**
 * Generate a set of multiple choice options
 */
export const generateMultipleChoices = (destinations: IDestination[], correctAnswer: string) => {
  const choices = [correctAnswer];
  
  // Add 3 more unique choices
  while (choices.length < 4) {
    const randomDestIndex = Math.floor(Math.random() * destinations.length);
    const randomDestName = destinations[randomDestIndex].name;
    if (!choices.includes(randomDestName)) {
      choices.push(randomDestName);
    }
  }
  
  // Shuffle the choices
  return choices.sort(() => Math.random() - 0.5);
};

/**
 * Select random clue(s) from a destination
 */
export const getRandomClues = (destination: IDestination) => {
  const clues = [];
  
  if (destination.clues.length > 0) {
    // Get one random clue
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
  
  return clues;
};

/**
 * Check if an answer is correct and update user stats
 */
export const verifyAnswer = async (
  destinations: IDestination[],
  destinationId: string,
  answer: string,
  userName?: string
) => {
  const destination = destinations.find(d => d.id === destinationId);
  console.log('destination', destination);
  if (!destination) {
    throw new Error('Destination not found');
  }
  
  const isCorrect = destination.name === answer;
  let user = null;
  
  // Update user statistics if a user ID is provided
  if (userName) {
    user = await UserService.updateUserStats(userName, isCorrect);
  }
  
  // Get a random fact from the destination
  const randomFact = destination.facts[Math.floor(Math.random() * destination.facts.length)];
  
  return {
    isCorrect,
    fact: randomFact,
    user, 
    correctAnswer: destination.name
  };
}; 