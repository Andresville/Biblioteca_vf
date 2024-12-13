import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Container, Row, Col, Button, Form } from "react-bootstrap";

const Devolver = () => {
  const [libros, setLibros] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
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

  // Método para eliminar una libro
  const handleEliminar = async (copiaId) => {
    try {
      const url = `http://localhost:5000/api/copias_libros/${copiaId}`;
      await axios.delete(url);
      alert("Copia eliminada exitosamente.");
      setLibros((prevLibros) =>
        prevLibros.map((libro) => ({
          ...libro,
          copias: libro.copias.filter((copia) => copia.copia_id !== copiaId),
        }))
      );
    } catch (err) {
      console.error("Error al eliminar la copia:", err);
      alert("Hubo un error al eliminar la copia. Inténtalo de nuevo.");
    }
  };

  // Filtrar libros según búsqueda
  const librosFiltrados = libros.filter((libro) =>
    libro.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div
    style={{
      background: "linear-gradient(rgba(0, 0, 0, 0.85), rgba(99, 38, 117, 0.5), rgba(0, 0, 0, 0.85))",
      minHeight: '100vh',
      minWidth:'100vw',
    }}
>
      <Container className="d-flex justify-content-center align-items-center text-center w-100 p-5">
        <Row className="w-100">
          <Col className="mx-auto">
            <h1 className="text-center pb-3 fw-bold text-light">
              Borra copia de un Libro
            </h1>
            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Barra de Búsqueda */}
            <Form className="mb-4">
              <Row>
                <Col md={6} sm={12} className="mb-2 mx-auto">
                  <Form.Control
                    type="text"
                    placeholder="Buscar por título"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </Col>
              </Row>
            </Form>

            {/* Tabla de libros */}
            <div className="table-responsive"  style={{ overflowY: "auto", maxHeight: "55vh" }}>
              <Table>
                <thead>
                  <tr>
                    <th className="table-dark">Título</th>
                    <th className="table-dark">Autor</th>
                    <th className="table-dark">Estados</th>
                    <th className="table-dark">Editorial</th>
                    <th className="table-dark">Idioma</th>
                    <th className="table-dark">N° de Copia</th>
                    <th className="table-dark">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {librosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        No se encontraron libros disponibles.
                      </td>
                    </tr>
                  ) : (
                    librosFiltrados.map((libro) => {
                      const copiasPrestadas = libro.copias.filter(
                        (copia) => copia.estado === "fuera de circulacion"
                      );
                      return copiasPrestadas.length > 0
                        ? copiasPrestadas.map((copia) => (
                            <tr key={copia.copia_id}>
                              <td>{libro.titulo}</td>
                              <td>{libro.autor}</td>
                              <td>{copia.estado}</td>
                              <td>
                                {editoriales.find(
                                  (editorial) =>
                                    editorial.id === libro.id_editorial
                                )?.nombre || "Desconocido"}
                              </td>
                              <td>
                                {idiomas.find(
                                  (idioma) => idioma.id === libro.id_idioma
                                )?.idioma || "Desconocido"}
                              </td>
                              <td>{copia.copia_id}</td>
                              <td>
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    handleEliminar(copia.copia_id)
                                  }
                                >
                                  Eliminar copia
                                </Button>
                              </td>
                            </tr>
                          ))
                        : null;
                    })
                  )}
                </tbody>
              </Table>
            </div>

            {/* Botón Volver */}
            <Row className="mt-4">
              <Col className="text-center">
                <Button
                  variant="link"
                  onClick={() => navigate("/Admin")}
                  className="text-decoration-none fw-bold text-light"
                >
                  Volver al detalle de libros
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Devolver;