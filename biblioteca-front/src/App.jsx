import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin';
import User from './components/User';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    const [userType, setUserType] = useState('');

    // Recuperar el tipo de usuario desde localStorage cuando el componente se monta
    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        if (storedUserType) {
            setUserType(storedUserType);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setUserType={setUserType} />} />
                <Route path="/admin" element={userType === 'admin' ? <Admin /> : <p>No autorizado</p>} />
                <Route path="/user" element={userType === 'user' ? <User /> : <p>No autorizado</p>} />
            </Routes>
        </Router>
    );
};

export default App;
