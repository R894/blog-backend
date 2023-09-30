import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
const { body, validationResult } = require("express-validator");
import bcrypt from 'bcryptjs';
import User from '../models/user';

// Create a new User (POST)
export const createUser = [
    body('username')
        .exists()
        .withMessage('Username is required')
        .isLength({ min:5, max:20 })
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric and between 5-20 characters'),

    body('password')
        .exists()
        .withMessage('Password is required')
        .isLength({ min:6 })
        .withMessage('Username must be at least 6 characters long'),

    body('email').isEmail(),

    asyncHandler(async (req: Request, res: Response)=> {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const userExists = await User.findOne({ username: req.body.username });
        const emailExists = await User.findOne({ email: req.body.email })
        if(userExists){
            res.status(409).json({ error: 'Username already exists.' });
            return;
        }
        if(emailExists){
            res.status(409).json({ error: 'Email already exists.' });
            return;
        }

        // Hash the password before saving it
        const saltRounds = 10; // Adjust the number of salt rounds as needed
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        req.body.password = hashedPassword;

        const user = new User(req.body);
        await user.save();

        res.status(201).json({ message: 'User created successfully.' });
    }),
];

// List all Users (GET)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({}, '_id username').exec();
    if(!users || users.length === 0){
        res.status(404).json({message: "No users found"});
        return;
    }
    res.status(200).json(users);
});

// Get a specific User by ID (GET)
export const getUserByID = asyncHandler(async (req: Request, res: Response) => {
    const userExists = await User.findById(req.params.id, '_id username');
    if(!userExists){
        res.status(404).json({message: "No user found"});
        return;
    }
    res.status(200).json(userExists);
});

// Update a specific User by ID (PATCH)
export const updateUserByID = [
    body('username')
        .isLength({min:5, max:20})
        .withMessage('Username must be between 5 and 20 characters long')
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric'),

    body('email')
        .isEmail(),

    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),

    asyncHandler(async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json(errors.array);
            return;
        }

        const userExists = await User.findById(req.params.id, '_id username');
        if(!userExists){
            res.status(404).json({message: "No user found"});
            return;
        }

        await User.findByIdAndUpdate(req.params.id, req.body);
        const updatedUser = await User.findById(req.params.id, '_id username');
        res.status(200).json(updatedUser);
    }),
];
