require('dotenv').config();
const personaRouter = require('./routes/persona');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.use(`/personas`, personaRouter);

//inicializar servidor
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});