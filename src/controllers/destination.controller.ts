import { Request, Response } from 'express';
import { IDestination } from '../types/destination.types';
import * as DestinationService from '../services/destination.service';

/**
 * Get all destinations (sanitized without clues)
 */
export const getAllDestinations = (req: Request, res: Response) => {
  try {
    const destinations: IDestination[] = req.app.locals.destinations || [];
    const sanitizedDestinations = DestinationService.getAllDestinations(destinations);
    return res.json(sanitizedDestinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return res.status(500).json({ message: 'Failed to fetch destinations' });
  }
};

/**
 * Get a destination by ID (with limited clue info)
 */
export const getDestinationById = (req: Request, res: Response) => {
  try {
    const destinations: IDestination[] = req.app.locals.destinations || [];
    const destination = DestinationService.getDestinationById(destinations, req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    return res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return res.status(500).json({ message: 'Failed to fetch destination' });
  }
};