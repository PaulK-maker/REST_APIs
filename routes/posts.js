const express = require("express");
const router = express.Router();
const { getPostsByUserId } = require("../data/posts"); // Import function to fetch posts

// GET /api/posts?userId=<VALUE>
router.get("/", async (req, res, next) => {
  try {
    const userId = req.query.userId; // Extract userId from query parameters

    if (!userId) {
      return res.status(400).json({ error: "userId query parameter is required." });
    }

    const posts = await getPostsByUserId(userId); // Fetch posts for the user

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "No posts found for this user." });
    }

    res.status(200).json(posts); // Send the posts as a response
  } catch (err) {
    next(err); // Pass errors to error-handling middleware
  }
});

module.exports = router;