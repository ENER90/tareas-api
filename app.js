require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
connectDB();
const app = express();
const port = 3000
const Persona = require('./models/persona');
app.use(express.json());

// let personas = [
//     {id: 1, name: "Leo", age: 34},
//     {id: 2, name: "Ener", age: 34},
//     {id: 3, name: "Pedri", age: 35},
// ]

//listar personas
app.get(`/personas`, async (_req, res) => {
    const personas = await Persona.find()
    res.json(personas);
});

//buscar personas por id
app.get(`/personas/:id`, async (req, res) => {
    const persona = await Persona.findById(req.params.id);
    res.json(persona);
});

//crear nueva persona
app.post(`/personas`, async (req, res) => {
    const newPersona = new Persona(req.body);
    await newPersona.save();
    res.status(201).json(newPersona);
});

//editar persona por id
app.put(`/personas/:id`, async (req, res) => {
    const updatePersona = await Persona.findByIdAndUpdate(req.params.id, req.body);
    res.json(updatePersona);
});

//eliminar persona por id
app.delete(`/personas/:id`, async (req, res) => {
    await Persona.findByIdAndDelete(req.params.id);
    res.send();
});

//inicializar servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});