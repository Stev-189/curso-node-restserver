const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload({ useTempFiles: true })); // carga del archivo el contenido

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs'); // para tarabajar manejando los estados d elos archivows dentro dle servidor.
const path = require('path')
    // app.put('/upload', function(req, res) { // rutra y metodo decarga de archivo
app.put('/upload/:tipo/:id', function(req, res) { // para diferencias el tipo de ruta de subir archivo
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no se ha seleccionado ningun archivo'
            }
        })
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.splice(', '),
                tipo
            }
        })
    }

    let archivo = req.files.archivo; // al enviar el archivo se llamara archivo //artchivo : url/archivo.jpg
    //....................// va en la key Postaman, se envia por medtodo body form-data

    //validando extenciones
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenmciones validas son ' + extensionesValidas.splice(', '),
                extension
            }
        })
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`; // se agrego mili segundo para que no exista bug en browser
    // archivo.mv('/uploads/filename.jpg', (err) => { // path y nombre donde se subira el archivo despues lo haremos dinamico
    // archivo.mv('uploads/filename.jpg', (err) => { // path y nombre donde se subira el archivo despues lo haremos dinamico
    // archivo.mv(`uploads/${tipo}/${archivo.name}`, (err) => { // hasi subimos con le nombre propio dle archivo que se esta subiendo
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => { // definimos el nombre del usuario al archivo
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //aqui ya carga la imagen
        // res.json({
        //     ok: true,
        //     message: 'imagen subida correctamente'
        // });
        // remmplazaos la funcoin por una validacion de la imagen de usuario

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo)
        } else {
            imagenProducto(id, res, nombreArchivo)
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        //asigna solo el alor del monbre del archivo d eimagen sin ruta por si modificaramso le path

        borrarArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }
        //asigna solo el alor del monbre del archivo d eimagen sin ruta por si modificaramso le path

        borrarArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    });
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) { //si existe la el archvio d eimagen dle path
        fs.unlinkSync(pathImagen); //la elimina
    }
}

module.exports = app;