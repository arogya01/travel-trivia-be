// Types for working with the static destinations.json file

export interface IDestination {
  id: string;
  name: string;
  country: string;
  continent: string;
  category: string[];
  clues: string[];
  facts: string[];
}

// For generating clues with difficulty levels in the application
export interface IClueWithDifficulty {
  content: string;
  difficulty: number; // 1: Easy, 2: Medium, 3: Hard
}

// User data structure (matches the database model)
export interface IUser {
  id?: string;
  username: string;
  gamesPlayed: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

// Game verification request
export interface IVerifyAnswerRequest {
  destinationId: string;
  answer: string;
  userId?: string;
}

export interface IClue {
  id: string;
  content: string;
  difficulty: number; // 1: Easy, 2: Medium, 3: Hard
  destinationId: string;
}

export interface IFact {
  id: string;
  content: string;
  destinationId: string;
}

export interface IDestinationInput {
  name: string;
  country: string;
  continent: string;
  category: string[];
  clues: {
    content: string;
    difficulty: number;
  }[];
  facts: {
    content: string;
  }[];
}

// For bulk import from the JSON file mentioned in the PRD
export interface IDestinationImport {
  id?: string;
  name: string;
  country: string;
  continent: string;
  category: string[];
  clues: string[];
  facts: string[];
} 