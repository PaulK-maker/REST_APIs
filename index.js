const express = require("express"); // Import Express framework

const users = require("./routes/users"); // Import user routes 
const posts = require("./routes/posts"); // Import post routes

const comments = require("./routes/comments");  // Import comment routes from

const error = require("./utilities/error"); // Import error handling utility

const app = express(); // Create an instance of the Express app
const port = 3000; // Define the port the server will listen on

// Middleware to parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Routes for posts and comments, adding functionality to handle post and comment endpoints
app.use("/api/posts", posts);   // Mount the posts route at '/api/posts'
app.use("/api/comments", comments); // Mount the comments route at '/api/comments'

// Logging Middleware - logs information about incoming requests
app.use((req, res, next) => {
  const time = new Date(); // Get current date and time

  // Log the HTTP method, requested URL, and the time of the request
  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );

  
  // If the request contains a body, log the request data
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }

  next(); // Pass control to the next middleware or route handler

});

// Valid API Keys for authorization
const apiKeys = ["welcome", "pass", "enter"];


// Middleware to check for valid API keys for routes under '/api'
app.use("/api", (req, res, next) => {
  const key = req.query["api-key"]; // Get API key from the query string

  
  // If no API key is provided, return an error with status code 400
  if (!key) return next(error(400, "API Key Required"));
  
  // If the provided API key is not valid, return an error with status code 401
  if (!apiKeys.includes(key)) return next(error(401, "Invalid API Key"));

  req.key = key; // Store the API key in the request object for use in subsequent routes
  next(); // Pass control to the next middleware or route handler
});


// Use routes for users, posts, and comments
app.use("/api/users", users);
app.use("/api/posts", posts);

// HATEOAS Links: Provide links to relevant resources (Hypermedia as the engine of application state)
app.get("/", (req, res) => {
  res.json({
    links: [
      { href: "/api", rel: "api", type: "GET" },
    ],
  });
});
// API overview route: Lists the available endpoints (users, posts)
app.get("/api", (req, res) => {
  res.json({
    links: [
      { href: "api/users", rel: "users", type: "GET" }, // Link to GET users
      { href: "api/users", rel: "users", type: "POST" }, // Link to POST users
      { href: "api/posts", rel: "posts", type: "GET" }, // Link to GET posts
      { href: "api/posts", rel: "posts", type: "POST" },  // Link to POST posts
    ],
  });
});

// 404 Middleware -(resource not found)
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling Middleware-Handles all errors that occur during the request processing
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Start the Express server and listen for requests on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`); // Log a message to indicate the server is running
});