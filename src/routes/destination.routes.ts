import { Router } from "express";
import * as DestinationController from '../controllers/destination.controller';

const router = Router();

// Get all destinations (sanitized)
router.get('/', DestinationController.getAllDestinations);

// Get a specific destination
router.get('/:id', DestinationController.getDestinationById);

export default router; 