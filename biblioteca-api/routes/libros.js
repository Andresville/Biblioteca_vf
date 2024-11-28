const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Importar la conexión

// Ruta para obtener todos los libros
router.get('/', (req, res) => {
    connection.query('SELECT * FROM libros', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al consultar la base de datos');
        }
        res.json(results); // Devolver los resultados como JSON
    });
});

// Ruta para obtener un libro específico por su ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT * FROM libros WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al consultar la base de datos');
        }

        if (results.length === 0) {
            return res.status(404).send('Libro no encontrado');
        }

        res.json(results[0]); // Devolver el primer libro encontrado
    });
});

// Ruta para actualizar el estado de un libro
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { id_estado } = req.body; // Solo esperamos 'id_estado'

    // Validar entrada
    if (typeof id_estado !== 'number') {
        return res.status(400).json({ message: 'Datos inválidos. Verifica el formato enviado.' });
    }

    // Consulta para actualizar solo el estado del libro
    const query = 'UPDATE libros SET id_estado = ? WHERE id = ?';
    connection.query(query, [id_estado, id], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        res.status(200).json({ message: 'Estado actualizado con éxito' });
    });
});

module.exports = router;
