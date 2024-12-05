import React, { useEffect } from "react";
import Copia from "./Copia";

const Libro = ({ libro, estados, editoriales, idiomas, setLibros }) => {
  const editorialNombre =
    editoriales.find((ed) => ed.id === libro.id_editorial)?.nombre ||
    "No disponible";
  const idiomaNombre =
    idiomas.find((idioma) => idioma.id === libro.id_idioma)?.idioma ||
    "No disponible";

  // useEffect para monitorear los cambios en los estados y prestado de las copias
  useEffect(() => {
    libro.copias.forEach((copia) => {
      if (copia.estado === "presentable" && copia.prestado === 0) {
      }
    });
  }, [libro.copias]); // Se ejecuta cuando las copias del libro cambian

  const handleUpdate = (copiaId, newEstado) => {
    setLibros((prevLibros) =>
      prevLibros.map((l) =>
        l.id === libro.id
          ? {
              ...l,
              copias: l.copias.map((copia) =>
                copia.copia_id === copiaId
                  ? { ...copia, estado: newEstado, isModified: true }
                  : copia
              ),
            }
          : l
      )
    );
  };

  return (
    <>
      {libro.copias.map((copia) => (
        <Copia
          key={copia.copia_id}
          copia={copia}
          titulo={libro.titulo}
          autor={libro.autor}
          estados={estados}
          editorial={editorialNombre}
          idioma={idiomaNombre}
          onUpdate={(newEstado) => handleUpdate(copia.copia_id, newEstado)}
        />
      ))}
    </>
  );
};

export default Libro;
