import express, { Request, Response, Router } from 'express';
import * as userController from '../controllers/userController';
const router: Router = Router();

// List all Users (GET)
router.get('/', userController.getUsers);

// Create a new User (POST)
router.post('/', userController.createUser);

// Get a specific User by ID (GET)
router.get('/:id', userController.getUserByID);

// Update a specific User by ID (PATCH)
router.patch('/:id', userController.updateUserByID);

// Delete a specific User by ID (DELETE)
router.delete('/:id', userController.deleteUserByID);

export default router;
