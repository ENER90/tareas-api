require("dotenv").config();
const personRouter = require("./src/routes/person");
const taskRouter = require("./src/routes/task");
const express = require("express");
const connectDB = require("./src/db");
connectDB();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// Middleware to manage People
app.use("/people", personRouter);

// Middleware to manage Tasks
app.use("/tasks", taskRouter);

// Middleware to handle malformed JSON errors
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next();
});

// Global error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something wrong, try again" });
});

// Initialize server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
