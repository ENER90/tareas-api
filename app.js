const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

app.get('/', (req, res) => {
    res.send({name: "cuco"});
})



//inicializar servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})