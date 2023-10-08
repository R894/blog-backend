import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Comment from "../models/comment";
import Post from "../models/post";
import User from "../models/user";
const { body, validationResult } = require("express-validator");

export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().exec();
  if (comments.length === 0) {
    res.status(404).json({ message: "Comments not found" });
    return;
  }
  res.status(200).json(comments);
});

export const createComment = [
  body('content').exists().withMessage('Content is required'),

  asyncHandler(async (req: Request, res: any) => {
      const errors = validationResult(req);
      const postId = req.params.id;
      if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
      }

      const { title, content } = req.body;
      const post = await Post.findById(postId);
      if(!post){
        res.status(404).json({message:"post not found"});
        return;
      }
      const comment = new Comment({ user: req.user, content: content });
      console.log(req.user);
      await comment.save();
      post.comments.push(comment._id);
      await post.save();

      res.status(200).json("Comment created successfully");
  }),
];

export function getCommentById(arg0: string, getCommentById: any) {
  throw new Error("Function not implemented.");
}

export function updateComment(arg0: string, arg1: any, updateComment: any) {
  throw new Error("Function not implemented.");
}

export function deleteComment(arg0: string, arg1: any, deleteComment: any) {
  throw new Error("Function not implemented.");
}
