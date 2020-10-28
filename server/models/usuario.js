const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // para manejar valores unicos***

//valores validos y mensaje de error */*
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

//declaramos esquemas de mongos
let Schema = mongoose.Schema; //important Schema


//esquema de usuario
let usuarioSchema = new Schema({
    nombre: { //nombre dle esquema
        type: String, //tipo de esquema
        required: [true, 'El nombre es necesario'] //[obligatorio, mensaje de error] || true
    },
    email: {
        type: String, //tipo de esquema
        unique: true, //si, para definir que no se pueda repetir***
        required: [true, 'El correo es necesario'] //[obligatorio, mensaje de error] || true
    },
    password: {
        type: String, //tipo de esquema
        required: [true, 'La contraseña es necesaria'] //[obligatorio, mensaje de error] || true
    },
    img: {
        type: String, //tipo de esquema
        required: false
    },
    role: {
        type: String, //tipo de esquema
        default: 'USER_ROLE',
        enum: rolesValidos // */*
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//quita el elemento pasword parea que jamas pueda ser debuelto
usuarioSchema.methods.toJSON = function() { //ocupa funcion por el tema del this
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


// para importar pluging
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })
    //dentro de message debe ser '' no puede ser template string ``

//exportamos no un nombre el esquema
module.exports = mongoose.model('Usuario', usuarioSchema);