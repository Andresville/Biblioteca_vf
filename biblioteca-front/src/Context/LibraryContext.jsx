import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Crear el contexto
const LibraryContext = createContext();

// Hook personalizado para consumir el contexto
export const useLibrary = () => useContext(LibraryContext);

// Proveedor del contexto
export const LibraryProvider = ({ children }) => {
  const [libros, setLibros] = useState([]);
  const [estados, setEstados] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [librosRes, estadosRes, editorialesRes, idiomasRes] = await Promise.all([
          axios.get('http://localhost:5000/api/libros'),
          axios.get('http://localhost:5000/api/estados'),
          axios.get('http://localhost:5000/api/editorial'),
          axios.get('http://localhost:5000/api/idioma'),
        ]);

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

  // Métodos centralizados
  const devolverLibro = async (copiaId) => {
    try {
      const url = `http://localhost:5000/api/prestados/${copiaId}`;
      await axios.delete(url);

      // Actualizar el estado de los libros
      setLibros((prevLibros) =>
        prevLibros.map((libro) => ({
          ...libro,
          copias: libro.copias.filter((copia) => copia.copia_id !== copiaId),
        }))
      );

      alert('Libro devuelto exitosamente.');
    } catch (err) {
      console.error('Error al devolver el libro:', err);
      alert('Hubo un error al devolver el libro. Inténtalo de nuevo.');
    }
  };

  const agregarLibro = async (nuevoLibro) => {
    try {
      const res = await axios.post('http://localhost:5000/api/libros', nuevoLibro);
      setLibros((prevLibros) => [...prevLibros, res.data]);
      alert('Libro agregado exitosamente.');
    } catch (err) {
      console.error('Error al agregar el libro:', err);
      alert('No se pudo agregar el libro. Intenta de nuevo.');
    }
  };

  const editarLibro = async (libroId, datosActualizados) => {
    try {
      await axios.put(`http://localhost:5000/api/libros/${libroId}`, datosActualizados);
      setLibros((prevLibros) =>
        prevLibros.map((libro) =>
          libro.id === libroId ? { ...libro, ...datosActualizados } : libro
        )
      );
      alert('Libro actualizado exitosamente.');
    } catch (err) {
      console.error('Error al actualizar el libro:', err);
      alert('No se pudo actualizar el libro. Intenta de nuevo.');
    }
  };

  const filtrarLibros = (criterios) => {
    // Implementar lógica para filtrar libros en base a criterios específicos
    return libros.filter((libro) =>
      Object.keys(criterios).every((key) => libro[key] === criterios[key])
    );
  };

  // Valores disponibles en el contexto
  return (
    <LibraryContext.Provider
      value={{
        libros,
        setLibros,
        estados,
        editoriales,
        idiomas,
        error,
        devolverLibro,
        agregarLibro,
        editarLibro,
        filtrarLibros,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
