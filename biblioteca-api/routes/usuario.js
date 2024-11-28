const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Importar la conexión

// Ruta para obtener todos los usuarios
router.get('/', (req, res) => {
    connection.query('SELECT * FROM usuario', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al consultar la base de datos');
        }
        res.json(results); // Devolver los resultados como JSON
    });
});

// Ruta para autenticar usuario
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Verificar las credenciales en la base de datos
    const query = 'SELECT * FROM usuario WHERE nombre = ? AND password = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).send('Error al consultar la base de datos');
        }

        if (results.length > 0) {
            const user = results[0];
            const userType = user.role; // 'admin' o 'user'
            return res.status(200).json({
                token: 'fake-jwt-token', // Cambia esto si implementas JWT real
                userType,
            });
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
});


module.exports = router;
