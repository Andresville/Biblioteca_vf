const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Conexión a la base de datos

// Ruta para obtener todos los libros con sus copias y estados
router.get('/', (req, res) => {
    const query = `
    SELECT 
        libros.id,
        libros.titulo,
        libros.autor,
        libros.ISBN,
        libros.id_editorial,
        libros.id_idioma,
        libros.cantidad,
        copias_libros.id AS copia_id,
        estado.estado AS estado
    FROM 
        libros
    LEFT JOIN copias_libros ON copias_libros.id_libro = libros.id
    LEFT JOIN estado ON copias_libros.id_estado = estado.id
    ORDER BY libros.titulo, copias_libros.id;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Error al consultar la base de datos');
        }

        // Agrupar los resultados por libro
        const librosConEstados = results.reduce((acc, row) => {
            const libro = acc.find(libro => libro.id === row.id);
            if (libro) {
                // Si el libro ya existe, agregar la copia con su estado
                libro.copias.push({
                    copia_id: row.copia_id,
                    estado: row.estado
                });
            } else {
                // Si el libro no existe, crear un nuevo libro
                acc.push({
                    id: row.id,
                    titulo: row.titulo,
                    autor: row.autor,
                    ISBN: row.ISBN,
                    id_editorial: row.id_editorial,
                    id_idioma: row.id_idioma,
                    cantidad: row.cantidad,
                    copias: [{
                        copia_id: row.copia_id,
                        estado: row.estado
                    }]
                });
            }
            return acc;
        }, []);

        res.json(librosConEstados); // Devolver los resultados como JSON
    });
});

// Ruta para obtener un libro específico por su ID con sus copias y estados
router.get('/:id', (req, res) => {
    const { id } = req.params;

    const query = `
    SELECT 
        libros.id,
        libros.titulo,
        libros.autor,
        libros.ISBN,
        libros.id_editorial,
        libros.id_idioma,
        libros.cantidad,
        copias_libros.id AS copia_id,
        estado.estado AS estado
    FROM 
        libros
    LEFT JOIN copias_libros ON copias_libros.id_libro = libros.id
    LEFT JOIN estado ON copias_libros.id_estado = estado.id
    WHERE libros.id = ?
    ORDER BY copias_libros.id;
    `;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).send('Error al consultar la base de datos');
        }

        if (results.length === 0) {
            return res.status(404).send('Libro no encontrado');
        }

        // Agrupar las copias de un libro por id_libro
        const libro = {
            id: results[0].id,
            titulo: results[0].titulo,
            autor: results[0].autor,
            ISBN: results[0].ISBN,
            id_editorial: results[0].id_editorial,
            id_idioma: results[0].id_idioma,
            cantidad: results[0].cantidad,
            copias: results.map(row => ({
                copia_id: row.copia_id,
                estado: row.estado
            }))
        };

        res.json(libro); // Devolver el libro con sus copias y estados
    });
});

// Ruta para actualizar el estado de una copia de libro
router.put('/:libro_id/copia/:copia_id', (req, res) => {
    const { libro_id, copia_id } = req.params; // Obtenemos ambos IDs
    const { id_estado } = req.body; // Esperamos solo el 'id_estado'

    // Validar que id_estado sea un número válido
    if (typeof id_estado !== 'number' || isNaN(id_estado)) {
        return res.status(400).json({ message: 'Estado inválido. Debe ser un número.' });
    }

    // Consulta para actualizar el estado de una copia de libro específica
    const query = 'UPDATE copias_libros SET id_estado = ? WHERE id_libro = ? AND id = ?';
    connection.query(query, [id_estado, libro_id, copia_id], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Copia no encontrada o no tiene estado para actualizar' });
        }

        res.status(200).json({ message: 'Estado de la copia actualizado con éxito' });
    });
});

module.exports = router;


