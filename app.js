const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

let personas = [
    {id: 1, name: "Leo", age: 34},
    {id: 2, name: "Ener", age: 34},
    {id: 3, name: "Pedri", age: 35},
]

//listar personas
app.get(`/personas`, (_req, res) => {
    res.json(personas);
})

//buscar personas por id
app.get(`/personas/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const persona = personas.find(p => p.id === id);
    res.json(persona);
})

//crear nueva persona
app.post(`/personas`, (req, res) => {
    const newPersona = {
        id: personas.length + 1,
        name: req.body.name,
        age: req.body.age
    }
    personas.push(newPersona);
    res.status(201).json(newPersona);
})

//editar persona por id
app.put(`/personas/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const persona = personas.find(p => p.id === id);
    persona.name = req.body.name;
    persona.age = req.body.age;
    res.json(persona);
})

//eliminar persona por id
app.delete(`/personas/:id`, (req, res) => {
    const id = parseInt(req.params.is);
    const indice = personas.findIndex(p => p.id === id);
    const persona = personas.splice(indice, 1);
    res.json(persona);
})

//inicializar servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})