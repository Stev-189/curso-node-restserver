const express = require('express');
const bcrypt = require('bcrypt'); //important! here ***/
const _ = require('underscore');

//importamos le modelo
const Usuario = require('../models/usuario'); //noma Usuario 
const usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express()


// 1 link/middlewares/callback
app.get('/usuario', verificaToken, (req, res) => {

    //con esto estamos usando el resultado de verificaToken del autenticacion
    /* return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    }) */
    let desde = req.query.desde || 0; //recive en cuerpo le limite
    //ejemplo link?desde=10 se salta los primeros 10
    desde = Number(desde)


    let limite = req.query.limite || 5; //recive en cuerpo le limite
    //ejemplo link?limite=10 se salta los primeros 10
    //dos parametros link?limite=10&desde=10 se salta los primeros 10
    limite = Number(limite)
        // res.json('get usuario local')
        //GETALL
        //////////////
    Usuario.find({ estado: true }, 'nombre email role estado google img') //{condicion}, 'columnas a mostrar siempre trae id'
        .skip(desde) // para saltar resultados
        .limit(limite) // muestra de 5 en 5 || limite en limite
        .exec((err, usuarios) => {
            if (err) { //sin hay un erro corta proceso y retorna le error en un json
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({ //implicitamente retorna un 200
                    ok: true,
                    usuarios, //retorn alll usuarios
                    cuantos: conteo //contar la cantidad de registros en la Base de datos 
                        //independiente d elos que s emuestren
                });
            })
        })

    //////////////


})


app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body; //como esta body parse captura lo que trae 

    let usuario = new Usuario({
            nombre: body.nombre, //asignamos los valores uqe vinene del body
            email: body.email,
            password: bcrypt.hashSync(body.password, 10), //lo que trae body .password o convierte
            role: body.role
        })
        //AGREGAR EL USUARIO
        ///////////////////////
    usuario.save((err, usuarioDB) => {
        if (err) { //sin hay un erro corta proceso y retorna le error en un json
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // usuarioDB.password = null
        res.json({ //implicitamente retorna un 200
            ok: true,
            usuario: usuarioDB
        });
    });
    //F2 Para mi es mas clara de entender
    // usuario.save((err, usuarioDB) => {
    //     if (err) { //sin hay un erro corta proceso y retorna le error en un json
    //         res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     } else {
    //         res.json({ //implicitamente retorna un 200
    //             ok: true,
    //             usuario: usuarioDB
    //         });
    //     }
    // });
    ///////////////////////


    // //validadno si hay error en la solicitud
    // if (body.nombre === undefined) {
    //     res.status(400).json({ // si no existe el nombre status 400 de error
    //         ok: false,
    //         mensaje: 'el nombre es nesesario'
    //     })
    // } else {
    //     res.json({ persona: body })
    // }
})

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) { // es el parametro

    let id = req.params.id; // recupera el parametro id de la url y lo grega a id
    //F2
    //usando underscore el metodo pick basicmanete filtramso nuestro objeto 
    //para que solo pueda modificar parametros especificos
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //F1 para que uusario solo modifique ciertos parametros 
    //eliminar parametros objsto
    // delete body.password
    // delete body.google

    //Actualizar
    ///////////// id del ususario, update, options y una callback
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { //{new : true}es para retorne le dato actualizado
            if (err) { //sin hay un erro corta proceso y retorna le error en un json
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({ //implicitamente retorna un 200
                ok: true,
                usuario: usuarioDB //si todo ok retorna lo modificado
            });
        })
        ////////////

    // res.json({ id }) // debuelvo el propioe id entregado


})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    // res.json('delete usuario')
    let id = req.params.id;
    //Delete Lo elimina definitivamente
    ////////////////////
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };
    //     // envia otro mensaje en caso d eusiario no encontrado
    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: { message: 'Ususario no encontrado' }
    //         });
    //     };
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // })

    ////////////////////

    //cambiar estado
    //////////////////////
    let cambiaEstado = { estado: false }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Ususario no encontrado' }
            });
        };
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    })

    //////////////////////
})

module.exports = app;