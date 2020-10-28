// process es un variable global que dependiendo dle entorno dond se etse ejecutando funcionara
//==========
//Puerto
//==========
process.env.PORT = process.env.PORT || 3000 // variable global
    // valida el puerto de ejecucion del server


//==========
//Entorno
//==========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========
//Base de datos
//==========
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
};

process.env.URLDB = urlDB;