require('dotenv').config();
const personaRouter = require('./routes/persona');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

//Middleware para gestionar Personas
app.use('/personas', personaRouter);

// Middleware para manejar errores de JSON malformado
app.use((error, _req, res, next) => {
  if(error instanceof SyntaxError && error.status === 400 && 'body' in error){
    return res.status(400).json({ error: "Invalid JSON"});
  }
  next();
});

//Middleware global de manejo de errores
app.use((err, _req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something wrong, try again'})
});

//inicializar servidor
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});