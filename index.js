const express = require("express");

const users = require("./routes/users");
const posts = require("./routes/posts");

const error = require("./utilities/error");

const app = express();
const port = 3000;

// Parsing Middleware (using built-in Express parsers)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging Middleware with defensive checks
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }

  next();
});

// Valid API Keys.
const apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// API Key Middleware
app.use("/api", (req, res, next) => {
  const key = req.query["api-key"];

  if (!key) return next(error(400, "API Key Required"));
  if (!apiKeys.includes(key)) return next(error(401, "Invalid API Key"));

  req.key = key;
  next();
});

// Use Routes
app.use("/api/users", users);
app.use("/api/posts", posts);

// HATEOAS Links
app.get("/", (req, res) => {
  res.json({
    links: [
      { href: "/api", rel: "api", type: "GET" },
    ],
  });
});

app.get("/api", (req, res) => {
  res.json({
    links: [
      { href: "api/users", rel: "users", type: "GET" },
      { href: "api/users", rel: "users", type: "POST" },
      { href: "api/posts", rel: "posts", type: "GET" },
      { href: "api/posts", rel: "posts", type: "POST" },
    ],
  });
});

// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});