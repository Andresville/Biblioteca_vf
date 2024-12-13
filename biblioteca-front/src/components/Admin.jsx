import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import Libro from "./Libro";
import { Table, Container, Row, Col, Button, Form } from "react-bootstrap";

const Admin = () => {
  const { libros, estados, editoriales, idiomas, error } = useLibrary();
  const navigate = useNavigate();

  // Estados para los filtros de búsqueda
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAutor, setSearchAutor] = useState("");
  const [searchEditorial, setSearchEditorial] = useState("");
  const [searchIdioma, setSearchIdioma] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(libros);

  useEffect(() => {
    // Filtrando los libros según los valores de búsqueda
    const filtered = libros.filter((libro) => {
      const editorial = editoriales
        .find((ed) => ed.id === libro.id_editorial)
        ?.nombre.toLowerCase();
      const idioma = idiomas
        .find((idioma) => idioma.id === libro.id_idioma)
        ?.idioma.toLowerCase();

      return (
        libro.titulo.toLowerCase().includes(searchTitle.toLowerCase()) &&
        libro.autor.toLowerCase().includes(searchAutor.toLowerCase()) &&
        (editorial?.includes(searchEditorial.toLowerCase()) ||
          searchEditorial === "") &&
        (idioma?.includes(searchIdioma.toLowerCase()) || searchIdioma === "")
      );
    });

    setFilteredBooks(filtered);
  }, [
    searchTitle,
    searchAutor,
    searchEditorial,
    searchIdioma,
    libros,
    editoriales,
    idiomas,
  ]);

  // Comprobamos si hay alguna búsqueda activa
  const isSearchActive =
    searchTitle || searchAutor || searchEditorial || searchIdioma;

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
            <h1 className="text-center pb-3 fw-bold text-light">Gestión de Libros</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Barra de Búsqueda */}
            <Form className="mb-4">
              <Row>
                <Col md={3} sm={12} className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Buscar por título"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                  />
                </Col>
                <Col md={3} sm={12} className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Buscar por autor"
                    value={searchAutor}
                    onChange={(e) => setSearchAutor(e.target.value)}
                  />
                </Col>
                <Col md={3} sm={12} className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Buscar por editorial"
                    value={searchEditorial}
                    onChange={(e) => setSearchEditorial(e.target.value)}
                  />
                </Col>
                <Col md={3} sm={12} className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Buscar por idioma"
                    value={searchIdioma}
                    onChange={(e) => setSearchIdioma(e.target.value)}
                  />
                </Col>
              </Row>
            </Form>

            {/* Mostrar la tabla solo si hay una búsqueda activa */}
            {isSearchActive && (
              <div className="table-responsive" style={{ overflowY: "auto", maxHeight: "55vh" }}>
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
                    filteredBooks.map((libro) => (
                      <React.Fragment key={libro.id}>
                        <Libro
                          libro={libro}
                          estados={estados}
                          editoriales={editoriales}
                          idiomas={idiomas}
                        />
                        <tr className="table-dark">
                          <td colSpan="8">
                            Total de libros disponibles para ser prestados:{" "}
                            {libro.total_disponibles}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </Table>
              </div>
            )}

            <div className="text-center mt-4">
              <Button
                variant="primary"
                onClick={() => navigate("/devolucion")}
                className="text-decoration-none text-light w-100"
              >
                Registrar Devoluciones
              </Button>
            </div>
            <div className="text-center mt-2">
              <Button
                variant="primary"
                onClick={() => navigate("/nuevo-libro")}
                className="text-decoration-none text-light w-100"
              >
                Registrar Nuevo Libro
              </Button>
            </div>
            <div className="text-center mt-2">
              <Button
                variant="danger"
                onClick={() => navigate("/eliminar-copia")}
                className="text-decoration-none text-light w-100"
              >
                Borra Copia de un Libro
              </Button>
            </div>
            <div className="text-center mt-2">
              <Button
                variant="link"
                onClick={() => navigate("/")}
                className="text-decoration-none fw-bold text-light"
              >
                Cerrar Sesión
              </Button>
            </div>
          </Col>
        </Row>
      
    </Container>
    </div>
  );
};

export default Admin;
