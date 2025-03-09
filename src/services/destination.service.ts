import { IDestination } from '../types/destination.types';

/**
 * Get all destinations (sanitized without clues)
 */
export const getAllDestinations = (destinations: IDestination[]) => {
  return destinations.map(({ id, name, country, continent, category }) => ({
    id, name, country, continent, category
  }));
};

/**
 * Get a destination by ID (with limited clue info)
 */
export const getDestinationById = (destinations: IDestination[], id: string) => {
  const destination = destinations.find(d => d.id === id);
  
  if (!destination) {
    return null;
  }
  
  // Return destination with only one sample clue
  const { name, country, continent, category, facts } = destination;
  const sampleClue = destination.clues.length > 0 ? destination.clues[0] : '';
  
  return {
    id,
    name,
    country,
    continent,
    category,
    facts,
    clue: sampleClue
  };
}; 