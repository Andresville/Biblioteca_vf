import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    // Inicializamos el estado con el valor almacenado en localStorage o null
    const [userId, setUserId] = useState(localStorage.getItem('id_usuario') || null);

    // Función para establecer el id del usuario
    const saveUserId = (id) => {
        setUserId(id);
        localStorage.setItem('id_usuario', id); // Guardar en localStorage
    };

    return (
        <UserContext.Provider value={{ userId, saveUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
