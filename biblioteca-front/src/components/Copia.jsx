import React, { useState } from 'react';

const Copia = ({ copia, titulo, autor, editorial, idioma }) => {
  // Mapear los estados textuales a números
  const estadoMap = {
    "fuera de circulacion": 3,
    "reparacion": 1,
    "presentable": 2,
  };

  // Inicializar el estado con el valor numérico correspondiente
  const [estado, setEstado] = useState(estadoMap[copia.estado] || 3);
  const [modificado, setModificado] = useState(false);
  
  // Manejar cambios en el select de estado
  const handleEstadoChange = (e) => {
    setEstado(Number(e.target.value));
    setModificado(true);
  };

  // Guardar cambios enviando un PUT al backend
  const handleGuardar = async () => {
    const idCopia = copia.copia_id;

    if (!idCopia) {
      console.error('ID de la copia no válido');
      alert('Error: ID de la copia no encontrado.');
      return;
    }

    const estadoNumerico = Number(estado);
    if (isNaN(estadoNumerico)) {
      console.error('El estado debe ser un número válido.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/copias_libros/${idCopia}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_estado: estadoNumerico }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el estado.');
      }

      alert(`Estado actualizado correctamente para la copia ID ${idCopia}`);
      setModificado(false);
    } catch (error) {
      console.error('Error al guardar el estado:', error);
      alert(`No se pudo guardar el estado: ${error.message}`);
    }
  };


  return (
    <tr>
      <td>{titulo}</td>
      <td>{autor}</td>
      <td>
        <select
          value={estado}
          onChange={handleEstadoChange}
          className="form-select"
          style={{ minWidth: '200px', padding: '8px' }}
        >
          <option value={3}>Fuera de circulación</option>
          <option value={1}>Reparación</option>
          <option value={2}>Presentable</option>
        </select>
      </td>
      <td>{editorial}</td>
      <td>{idioma}</td>
      <td>{copia.copia_id}</td>
      <td>{copia.prestado ? 'Sí' : 'No'}</td>
      <td>
        {modificado && (
          <button onClick={handleGuardar} className="btn btn-primary btn-sm">
            Guardar
          </button>
        )}
      </td>
    </tr>
  );
};

export default Copia;




