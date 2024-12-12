import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import api from "../services/api";
import { Container, Form, Button, Alert } from "react-bootstrap";


const Login = ({ setUserType }) => {
  const { saveUserId } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/usuario", { username, password });
      console.log("Respuesta del servidor:", response.data);

      if (response.data.token && response.data.userType && response.data.id) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", response.data.userType);
        localStorage.setItem("id_usuario", response.data.id);

        saveUserId(response.data.id);
        setUserType(response.data.userType);

        navigate(response.data.userType === "admin" ? "/admin" : "/user");
      } else {
        setError("Datos inválidos recibidos del servidor");
      }
    } catch (err) {
      console.error("Error al autenticar:", err);
      setError("Credenciales incorrectas");
    }
  };

  const handleChange = (e) => {
    if (error) setError("");
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "password") setPassword(value);
  };

  return (
    <div
    style={{
      background: "linear-gradient(rgba(0, 0, 0, 0.85), rgba(99, 38, 117, 0.5), rgba(0, 0, 0, 0.85))",
      minHeight: '100vh',
      minWidth:'100vw',
    }}
>
      <Container className="d-flex justify-content-center align-items-center w-100 p-5">
        <div
          className="container"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
            padding: "3% ",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="text-center">Iniciar Sesión</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={handleChange}
                name="username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={handleChange}
                name="password"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Button
              variant="link"
              onClick={() => navigate("/nuevo-usuario")}
              className="text-decoration-none"
            >
              Crear nuevo usuario
            </Button>
          </div>
        </div>
      </Container>
      </div>
  );
};

export default Login;
