const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Obtener todas las editoras
router.get('/', (req, res) => {
  connection.query('SELECT * FROM editorial', (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener las editoras' });
    }
    res.json(results);
  });
});

// Obtener una editorial por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM editoria WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener la editorial' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Editorial no encontrada' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
