import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import Post from "../models/post";
const { body, validationResult } = require("express-validator");

// Get all posts (GET)
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const posts = await Post.find().exec();
    if(posts.length === 0){
        res.status(404).json({message: 'Posts not found'});
        return;
    }
    res.status(200).json(posts);
});

// Create new post (POST)
export const createPost = [
    body('title').exists().withMessage('Title is required'),
    body('content').exists().withMessage('Content is required'),

    asyncHandler(async (req: Request, res: any) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { title, content } = req.body;
        const post = new Post({ title: title, content: content, author: req.user });
        post.save();
        res.status(200).json("Post created successfully");
    }),
];

// Get specific post by ID (GET)
export const getPostById = asyncHandler(async (req: Request, res: any) => {
    const post = await Post.findById(req.params.id).populate('author', 'username').populate({path: 'comments', populate: {path: 'user', select:'username'}});
    if(!post){
        res.status(404).json({message: 'Post not found'});
        return;
    }
    const postObject = post.toObject();
    res.status(200).json(post);
});

// Update specific post by ID (PATCH)
export const updatePostById = [
    body('title').optional().exists().withMessage('Title is required'),
    body('content').optional().exists().withMessage('Content is required'),

    asyncHandler(async (req: Request, res: any) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const id = req.params.id;
        const post = await Post.findById(id);

        if(!post){
            res.status(404).json({message: 'Post not found'});
            return;
        }
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(updatedPost);
    }),
];

// Delete specific post by ID (DELETE)
export const deletePostById = asyncHandler(async (req: any, res: Response) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        res.status(404).json({message: 'Post not found'});
        return;
    }

    if(post.author.toString() !== req.user._id.toString()){
        res.status(403).json({message: 'Cannot delete a post that doesnt belong to you'})
        return;
    }

    await Post.findByIdAndRemove(req.params.id);
    res.status(204).send();
});