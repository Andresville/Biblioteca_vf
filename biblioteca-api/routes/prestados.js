const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Importar la conexión

// Obtener todos los préstamos
router.get('/', (req, res) => {
  const query = 'SELECT p.id, l.titulo, u.nombre, p.fecha_prestamo, p.fecha_devolucion FROM prestados p INNER JOIN libros l ON p.id_libro = l.id INNER JOIN usuario u ON p.id_usuario = u.id';

  connection.query(query, (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al obtener los préstamos' });
      }

      res.status(200).json(results);
  });
});

// Crear un nuevo préstamo
router.post('/', (req, res) => {
    const { id_libro, id_usuario, fecha_prestamo, fecha_devolucion } = req.body;

    // Primero, verificar si el libro está disponible
    connection.query('SELECT cantidad FROM libros WHERE id = ?', [id_libro], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al consultar el libro' });
        }

        if (results.length === 0 || results[0].cantidad <= 0) {
            return res.status(400).json({ error: 'No hay libros disponibles para prestar' });
        }

        // Si hay libros disponibles, registramos el préstamo
        const queryPrestamo = 'INSERT INTO prestados (id_libro, id_usuario, fecha_prestamo, fecha_devolucion) VALUES (?, ?, ?, ?)';
        connection.query(queryPrestamo, [id_libro, id_usuario, fecha_prestamo, fecha_devolucion], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al crear el préstamo' });
            }

            // Reducir la cantidad disponible del libro
            const queryCantidad = 'UPDATE libros SET cantidad = cantidad - 1 WHERE id = ?';
            connection.query(queryCantidad, [id_libro], (err, updateResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error al actualizar la cantidad del libro' });
                }

                res.status(201).json({ message: 'Préstamo registrado con éxito' });
            });
        });
    });
});

// Registrar devolución
router.post('/devolucion', (req, res) => {
    const { id_libro } = req.body;

    // Actualizar la cantidad disponible del libro al devolverlo
    const queryDevolucion = 'UPDATE libros SET cantidad = cantidad + 1 WHERE id = ?';
    connection.query(queryDevolucion, [id_libro], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al registrar la devolución' });
        }

        // Eliminar el préstamo correspondiente (si se desea)
        const queryEliminarPrestamo = 'DELETE FROM prestados WHERE id_libro = ? AND fecha_devolucion IS NULL';
        connection.query(queryEliminarPrestamo, [id_libro], (err, deleteResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al eliminar el préstamo' });
            }

            res.status(200).json({ message: 'Devolución registrada con éxito' });
        });
    });
});

module.exports = router;
