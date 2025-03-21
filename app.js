require("dotenv").config();
const personRouter = require("./routes/person");
const taskRouter = require("./routes/task");
const express = require("express");
const connectDB = require("./db");
connectDB();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

//Middleware para gestionar Personas
app.use("/people", personRouter);

//Middleware para gestionar Tasks
app.use("/tasks", taskRouter);

// Middleware para manejar errores de JSON malformado
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next();
});

//Middleware global de manejo de errores
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something wrong, try again" });
});

//inicializar servidor
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
