const express = require("express");
const router = express.Router();
const { getAllComments, createComment, getCommentById } = require("../data/comments");

// GET /comments - Retrieve all comments
router.get("/", (req, res) => {
  const allComments = getAllComments();
  res.status(200).json(allComments);
});

// POST /comments - Create a new comment
router.post("/", (req, res) => {
  const { userId, postId, body } = req.body;

  if (!userId || !postId || !body) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const newComment = {
    id: Date.now(), // Generate unique ID
    userId: parseInt(userId),
    postId: parseInt(postId),
    body,
  };

  const createdComment = createComment(newComment);
  res.status(201).json(createdComment);
});

// GET /comments/:id - Retrieve a specific comment by ID
router.get("/:id", (req, res) => {
  const comment = getCommentById(req.params.id);

  if (!comment) {
    return res.status(404).json({ error: "Comment not found." });
  }

  res.status(200).json(comment);
});

module.exports = router;