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
//Vencimiento dle token usao en login
//==========
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';

//==========
//SEED de autenticaciojn o firma
//==========
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==========
//Base de datos
//==========
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL; // en heroku se guarda la variable MONGO_URL donde  
    //tengo gurdado la url y accesos al clound de mongo atlas
    // asi no se muestra los accesoso en codigo fuente
};

process.env.URLDB = urlDB;

//==========
//Google client ID
//==========
process.env.CLIENT_ID = process.env.CLIENT_ID || '245195313732-2s1shurmrlhs0lbqp5jan5m07lkn1tj1.apps.googleusercontent.com'