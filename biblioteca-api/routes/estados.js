// routes/estados.js
const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Importar la conexión a la base de datos

// Obtener todos los estados
router.get('/', (req, res) => {
  connection.query('SELECT * FROM estado', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener los estados' });
    }
    res.json(results);
  });
});

// Obtener un estado por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM estado WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener el estado' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Estado no encontrado' });
    }
    res.json(results[0]);
  });
});

module.exports = router;

