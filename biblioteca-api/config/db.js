const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Cambia según tu configuración
    password: 'Emilia15#',  // Cambia según tu configuración
    database: 'library_db'  // Nombre de tu base de datos
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión a la base de datos exitosa.');
});

module.exports = connection;

