import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import Libro from './Libro';

const Admin = () => {
  const [libros, setLibros] = useState([]);
  const [estados, setEstados] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [librosRes, estadosRes, editorialesRes, idiomasRes] = await Promise.all([
          axios.get('http://localhost:5000/api/libros'),
          axios.get('http://localhost:5000/api/estados'),
          axios.get('http://localhost:5000/api/editorial'),
          axios.get('http://localhost:5000/api/idioma')
        ]);

        setLibros(librosRes.data);
        setEstados(estadosRes.data);
        setEditoriales(editorialesRes.data);
        setIdiomas(idiomasRes.data);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError('No se pudo cargar la información. Intenta de nuevo.');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Gestión de Libros</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Estado</th>
            <th>Editorial</th>
            <th>Idioma</th>
            <th>Copia ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {libros.length === 0 ? (
            <tr>
              <td colSpan="7">No se encontraron libros.</td>
            </tr>
          ) : (
            libros.map((libro) => (
              <Libro
                key={libro.id}
                libro={libro}
                estados={estados}
                editoriales={editoriales}
                idiomas={idiomas}
                setLibros={setLibros}
              />
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Admin;
