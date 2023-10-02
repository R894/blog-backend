import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Comment from "../models/comment";
const { body, validationResult } = require("express-validator");

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().exec();
  if (comments.length === 0) {
    res.status(404).json({ message: "Posts not found" });
    return;
  }
  res.status(200).json(comments);
});
