import { Request, Response } from 'express';
import * as UserService from '../services/user.service';
import { isPrismaError } from '../utils/prisma';


/**
 * Get all users
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * Get a user by ID
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        console.log('username', username);
        const user = await UserService.getUserByUsername(username);
        return res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Failed to fetch user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const user = await UserService.getUserByUsername(username);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    }
    catch(error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Failed to fetch user' });
    }
}

/**
 * Create a new user
 */
export const createUser = async (req: Request, res: Response) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  const doesUserNameExists = await UserService.getUserByUsername(username);
  if(doesUserNameExists) {
    console.log('found username ??');
    return res.status(409).json({ message: 'Username already exists' });
  }
  try {
    const user = await UserService.createUser(username);    
    return res.status(201).json(user);
  } catch (error) {
    if (isPrismaError(error) && error.code === 'P2002') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Failed to create user' });
  }
};