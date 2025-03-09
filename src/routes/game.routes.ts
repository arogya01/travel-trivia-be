import { Router } from "express";
import * as GameController from '../controllers/game.controller';

const router = Router();

// Get a random destination with clues
router.get('/random', GameController.getRandomGame);

// Verify a user's answer
router.post('/verify', GameController.verifyAnswer);

export default router; 