import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Asegúrate de que esta sea tu URL base
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
