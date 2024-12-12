import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom"; 
import { useUser } from "../Context/UserContext";
import api from '../services/api';

const Prestar = () => {
    const location = useLocation(); 
    const { titulo } = location.state || {};
    const { copia } = location.state || {};

    const { userId } = useUser();

    const [formData, setFormData] = useState({
        titulo: titulo,
        copia: copia,
        fecha_prestamo: '',
        fecha_devolucion: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            console.log("El usuario no está identificado. Redirigiendo...");
            navigate("/"); 
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!userId) {
            console.log('userId no definido:', userId);
            setError('No se pudo identificar al usuario. Intente iniciar sesión nuevamente.');
            return;
        }

        const dataToSend = { ...formData, id_usuario: userId };

        console.log(dataToSend);

        try {
            await api.put('/prestados', dataToSend);
            setSuccess(true);
            setTimeout(() => navigate('/user'), 2000);
        } catch (err) {
            setError('No se pudo crear el prestamo. Intente nuevamente.');
        }
    };

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
                <Col md={8} className="mx-auto">
                    <div className="text-center mb-4">
                        <h1 className="text-center pb-3 fw-bold text-light">Crear Prestamo</h1>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Prestamo creado exitosamente. Redirigiendo...</Alert>}
                    <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                        
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Fecha Prestamo</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Ingresa la fecha"
                                name="fecha_prestamo"
                                value={formData.fecha_prestamo}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Fecha Devolucion</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Ingresa la fecha"
                                name="fecha_devolucion"
                                value={formData.fecha_devolucion}
                                onChange={handleChange}
                                required
                            />
                            
                        </Form.Group>
                        
                        <Button variant="success" type="submit" className="w-100">
                            Crear Prestamo
                        </Button>
                    </Form>
                    <div className="text-center mt-4">
                        <Button
                            variant="link"
                            onClick={() => navigate('/User')}
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

export default Prestar;
