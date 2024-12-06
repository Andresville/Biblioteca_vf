import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Container, Row, Col, Button } from "react-bootstrap";

const Devolver = () => {
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

  // Método para eliminar un préstamo
  const handleDevolver = async (copiaId) => {
    try {
      const url = `http://localhost:5000/api/prestados/${copiaId}`; // URL correcta
      await axios.delete(url);
      alert("Libro devuelto exitosamente.");
      // Actualizar la lista de libros después de devolver uno
      setLibros((prevLibros) =>
        prevLibros.map((libro) => ({
          ...libro,
          copias: libro.copias.filter((copia) => copia.copia_id !== copiaId),
        }))
      );
    } catch (err) {
      console.error("Error al devolver el libro:", err);
      alert("Hubo un error al devolver el libro. Inténtalo de nuevo.");
    }
  };

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
                    (copia) => copia.prestado === 1
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
                              onClick={() => {
                                console.log(
                                  "ID de la copia para devolver:",
                                  copia.copia_id
                                ); // Log para verificar el ID
                                handleDevolver(copia.copia_id);
                              }}
                              className="btn btn-danger"
                            >
                              Devolver
                            </Button>
                          </td>
                        </tr>
                      ))
                    : null;
                })
              )}
            </tbody>
          </Table>
          <div className="text-center mt-4">
                        <Button
                            variant="link"
                            onClick={() => navigate('/Admin')}
                            className="text-decoration-none"
                        >
                            Volver al detalle de libros
                        </Button>
                    </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Devolver;
