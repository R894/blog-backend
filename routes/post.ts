import express, { Request, Response, Router } from 'express';
import * as postController from '../controllers/postController';
const router: Router = Router();

// Get all posts (GET)
router.get('/', postController.getAllPosts);

// Create new post (POST)
router.post('/', postController.createPost);

// Get specific post by ID (GET)
router.get('/:id', postController.getPostById);

// Update specific post by ID (PATCH)
router.patch('/:id', postController.updatePostById);

// Delete specific post by ID (DELETE)
router.delete('/:id', postController.deletePostById);


export default router;
