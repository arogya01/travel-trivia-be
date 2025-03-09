// user.routes.ts
import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const router = Router();

// Get all users
router.get('/', UserController.getAllUsers);

// Get a user by ID
router.get('/:id', UserController.getUserById);

// Create a new user
router.post('/', UserController.createUser);

export default router;