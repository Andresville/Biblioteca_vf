import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Necesitamos para la redirección
import api from '../services/api';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'; // Importar componentes de Bootstrap

const Login = ({ setUserType }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook de React Router para redirigir

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/usuario', { username, password });
            console.log('Respuesta del servidor:', response.data);
    
            // Guardar token en localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userType', response.data.userType);  // Guardar tipo de usuario
    
            setUserType(response.data.userType); // Guardar el tipo de usuario en el estado
    
            // Redirigir según el tipo de usuario
            if (response.data.userType === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (err) {
            console.error('Error al autenticar:', err);
            setError('Credenciales incorrectas');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row className="w-100">
                <Col md={6} className="mx-auto">
                    <div className="text-center mb-4">
                        <h2>Iniciar Sesión</h2>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Iniciar Sesión
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
