import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Libro from './Libro';
import { Table, Container, Row, Col } from 'react-bootstrap';

const Admin = () => {
  const [libros, setLibros] = useState([]);
  const [estados, setEstados] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [librosRes, copiasRes, estadosRes, editorialesRes, idiomasRes] = await Promise.all([
          axios.get('http://localhost:5000/api/libros'),
          axios.get('http://localhost:5000/api/copias_libros'),
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
    <Container className="d-flex justify-content-center align-items-center text-center">
      <Row className="w-100">
        <Col md={12} className="mx-auto">
          <h1 className="text-center">Gestión de Libros</h1>
          {error && <div className="alert alert-danger">{error}</div>}

          <Table>
            <thead>
              <tr>
                <th className="table-dark">Título</th>
                <th className="table-dark">Autor</th>
                <th className="table-dark">Estado</th>
                <th className="table-dark">Editorial</th>
                <th className="table-dark">Idioma</th>
                <th className="table-dark">N° Copia</th>
                <th className="table-dark">Prestado</th>
                <th className="table-dark">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.length === 0 ? (
                <tr>
                  <td colSpan="7">No se encontraron libros.</td>
                </tr>
              ) : (
                libros.map((libro) => {
                  return (
                    <React.Fragment key={libro.id}>
                      <Libro
                        libro={libro}
                        estados={estados}
                        editoriales={editoriales}
                        idiomas={idiomas}
                        setLibros={setLibros}
                      />
                      <tr className="table-dark">
                        <td colSpan="8">
                          Total de libros: {libro.cantidad}
                        </td>
                      </tr>
                      <tr className="table-dark">
                        <td colSpan="8">
                          Total de libros disponibles para ser prestados: {libro.total_disponibles}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );

};


export default Admin;
