import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useLibrary } from "../context/LibraryContext";

const User = () => {
  const { libros, editoriales, idiomas } = useLibrary();
  const navigate = useNavigate();

  const [searchTitle, setSearchTitle] = useState("");
  const [searchAutor, setSearchAutor] = useState("");
  const [searchEditorial, setSearchEditorial] = useState("");
  const [searchIdioma, setSearchIdioma] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [error, setError] = useState(null);

  // Inicializar libros filtrados cuando cargan los libros
  useEffect(() => {
    if (libros.length > 0) {
      setFilteredBooks(libros);
      setError(null);
    } else {
      setFilteredBooks([]);
      setError("No se encontraron libros disponibles.");
    }
  }, [libros]);

  // Filtrar libros cada vez que cambian los filtros
  useEffect(() => {
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

  return (
    <div
    style={{
      background: "linear-gradient(rgba(0, 0, 0, 0.85), rgba(99, 38, 117, 0.5), rgba(0, 0, 0, 0.85))",
      minHeight: '100vh',
      minWidth:'100vw',
    }}
>
      <Container className="d-flex justify-content-center align-items-center text-center p-5">
        <Row className="w-100">
          <Col md={12} className="mx-auto">
            <h1 className="text-center pb-3 fw-bold text-light">
              Libros Disponibles
            </h1>

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

            {/* Mostrar libros */}
            <Row>
              {libros.length === 0 ? (
                <div>No hay libros disponibles en este momento.</div>
              ) : (
                filteredBooks.map((libro) => {
                  const copiaDisponible = libro.copias.find(
                    (copia) =>
                      copia.estado === "presentable" && copia.prestado === 0
                  );

                  if (copiaDisponible) {
                    return (
                      <Col md={6} className="mt-4" key={libro.id}>
                        <Card className="flex-row align-items-center h-100">
                          <Card.Img
                            variant="left"
                            src={`http://localhost:5000${libro.ruta_imagen}`}
                            style={{
                              width: "150px",
                              height: "auto",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                          />
                          <Card.Body>
                            <Card.Title>{libro.titulo}</Card.Title>
                            <Card.Text>
                              <strong>Autor:</strong> {libro.autor}
                            </Card.Text>
                            <Card.Text>
                              <strong>Idioma:</strong>{" "}
                              {idiomas.find(
                                (idioma) => idioma.id === libro.id_idioma
                              )?.idioma || "No disponible"}
                            </Card.Text>
                            <Card.Text>
                              <strong>Editorial:</strong>{" "}
                              {editoriales.find(
                                (editorial) =>
                                  editorial.id === libro.id_editorial
                              )?.nombre || "No disponible"}
                            </Card.Text>
                            <Button
                              onClick={() =>
                                navigate("/prestar", {
                                  state: {
                                    titulo: libro.titulo,
                                    copia: copiaDisponible.copia_id,
                                  },
                                })
                              }
                              className="btn btn-success w-100"
                            >
                              Prestar
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  }
                  return null;
                })
              )}
            </Row>

            <div className="text-center mt-4">
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

export default User;
