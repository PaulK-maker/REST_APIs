// Mock data for comments
const comments = [];

// Function to get all comments
const getAllComments = () => comments;

// Function to create a new comment
const createComment = (newComment) => {
  comments.push(newComment);
  return newComment;
};

// Function to get a comment by ID
const getCommentById = (id) => comments.find((comment) => comment.id === parseInt(id));

module.exports = {
  getAllComments,
  createComment,
  getCommentById,
};