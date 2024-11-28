import React, { useState, useEffect } from 'react';
import api from '../services/api';

const User = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await api.get('/libros'); // Endpoint para obtener todos los libros
            setBooks(response.data);
        };
        fetchBooks();
    }, []);

    const filteredBooks = books.filter(
        (book) =>
            book.titulo.toLowerCase().includes(search.toLowerCase()) ||
            book.autor.toLowerCase().includes(search.toLowerCase())
    );

    const handleReserveBook = async (bookId) => {
        try {
            const response = await api.put(`/libros/${bookId}`, { disponible: false });
            alert(response.data.message);
    
            // Actualizar el estado local directamente
            setBooks((prevBooks) =>
                prevBooks.map((book) =>
                    book.id === bookId ? { ...book, disponible: false } : book
                )
            );
        } catch (err) {
            console.error('Error al reservar libro:', err);
            alert('Hubo un error al reservar el libro');
        }
    };
    
    

    return (
        <div>
            <h2>Libros Disponibles</h2>
            <input
                type="text"
                placeholder="Buscar por título o autor"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ul>
                {filteredBooks.map((book) => (
                    <li key={book.id}>
                        {book.titulo} - {book.autor} ({book.disponible ? 'Disponible' : 'No disponible'})
                        {book.disponible && (
                            <button onClick={() => handleReserveBook(book.id)}>
                                Reservar
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default User;
