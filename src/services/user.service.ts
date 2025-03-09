import { PrismaClient } from '@prisma/client';
import { IUser } from '../types/destination.types';

const prisma = new PrismaClient();

/**
 * Get all users
 */
export const getAllUsers = async () => {
  return await prisma.user.findMany();
};


/** 
 * Get a user by username
 */
export const getUserByUsername = async (username: string) => {
  const res =  await prisma.user.findUnique({
    where: { username }
  });
  return res;
};

/**
 * Get a user by ID
 */
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id }
  });
};

/**
 * Create a new user
 */
export const createUser = async (username: string) => {
  return await prisma.user.create({
    data: {
      username,
      gamesPlayed: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    }
  });
};

/**
 * Update user statistics after a game
 */
export const updateUserStats = async (username: string, isCorrect: boolean) => {
  return await prisma.user.update({
    where: { username },
    data: {
      gamesPlayed: { increment: 1 },
      ...(isCorrect 
        ? { correctAnswers: { increment: 1 } } 
        : { incorrectAnswers: { increment: 1 } })
    }
  });
};

