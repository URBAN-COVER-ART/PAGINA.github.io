const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');  // Asegúrate de importar fs

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar CORS para que tu frontend pueda acceder al backend
app.use(cors({ origin: '*' }));   // Esto permite que cualquier origen pueda hacer solicitudes. 
// Si necesitas restringir el origen, puedes usar: 
// app.use(cors({ origin: 'http://127.0.0.1:5500' }));

// Simulación de base de datos
const dataPath = path.join(__dirname, 'data');
const albumsFile = path.join(dataPath, 'albums.json');
const cartFile = path.join(dataPath, 'cart.json');

// Rutas principales

// Obtener todos los álbumes
app.get('/api/albums', (req, res) => {
    fs.readFile(albumsFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cargar los álbumes' });
        }
        res.json(JSON.parse(data));
    });
});

// Agregar un álbum al carrito
app.post('/api/cart', (req, res) => {
    const { albumId, quantity } = req.body;
    console.log('Datos recibidos:', req.body);  // Verifica si los datos están llegando correctamente

    if (!albumId || !quantity) {
        return res.status(400).json({ message: 'Faltan datos del álbum o la cantidad' });
    }

    fs.readFile(cartFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al acceder al carrito' });
        }
        const cartFile = path.join(__dirname, 'cart.json');
        const cart = JSON.parse(data);
        const existingItem = cart.find(item => item.albumId === albumId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ albumId, quantity });
        }

        console.log('Carrito actualizado:', cart);  // Verifica que el carrito esté actualizado correctamente

        fs.writeFile(cartFile, JSON.stringify(cart), err => {
            if (err) {
                return res.status(500).json({ message: 'Error al actualizar el carrito' });
            }
            res.json({ message: 'Álbum agregado al carrito', cart });
        });
    });
});
// Obtener el contenido del carrito
app.get('/api/cart', (req, res) => {
    fs.readFile(cartFile, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cargar el carrito' });
        }
        res.json(JSON.parse(data));
    });
});

// Enviar formulario de contacto
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const contactMessage = {
        name,
        email,
        message,
        date: new Date().toISOString()
    };

    fs.appendFile(
        path.join(dataPath, 'messages.json'),
        JSON.stringify(contactMessage) + '\n',
        err => {
            if (err) {
                return res.status(500).json({ message: 'Error al enviar el mensaje' });
            }
            res.json({ message: 'Mensaje enviado correctamente' });
        }
    );
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// Ruta para la raíz ("/")
app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi servidor!');
});
app.use(express.json());