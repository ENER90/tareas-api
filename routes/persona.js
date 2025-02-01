const express = require('express');
const connectDB = require('../db');
connectDB();
const Persona = require('../models/persona');
const personaRouter = express.Router(); 

function validarPersona(req, res, next){
    console.log('aqui');
    const {name, age} = req.body;
    if (!name || typeof name !== 'string' || name.trim() === ''){
        return res.status(400).json({error: 'The name can`t be empty and must be a string.'})
    }
    
    if (!age || isNaN(Number(age)) || Number(age) > 100 || Number(age) <= 0){
        return res.status(400).json({error: 'The age cannot be empty and must be a valid number between 1 and 100.'})
    }

    next();
}

function validarActualizacion(req, res, next) {
    const {name, age} = req.body;
    const { id } = req.params;

    // Validar el formato del ID de MongoDB
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'invalid ID format'});
    }

    // Validar el nombre (si se envía)
    if(name !== undefined){
        if(name !== 'string' || name.trim()=== ''){
            return res.status(400).json({ error: 'The name cannot be empty and must be a string'});
        }
    }
    
    // Validar la edad (si se envía)
    if(age !== undefined){
        if(!age || isNaN(Number(age)) || Number(age) > 100 || Number(age) <= 0){
            return res.status(400).json({error: 'The age cannot be empty and must be a valid number between 1 and 100.'})
        }
    };

    next();
}
//listar personas
personaRouter.get('/', async (_req, res) => {
    
    const personas = await Persona.find()
    res.json(personas);    
    res.status(500).json({error: 'Error to try seve a person'});  
});

//buscar personas por id
personaRouter.get('/:id', async (req, res) => {
    const persona = await Persona.findById(req.params.id);
    res.json(persona);
});

//crear nueva persona
personaRouter.post('/', validarPersona, async (req, res) => {
    try{
        const newPersona = new Persona(req.body);
        await newPersona.save();
        res.status(201).json(newPersona);
    }catch (error) {
        res.status(500).json({error: 'Error trying to seve a person'});
    }
});

//editar persona por id
personaRouter.put('/:id', validarActualizacion, async (req, res) => {
    try{
        const updatePersona = await Persona.findByIdAndUpdate(req.params.id, req.body);

        if(!updatePersona){
            return res.status(404).json({ error: 'Person not found'})
        }
        res.json(updatePersona);
    }catch (error) {
        res.status(500).json({error: 'Error trying to edit a person'});
    }
});

//eliminar persona por id
personaRouter.delete('/:id', async (req, res) => {
    await Persona.findByIdAndDelete(req.params.id);
    res.send();
});

module.exports = personaRouter;