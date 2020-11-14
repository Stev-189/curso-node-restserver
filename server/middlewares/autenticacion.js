const jwt = require('jsonwebtoken');
//======================
//Verificar Token
//======================
//req solicitud, res respuesta, next sigue la funcion que esta en le get
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    //funcion propia de jwt para verificar donde recive el token
    //la semilla o firma y un callback con el resultado
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({ // aqui el error es un erro de estatus del server
                ok: false,
                err: {
                    message: 'Token no Valido'
                }
            })
        }
        //si todo esta ok al req le asigna le valor dle token de usuario
        req.usuario = decode.usuario;
        next();
    })
};

//======================
//Verificar Tipo de usuario
//======================
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: { message: 'El usuario no es administrador' }
        });
    }
};

//======================
//Verificar Token IMG en url ?token=112233
//======================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({ // aqui el error es un erro de estatus del server
                ok: false,
                err: {
                    message: 'Token no Valido'
                }
            })
        }
        //si todo esta ok al req le asigna le valor dle token de usuario
        req.usuario = decode.usuario; // del token obetine el usuario
        next();
    })
}
module.exports = { verificaToken, verificaAdmin_Role, verificaTokenImg }