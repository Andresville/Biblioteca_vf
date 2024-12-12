import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import NuevoUsuario from './components/NuevoUsuario';
import NuevoLibro from './components/NuevoLibro';
import Admin from './components/Admin';
import User from './components/User';
import Prestar from './components/Prestar';
import Devolucion from './components/Devolucion';
import EliminarCopia from './components/EliminarCopia';
import { UserProvider } from './Context/UserContext';
import { LibraryProvider } from './context/LibraryContext';
import 'bootstrap/dist/css/bootstrap.min.css';



const App = () => {
    const [userType, setUserType] = useState(() => {
        return localStorage.getItem('userType') || '';
    });

    useEffect(() => {
        if (userType) {
            localStorage.setItem('userType', userType);
        }
    }, [userType]);

    return (
        <UserProvider>
            <LibraryProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login setUserType={setUserType} />} />
                <Route path="/nuevo-usuario" element={<NuevoUsuario />} />
                <Route path="/admin" element={userType === 'admin' ? <Admin /> : <p>No autorizado</p>} />
                <Route path="/user" element={userType === 'user' ? <User /> : <p>No autorizado</p>} />
                <Route path="/prestar" element={<Prestar />} />
                <Route path="/devolucion" element={<Devolucion />} />
                <Route path="/nuevo-libro" element={<NuevoLibro />} />
                <Route path="/eliminar-copia" element={<EliminarCopia />} />
            </Routes>
        </Router>
        </LibraryProvider>
        </UserProvider>
    );
};

export default App;
