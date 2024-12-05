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

// Ruta para insertar préstamo
router.put('/', (req, res) => {
    const { titulo, copia, fecha_prestamo, fecha_devolucion, id_usuario } = req.body;

    // id_libro correspondiente al título del libro
    const queryLibro = 'SELECT id FROM libros WHERE titulo = ?';
    
    connection.query(queryLibro, [titulo], (err, results) => {
        if (err) {
            console.error('Error al consultar el libro:', err);
            return res.status(500).send('Error al consultar el libro');
        }

        if (results.length === 0) {
            return res.status(404).send('Libro no encontrado');
        }

        const id_libro = results[0].id; // Obtener el id del libro

        const query = `
            INSERT INTO prestados (id_libro, id_usuario, fecha_prestamo, fecha_devolucion, id_copia) 
            VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(
            query,
            [id_libro, id_usuario, fecha_prestamo, fecha_devolucion, copia],
            (err, results) => {
                if (err) {
                    console.error('Error al insertar préstamo:', err);
                    return res.status(500).send('Error al insertar en la base de datos');
                }
                res.status(201).send('Préstamo registrado exitosamente');
            }
        );
    });
});


module.exports = router;
