const express = require('express');

// validacion para el POST
function validarPersona(req, res, next){
    const {name, age} = req.body;
    if (!name || typeof name !== 'string' || name.trim() === ''){
        return res.status(400).json({error: 'The name can`t be empty and must be a string.'})
    }
    
    if (!age || isNaN(Number(age)) || Number(age) > 100 || Number(age) <= 0){
        return res.status(400).json({error: 'The age cannot be empty and must be a valid number between 1 and 100.'})
    }

    next();
}

// validacion para el PUT
function validarActualizacion(req, res, next) {
    const {name, age} = req.body;
    const { id } = req.params;

    // Validar el formato del ID de MongoDB
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'invalid ID format'});
    }

    // Validar el nombre (si se envía)
    if(name !== undefined){
        if(typeof name !== 'string' || name.trim()=== ''){
            return res.status(400).json({ error: 'The name cannot be empty and must be a string'});
        }
    }
    
    // Validar la edad (si se envía)
    if(age !== undefined){
        if(isNaN(Number(age)) || Number(age) > 100 || Number(age) <= 0){
            return res.status(400).json({error: 'The age cannot be empty and must be a valid number between 1 and 100.'})
        }
    };

    next();
}

//validacion para el GET por ID
function validarID(req, res, next) {
    const { id } = req.params;

    // Validar el formato del ID de MongoDB
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'invalid ID format'});
    }

    next();
}

module.exports = { validarID, validarActualizacion, validarPersona,  };