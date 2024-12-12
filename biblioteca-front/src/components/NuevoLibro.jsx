import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const NuevoLibro = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    ISBN: "",
    estado: "",
    editorial: "",
    idioma: "",
    cantidad: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const dataToSend = {
      ...formData,
      estado: parseInt(formData.estado, 10),
      editorial: parseInt(formData.editorial, 10),
      idioma: parseInt(formData.idioma, 10),
      cantidad: parseInt(formData.cantidad, 10),
      ruta_imagen: formData.ruta_imagen,
    };

    try {
      console.log(dataToSend);
      await api.put("/libros", dataToSend);

      setSuccess(true);
      setTimeout(() => navigate("/Admin"), 2000);
    } catch (err) {
      setError("No se pudo cargar el nuevo libro. Intente nuevamente.");
    }
  };

  return (
    <div
      style={{
        background:"linear-gradient(rgba(0, 0, 0, 0.85), rgba(99, 38, 117, 0.5), rgba(0, 0, 0, 0.85))",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center w-100 p-5">
        <Row className="w-100">
          <Col md={9} className="mx-auto">
            <h1 className="text-center pb-3 fw-bold text-light">Nuevo Libro</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
              <Alert variant="success">
                Libro registrado exitosamente. Redirigiendo...
              </Alert>
            )}
            <Form
              onSubmit={handleSubmit}
              className="shadow p-4 rounded bg-light"
            >
              <Form.Group className="mb-3" controlId="formTitulo">
                <Form.Label>Titulo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAutor">
                <Form.Label>Autor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el autor"
                  name="autor"
                  value={formData.autor}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formISBN">
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el ISBN"
                  name="ISBN"
                  value={formData.ISBN}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formImg">
                <Form.Label>Ruta Imagen</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="/static/Img/Nombre_Imagen.jpg"
                  name="ruta_imagen"
                  value={formData.ruta_imagen}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value={0}></option>
                  <option value={2}>Presentable</option>
                  <option value={1}>Reparacion</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEditorial">
                <Form.Label>Editoria</Form.Label>
                <Form.Control
                  as="select"
                  name="editorial"
                  value={formData.editorial}
                  onChange={handleChange}
                  required
                >
                  <option value={0}></option>
                  <option value={1}>Editorial Planeta</option>
                  <option value={2}>Penguin Random House</option>
                  <option value={3}>Alfaguara</option>
                  <option value={4}>RBA Libros</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formIdioma">
                <Form.Label>Idioma</Form.Label>
                <Form.Control
                  as="select"
                  name="idioma"
                  value={formData.idioma}
                  onChange={handleChange}
                  required
                >
                  <option value={0}></option>
                  <option value={1}>Español</option>
                  <option value={2}>Inglés</option>
                  <option value={3}>Francés</option>
                  <option value={4}>Alemán</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCantidad">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa la cantidad de libros"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100">
                Registrar Nuevo Libro
              </Button>
            </Form>
            <div className="text-center mt-4">
              <Button
                variant="link"
                onClick={() => navigate("/Admin")}
                className="text-decoration-none fw-bold text-light"
              >
                Volver al detalle de libros
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NuevoLibro;
