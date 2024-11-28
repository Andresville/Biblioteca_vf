const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/usuario', require('./routes/usuario'));
app.use('/api/libros', require('./routes/libros'));
app.use('/api/prestados', require('./routes/prestados'));
app.use('/api/idioma', require('./routes/idioma'));
app.use('/api/editorial', require('./routes/editorial'));
app.use('/api/estados', require('./routes/estados'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
