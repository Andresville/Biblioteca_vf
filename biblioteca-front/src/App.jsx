import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import NuevoUsuario from './components/NuevoUsuario';
import Admin from './components/Admin';
import User from './components/User';
import Prestar from './components/Prestar';
import Devolucion from './components/Devolucion';
import { UserProvider } from './components/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    const [userType, setUserType] = useState(() => {
        // Inicializar con el valor almacenado en localStorage
        return localStorage.getItem('userType') || '';
    });

    // Actualizar localStorage cuando cambia userType
    useEffect(() => {
        if (userType) {
            localStorage.setItem('userType', userType);
        }
    }, [userType]);

    return (
        <UserProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login setUserType={setUserType} />} />
                <Route path="/nuevo-usuario" element={<NuevoUsuario />} />
                <Route path="/admin" element={userType === 'admin' ? <Admin /> : <p>No autorizado</p>} />
                <Route path="/user" element={userType === 'user' ? <User /> : <p>No autorizado</p>} />
                <Route path="/prestar" element={<Prestar />} />
                <Route path="/devolucion" element={<Devolucion />} />
            </Routes>
        </Router>
        </UserProvider>
    );
};

export default App;
