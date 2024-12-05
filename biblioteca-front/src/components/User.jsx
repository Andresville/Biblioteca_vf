import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Table, Container, Row, Col, Button } from "react-bootstrap";

const User = () => {
  const [libros, setLibros] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [librosRes, editorialesRes, idiomasRes] = await Promise.all([
          axios.get("http://localhost:5000/api/libros"),
          axios.get("http://localhost:5000/api/editorial"),
          axios.get("http://localhost:5000/api/idioma"),
        ]);

        setLibros(librosRes.data);
        setEditoriales(editorialesRes.data);
        setIdiomas(idiomasRes.data);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("No se pudo cargar la información. Intenta de nuevo.");
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center text-center">
      <Row className="w-100">
        <Col md={12} className="mx-auto">
          <h1 className="text-center">Libros Disponibles</h1>
          {error && <div className="alert alert-danger">{error}</div>}

          <Table>
            <thead>
              <tr>
                <th className="table-dark">Título</th>
                <th className="table-dark">Autor</th>
                <th className="table-dark">Editorial</th>
                <th className="table-dark">Idioma</th>
                <th className="table-dark">N° de Copia</th>
                <th className="table-dark">Acción</th>
              </tr>
            </thead>
            <tbody>
              {libros.length === 0 ? (
                <tr>
                  <td colSpan="6">No se encontraron libros disponibles.</td>
                </tr>
              ) : (
                libros.map((libro) => {
                  const copiasFiltradas = libro.copias.filter(
                    (copia) =>
                      copia.estado === "presentable" && copia.prestado === 0
                  );

                  return copiasFiltradas.length > 0
                    ? copiasFiltradas.map((copia) => (
                        <tr key={copia.copia_id}>
                          <td>{libro.titulo}</td>
                          <td>{libro.autor}</td>
                          <td>
                            {
                              editoriales.find(
                                (editorial) =>
                                  editorial.id === libro.id_editorial
                              )?.nombre
                            }
                          </td>
                          <td>
                            {idiomas.length > 0
                              ? idiomas.find(
                                  (idioma) => idioma.id === libro.id_idioma
                                )?.idioma || "No disponible"
                              : "Cargando..."}
                          </td>
                          <td>{copia.copia_id}</td>
                          <td>
                            <Button
                              onClick={() => navigate('/prestar', { state: { titulo: libro.titulo, copia: copia.copia_id } })}
                              className="btn btn-primary"
                            >
                              Prestar
                            </Button>
                          </td>
                        </tr>
                      ))
                    : null;
                })
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default User;

