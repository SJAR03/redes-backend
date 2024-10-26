const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Permitir solicitudes JSON

// Configurar el pool de conexiones a la base de datos MySQL
const pool = mysql.createPool({
    //host: '10.221.130.88',
    //host: '192.168.1.15',
    host: '2.tcp.ngrok.io',
    user: 'remoto', // Usuario de MySQL
    password: 'remoto123', // Contraseña de MySQL
    database: 'Redes',
    //port: 3306,
    port: 14504,
    waitForConnections: true,
    connectionLimit: 10, // Máximo de conexiones en el pool
    queueLimit: 0
});

// Rutas CRUD

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    pool.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Crear un nuevo usuario
app.post('/usuarios', (req, res) => {
    const { nombre, email } = req.body;
    pool.query(
        'INSERT INTO usuarios (nombre, email) VALUES (?, ?)',
        [nombre, email],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: result.insertId, nombre, email });
        }
    );
});

// Actualizar un usuario existente
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    pool.query(
        'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
        [nombre, email, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Usuario actualizado correctamente' });
        }
    );
});

// Eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    });
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log('Servidor backend escuchando en el puerto 3001');
});
