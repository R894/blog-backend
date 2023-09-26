import express, { Request, Response, Router } from 'express';
import * as tagController from '../controllers/tagController';

const router: Router = Router();

// List all Tags (GET)
router.get('/', tagController.getAllTags);

// Create new Tag (POST)
router.post('/', tagController.createTag);

// Get specific Tag by ID (GET)
router.get('/:id', tagController.getTagById);

// Update specific Tag by ID (PATCH)
router.patch('/:id', tagController.updateTag);

// Delete specific Tag by ID (DELETE)
router.delete('/:id', tagController.deleteTag);

export default router;
