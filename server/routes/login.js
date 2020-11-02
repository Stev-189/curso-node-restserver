const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //here
//usuario de token google usuario
///////////////////////////////////////////////////////
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
///////////////////////////////////////////////////////
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

//Configuracion de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
};
// verify().catch(console.error);

// atentificacion google
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({ // aqui el error es un erro de estatus del server
                    ok: false,
                    err
                })
            };
            if (usuarioDB) {
                if (usuarioDB.google === false) {
                    return res.status(400).json({ // aqui el error es un erro de estatus del server
                        ok: false,
                        err: { message: 'Debe de usar su atenticacion normal' }
                    })
                } else {
                    let token = jwt.sign({
                        usuario: usuarioDB // el retorno de datos tambien se le llama payload
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    });
                }
            } else {
                // si el usuario no existe en nuestra base datos, nuevo usuario
                let usuario = new Usuario();
                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ':)'; // es solo por completar registros nunca se auntentificara

                usuario.save((err, usuarioDB) => { // guardo el nuevo usaurio
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    };

                    let token = jwt.sign({
                        usuario: usuarioDB // el retorno de datos tambien se le llama payload
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                    return res.json({ // si todo esta ok genero un nuevo token
                        ok: true,
                        usuario: usuarioDB,
                        token
                    });
                })
            }
        })
        // res.json({
        //     usuario: googleUser
        // });
});


module.exports = app;