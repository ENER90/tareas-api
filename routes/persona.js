const express = require('express');
const Persona = require('../models/persona');
const validation = require('../validations/persona');
const personaRouter = express.Router(); 

//listar personas
personaRouter.get('/', async (_req, res) => {
    try {
        const personas = await Persona.find();

        res.json(personas);
    } catch (error) {
        res.status(500).json({error: 'Error to try list persons'});  
    }
});

//buscar personas por id
personaRouter.get('/persona/:id', validation.validarID, async (req, res) => {
    try {
        const persona = await Persona.findById(req.params.id);

        if (!persona) {
            return res.status(404).json({error: 'Person not found'});
        }

        res.json(persona);
    } catch (error) {
        res.status(500).json({error: 'Error trying to fetch person'});
    }
    
});

//crear nueva persona
personaRouter.post('/', validation.validarPersona, async (req, res) => {
    try{
        const newPersona = new Persona(req.body);
        await newPersona.save();
        res.status(201).json(newPersona);
    }catch (error) {
        res.status(500).json({error: 'Error trying to seve a person'});
    }
});

//editar persona por id
personaRouter.put('/:id', validation.validarActualizacion, async (req, res) => {
    try{
        const updatePersona = await Persona.findByIdAndUpdate(req.params.id, req.body);

        if(!updatePersona) {
            return res.status(404).json({error: 'Person not found'});
        }
        res.json({message: 'Person updated successfully', persona: updatePersona});
    }catch (error) {
        res.status(500).json({error: 'Error trying to edit person'});
    }
});

//eliminar persona por id
personaRouter.delete('/:id', validation.validarID, async (req, res) => {
    try {
        const deletePersona = await Persona.findByIdAndDelete(req.params.id);

        if(!deletePersona) {
            return res.status(404).json({error: 'Person not found'})
        }

        res.json({message: 'Person deleted successfully', persona: deletePersona });
        return;

    } catch (error) {
        res.status(500).json({error: 'Error trying to delete person'});
    }
    
});

module.exports = personaRouter;
