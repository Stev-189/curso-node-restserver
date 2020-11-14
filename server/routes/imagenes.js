const express = require('express');
const fs = require('fs');
const path = require('path'); // para poder generael path de sendfiel
const app = express();
const { verificaToken, verificaAdmin_Role, verificaTokenImg } = require('../middlewares/autenticacion');


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    // app.get('/imagen/:tipo/:img', verificaToken, (req, res) => {
    let tipo = req.params.tipo,
        img = req.params.img;
    // let pathImg = `./uploads/${tipo}/${img}`;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (pathImagen) {
        res.sendFile(pathImagen); // para manejar archivos dentro de server
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg'); // generamos el path abosoluto para que funcione
        // res.sendFile(`./server/assets/no-image.jpg`); // para manejar archivos dentro de server//al no ser absoluto no servira
        res.sendFile(noImagePath); // para manejar archivos dentro de server
    }

})

module.exports = app;