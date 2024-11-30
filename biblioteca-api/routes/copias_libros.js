const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Obtener todas las copias de los libros
router.get('/', (req, res) => {
    connection.query('SELECT * FROM copias_libros', (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ error: 'Error al obtener las copias de libros' });
        }
        res.json(results);
    });
});

// Obtener una copia de libro por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT * FROM copias_libros WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ error: 'Error al obtener la copia de libro' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Copia de libro no encontrada' });
        }

        res.json(results[0]);
    });
});

// Actualizar el estado de una copia de libro
router.put('/:id', (req, res) => {
    const { id } = req.params; // ID de la copia
    const { id_estado } = req.body; // Nuevo estado

    // Validar que id_estado es un número válido
    if (typeof id_estado !== 'number' || isNaN(id_estado)) {
        return res.status(400).json({ message: 'Estado inválido. Debe ser un número.' });
    }

    const query = 'UPDATE copias_libros SET id_estado = ? WHERE id = ?';
    connection.query(query, [id_estado, id], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Copia de libro no encontrada' });
        }

        res.status(200).json({ message: 'Estado de la copia actualizado con éxito' });
    });
});

module.exports = router;

