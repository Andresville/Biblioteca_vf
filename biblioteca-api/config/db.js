const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'bibliotecavf-production.up.railway.app',  // Puedes usar 'localhost' en desarrollo
    user: process.env.DB_USER || 'root',      // Asegúrate de usar tu usuario de DB
    password: process.env.DB_PASSWORD || 'Emilia15#',
    database: process.env.DB_NAME || 'library_db',
    port: process.env.DB_PORT || 3306,        // Puedes cambiar el puerto si es necesario
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión a la base de datos exitosa.');
});

module.exports = connection;

