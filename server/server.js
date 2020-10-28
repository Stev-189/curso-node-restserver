require('./config/config'); // ejecuta primero archivo de ocnfiguracion

const express = require('express')
const mongoose = require('mongoose'); // importar libreria de mongo
const app = express()

///////////////////////////////////////////////////
//Body-Parse
const bodyParser = require('body-parser')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario')); // importamos CRUD
// escribimos aqui este codigo sin comentar
///////////////////////////////////////////////////
// app.get('/usuario', function(req, res) {
//     res.json('get usuario local')
// })

// app.post('/usuario', function(req, res) {
//     let body = req.body; //como esta body parse captura lo que trae 

//     //validadno si hay error en la solicitud
//     if (body.nombre === undefined) {
//         res.status(400).json({ // si no existe el nombre status 400 de error
//             ok: false,
//             mensaje: 'el nombre es nesesario'
//         })
//     } else {
//         res.json({ persona: body })
//     }
// })

// app.put('/usuario/:id', function(req, res) { // es el parametro

//     let id = req.params.id; // recupera el parametro id de la url y lo grega a id
//     res.json({ id }) // debuelvo el propioe id entregado
// })

// app.delete('/usuario', function(req, res) {
//         res.json('delete usuario')
//     })
///////////////////////////////////////////////////

///mongodb   mongodb :// host :  puerto / nombre bd , callback          
//mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useCreateIndex: true },
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log(`Base de datos ONLINE`);
    }); //concionsn simple


app.listen(process.env.PORT, () => console.log(`Escuchando puerto: `, process.env.PORT))