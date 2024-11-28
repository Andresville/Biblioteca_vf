const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Obtener todos los idiomas
router.get('/', (req, res) => {
  connection.query('SELECT * FROM idioma', (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener los idiomas' });
    }
    res.json(results);
  });
});

// Obtener un idioma por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM idioma WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener el idioma' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Idioma no encontrado' });
    }
    res.json(results[0]);
  });
});

module.exports = router;


