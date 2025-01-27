const express = require('express');
const connectDB = require('../db');
connectDB();
const Persona = require('../models/persona');
const personaRouter = express.Router(); 

//listar personas
personaRouter.get(``, async (_req, res) => {
    const personas = await Persona.find()
    res.json(personas);
});

//buscar personas por id
personaRouter.get(`/:id`, async (req, res) => {
    const persona = await Persona.findById(req.params.id);
    res.json(persona);
});

//crear nueva persona
personaRouter.post(``, async (req, res) => {
    const newPersona = new Persona(req.body);
    await newPersona.save();
    res.status(201).json(newPersona);
});

//editar persona por id
personaRouter.put(`/:id`, async (req, res) => {
    const updatePersona = await Persona.findByIdAndUpdate(req.params.id, req.body);
    res.json(updatePersona);
});

//eliminar persona por id
personaRouter.delete(`/:id`, async (req, res) => {
    await Persona.findByIdAndDelete(req.params.id);
    res.send();
});

module.exports = personaRouter;