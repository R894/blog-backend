import express, { Request, Response, Router } from "express";
import * as postController from "../controllers/postController";
import passport from "passport";
import commentsRouter from "./comments";
const router: Router = Router();

// Get all posts (GET)
router.get("/", postController.getAllPosts);

// Create new post (POST)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);

// Get specific post by ID (GET)
router.get("/:id", postController.getPostById);

// Update specific post by ID (PATCH)
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postController.updatePostById
);

// Delete specific post by ID (DELETE)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postController.deletePostById
);

router.use("/:id/comments", commentsRouter);

export default router;
