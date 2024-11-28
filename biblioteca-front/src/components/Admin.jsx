import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';

const Admin = () => {
  const [libros, setLibros] = useState([]);
  const [estados, setEstados] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Obtener libros, estados, editoriales, idiomas desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const librosRes = await axios.get('http://localhost:5000/api/libros');
        const estadosRes = await axios.get('http://localhost:5000/api/estados');
        const editorialesRes = await axios.get('http://localhost:5000/api/editorial');
        const idiomasRes = await axios.get('http://localhost:5000/api/idioma');

        setLibros(librosRes.data);
        setEstados(estadosRes.data);
        setEditoriales(editorialesRes.data);
        setIdiomas(idiomasRes.data);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError('No se pudo cargar la información. Intenta de nuevo.');
      }
    };

    fetchData();
  }, []);

  // Manejar cambio de estado de libro
  const handleUpdate = (id, newEstado) => {
    setLibros(libros.map(libro => {
      if (libro.id === id) {
        return { ...libro, id_estado: newEstado, isModified: true };
      }
      return libro;
    }));
  };

  // Guardar cambios en el backend
  const saveChanges = async (id, newEstado) => {
    try {
      setError(null); // Resetear errores
      // Verificar que newEstado sea un número
      if (typeof newEstado !== 'number') {
        throw new Error('Datos inválidos.');
      }

      const libroActualizado = { id_estado: newEstado };

      // Actualizar en el backend (solo actualiza id_estado)
      await axios.put(`http://localhost:5000/api/libros/${id}`, libroActualizado);

      // Actualizar estado local
      setLibros((prevLibros) =>
        prevLibros.map((libro) =>
          libro.id === id ? { ...libro, id_estado: newEstado, isModified: false } : libro
        )
      );

      setSuccessMessage('Cambios guardados correctamente.');
    } catch (err) {
      console.error('Error al guardar los cambios:', err);
      setError(err.message || 'No se pudo guardar los cambios. Inténtalo de nuevo.');
    }
  };

  // Renderizar filas de la tabla
  const renderTableRows = () => {
    return libros.map((libro) => (
      <tr key={libro.id}>
        <td>{libro.titulo}</td>
        <td>{libro.autor}</td>
        <td>
          <Form.Control
            as="select"
            value={libro.id_estado}
            onChange={(e) => handleUpdate(libro.id, parseInt(e.target.value, 10))}
          >
            {estados.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.estado}
              </option>
            ))}
          </Form.Control>
          {libro.isModified && (
            <Button
              variant="primary"
              className="mt-2"
              onClick={() => saveChanges(libro.id, libro.id_estado)}
            >
              Guardar cambios
            </Button>
          )}
        </td>
        <td>{editoriales.find((ed) => ed.id === libro.id_editorial)?.nombre || 'No disponible'}</td>
        <td>{idiomas.find((idioma) => idioma.id === libro.id_idioma)?.idioma || 'No disponible'}</td>
        <td>{libro.cantidad}</td> {/* Nueva columna para la cantidad */}
      </tr>
    ));
  };

  return (
    <div>
      <h1>Gestión de Libros</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Estado</th>
            <th>Editorial</th>
            <th>Idioma</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </Table>
    </div>
  );
};

export default Admin;


