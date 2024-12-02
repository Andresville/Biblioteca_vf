import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const NuevoUsuario = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        role: 'user',
        dni: '',
        direccion: '',
        telefono: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await api.put('/usuario', formData);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError('No se pudo crear el usuario. Intente nuevamente.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center mt-3 mb-5">
            <Row className="w-100">
                <Col md={8} className="mx-auto">
                    <div className="text-center mb-4">
                        <h2>Crear Nuevo Usuario</h2>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Usuario creado exitosamente. Redirigiendo...</Alert>}
                    <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                        <Form.Group className="mb-3" controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa el correo electrónico"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa la contraseña"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRole">
                            <Form.Label>Rol</Form.Label>
                            <Form.Control
                                as="select"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDni">
                            <Form.Label>DNI</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el DNI"
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDireccion">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa la dirección"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTelefono">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el teléfono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="success" type="submit" className="w-100">
                            Crear Usuario
                        </Button>
                    </Form>
                    <div className="text-center mt-4">
                        <Button
                            variant="link"
                            onClick={() => navigate('/')}
                            className="text-decoration-none"
                        >
                            Volver al inicio
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default NuevoUsuario;
