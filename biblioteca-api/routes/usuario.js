const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Ruta para obtener todos los usuarios
router.get('/', (req, res) => {
    connection.query('SELECT * FROM usuario', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al consultar la base de datos');
        }
        res.json(results);
    });
});

// Ruta para autenticar usuario
router.post('/', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM usuario WHERE nombre = ? AND password = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).send('Error al consultar la base de datos');
        }

        if (results.length > 0) {
            const user = results[0];
            const userType = user.role; 
            const userId = user.id;
            
            return res.status(200).json({
                token: 'fake-jwt-token', 
                userType,
                id: userId 
            });
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
});

// Ruta para crear un nuevo usuario
router.put('/', (req, res) => {
    const { nombre, email, password, role, dni, direccion, telefono } = req.body;
    const query = `
        INSERT INTO usuario (nombre, email, password, role, dni, direccion, telefono) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        query,
        [nombre, email, password, role, dni, direccion, telefono],
        (err, results) => {
            if (err) {
                console.error('Error al insertar usuario:', err);
                return res.status(500).send('Error al insertar en la base de datos');
            }
            res.status(201).send('Usuario creado exitosamente');
        }
    );
});


module.exports = router;
