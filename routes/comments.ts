import express from "express";
import * as commentController from "../controllers/commentController";
import passport from "passport";

const router = express.Router({ mergeParams: true });

// List all comments for a specific post (GET)
router.get("/", commentController.getAllComments);

// Create a new comment for a specific post (POST)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  commentController.createComment
);

// Get a specific comment by ID (GET)
router.get("/:commentId", commentController.getCommentById);

// Update a specific comment by ID (PATCH)
router.patch(
  "/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentController.updateComment
);

// Delete a specific comment by ID (DELETE)
router.delete(
  "/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentController.deleteComment
);

export default router;
