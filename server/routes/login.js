const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //here
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({ // aqui el error es un erro de estatus del server
                    ok: false,
                    err
                })
            }
            if (!usuarioDB) {
                return res.status(400).json({ // usaurion no encontrado
                    ok: false,
                    err: { message: '(Usuario) o contraseña incorrecto' }
                    //es recomendado por temas de seguridad mno difernecias si es un erro de 
                    //usuario o de ocntraseñasolo ahora por temas de estudui se hace una pequeña diferencia
                    // que indica que el erro corresponde a usuario
                });
            }
            //funcion propia de bcrypt que comparar encriptaciones de lo que trae body lo que esta en bd
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                //si no hay match pa fuera
                return res.status(400).json({ // usaurion no encontrado
                    ok: false,
                    err: { message: 'Usuario o (contraseña) incorrecto' }
                    //es recomendado por temas de seguridad mno difernecias si es un erro de 
                    //usuario o de ocntraseñasolo ahora por temas de estudui se hace una pequeña diferencia
                    // que indica que el erro corresponde a usuario
                });
            }

            // let token = jwt.sign( 
            // {objeto}, 
            //  'secreto' o tambien llamado firma , 
            //{ expiresIn: segundos * minutos * horas * dias });
            let token = jwt.sign({
                usuario: usuarioDB // el retorno de datos tambien se le llama payload
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            res.json({
                ok: true,
                usuario: usuarioDB,
                token // por ahora es solo una ejemplo de token para implementar
            });
        }) // se verifica el correo y despue si paso ausaurio comnpara resulñtados de bcrypt contraseña

    // res.json({ ok: true })

});



module.exports = app;