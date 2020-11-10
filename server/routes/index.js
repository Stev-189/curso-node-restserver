const express = require('express');
const app = express();

app.use(require('./usuario')); // link de acceso al servidor en ete caso manejas las peticiones de usuario dle rest
app.use(require('./login')); // peticiones de login
app.use(require('./categoria')); // peticiones de categoria
app.use(require('./producto')); // peticiones de producto

module.exports = app;