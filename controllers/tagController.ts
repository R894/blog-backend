import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Tag from "../models/tag";
const { body, validationResult } = require("express-validator");

// Create new Tag
export const createTag = [
    body('name').notEmpty().withMessage('Name is required').isString(),
    body('description').isString(),

    asyncHandler(async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const name = req.body.name;
        const description = req.body.description;
        console.log(`Attempting ${name} ${description}`);

        const existingTag = await Tag.findOne({name: name}).exec();

        if(existingTag){
            res.status(400).json({ errors: [{ msg: 'Tag already exists' }] });
            return;
        }

        const newTag = new Tag({name: name, description: description});
        await newTag.save();
        res.sendStatus(201);
    })
];

// Get all Tags
export const getAllTags = asyncHandler(async (req: Request, res: Response) => {
    const allTags = await Tag.find();
    res.json(allTags);
    
});

// Get Tag by ID
export const getTagById = asyncHandler(async (req: Request, res: Response) => {
    const tag = await Tag.findById(req.params.id);
    if(tag){
        res.json(tag);
    }else{
        res.status(404).json()
    }
});

// Update Tag by ID (PATCH)
export const updateTag = [
    body('name').notEmpty().withMessage('Name is required').isString(),

    asyncHandler(async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const tagId = req.params.id;
        const tag = await Tag.findById(tagId)

        if(tag){
            await Tag.findByIdAndUpdate(tagId, req.body);
            const updatedTag = await Tag.findById(tagId);
            res.json(updatedTag);
        }

        res.status(404).json({errors:{ msg: 'Tag not found' }});
    })
];

// Delete Tag by ID
export const deleteTag = asyncHandler(async (req: Request, res: Response) => {

    const existingTag = await Tag.findById(req.params.id).exec();

    if(existingTag){
        await Tag.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});