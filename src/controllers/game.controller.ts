import { Request, Response } from 'express';
import { IDestination, IVerifyAnswerRequest } from '../types/destination.types';
import * as GameService from '../services/game.service';

// Type guard for errors with a message property
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' && 
    error !== null && 
    'message' in error && 
    typeof (error as any).message === 'string'
  );
}

/**
 * Get a random destination with clues for the game
 */
export const getRandomGame = (req: Request, res: Response) => {
  try {
    const destinations: IDestination[] = req.app.locals.destinations || [];
    
    if (destinations.length === 0) {
      return res.status(404).json({ message: 'No destinations available' });
    }
    
    // Get a random destination
    const destination = GameService.getRandomDestination(destinations);
    const { id, name } = destination;
    
    // Get random clues
    const clues = GameService.getRandomClues(destination);
    
    // Generate multiple choice options
    const choices = GameService.generateMultipleChoices(destinations, name);
    
    return res.json({
      id,
      clues,
      choices
    });
  } catch (error) {
    console.error('Error generating game:', error);
    return res.status(500).json({ message: 'Failed to generate game' });
  }
};

/**
 * Verify a user's answer and update their statistics
 */
export const verifyAnswer = async (req: Request, res: Response) => {
  try {
    const { destinationId, answer, userName } = req.body as IVerifyAnswerRequest;
    const destinations: IDestination[] = req.app.locals.destinations || [];
    
    // Verify the answer and update user stats if needed
    const result = await GameService.verifyAnswer(
      destinations,
      destinationId,
      answer,
      userName
    );
    console.log('result', result);
    return res.json(result);
  } catch (error) {
    if (isErrorWithMessage(error) && error.message === 'Destination not found') {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    console.error('Error verifying answer:', error);
    return res.status(500).json({ message: 'Failed to verify answer' });
  }
}; 