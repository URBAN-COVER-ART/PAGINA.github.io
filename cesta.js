const albums = [
    { id: 1, name: "Un Verano Sin Ti", image: "UN VERANO SIN TI.png", price: 5.00 },
    { id: 2, name: "YHLQMDLG", image: "YHLQMDLG .png", price: 5.00 },
    { id: 3, name: "X 100PRE", image: "X 100PRE.png", price: 5.00 },
    { id: 4, name: "Donde Quiero Estar", image: "DONDE QUIERO ESTAR.png", price: 5.00 },
    { id: 5, name: "Easy Money Baby", image: "EMB.png", price: 5.00 },
    { id: 6, name: "Me Muevo Con Dios", image: "ME MUEVO CON DIOS.png", price: 5.00 }
];

const songs = [
    { id: 7, name: "Antidepresivos", image: "Antidepresivos.png", price: 5.00 },
    { id: 8, name: "Sanuk Sabai Saduak", image: "Sanuk Sabai Saduak.png", price: 5.00 },
    { id: 9, name: "Reina", image: "REINA.png", price: 5.00 }
];

// Unificar los productos de álbumes y canciones
const products = [...albums, ...songs];

let cart = [];

// Navigate between sections
function navigateTo(section) {
    // Ocultar todas las secciones
    document.getElementById('home-options').style.display = 'none';
    document.getElementById('products').style.display = 'none';
    document.getElementById('albums').style.display = 'none';
    document.getElementById('cart').style.display = 'none';
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('songs').style.display = 'none';
    document.getElementById('quien-somos').style.display = 'none';
    // Mostrar la sección seleccionada
    if (section === 'home') {
        document.getElementById('home-options').style.display = 'flex';
        document.getElementById('quien-somos').style.display = 'block';
    } else if (section === 'products') {
        document.getElementById('products').style.display = 'block';
    } else if (section === 'albums') {
        document.getElementById('albums').style.display = 'block';
        loadAlbums();  // Cargar los álbumes cuando se navega a esta sección
    } else if (section === 'cart') {
        document.getElementById('cart').style.display = 'block';
    } else if (section === 'songs') {
        document.getElementById('songs').style.display = 'block';
        loadSongs();
    } else if (section === 'checkout') {
        document.getElementById('checkout').style.display = 'block';
    } else if (section === 'quien-somos') {
        document.getElementById('home-options').style.display = 'flex';
        document.getElementById('quien-somos').style.display = 'block';
        document.getElementById('quien-somos').scrollIntoView({ behavior: 'smooth' });
    }
}

// Cargar productos dinámicamente
const productList = document.getElementById('product-list');
products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: $${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
});

// Mostrar mensaje de confirmación temporal cuando un producto se agrega al carrito
function showAddedMessage(productName) {
    const message = document.createElement('div');
    message.classList.add('added-message');
    message.textContent = `${productName} ha sido añadido a tu cesta.`;

    document.body.appendChild(message);

    // Después de un pequeño retraso, la animación de aparición comienza
    setTimeout(() => {
        message.classList.add('show');
    }, 0);

    // Después de 3 segundos, comienza a desvanecerse
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 3000);
}

// Agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            // Si el producto ya está en el carrito, aumentar la cantidad
            existingProduct.quantity++;
        } else {
            // Si el producto no está en el carrito, agregarlo
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        updateCartCount();  // Actualiza el contador en la cabecera
        showAddedMessage(product.name);  // Mostrar mensaje de confirmación
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    // Verificar si el carrito tiene productos
    const cartItems = document.getElementById('cart-items').children;
    if (cartItems.length === 0) {
        alert('Tu carrito está vacío. No puedes finalizar la compra.');
        return;
    }

    // Si el carrito no está vacío, se muestra una confirmación
    const total = document.getElementById('cart-total').textContent;
    const mensaje = `El total de tu compra es ${total}€. ¿Quieres continuar con el pago?`;

    // Mostrar un cuadro de confirmación
    const confirmacion = confirm(mensaje);

    if (confirmacion) {
        // Redirigir a la página de pago o procesar el pago
        window.location.href = 'https://www.paypal.com/es/home'; // Cambia 'pago.html' por la URL de la página de pago
    } else {
        alert('La compra no se ha completado.');
    }
}

// Actualizar la visualización del carrito
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';  // Limpiar los artículos del carrito

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;

        // Crear un elemento de lista con botón de eliminar
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)}€
            <button onclick="removeFromCart(${item.id})">Eliminar</button>
        `;
        cartItems.appendChild(listItem);
    });

    cartTotal.textContent = total.toFixed(2); // Actualizar total
}

// Actualizar el contador de artículos en el carrito
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0); // Muestra el número de productos en el carrito
}

// Función para eliminar productos del carrito
function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        if (product.quantity > 1) {
            // Reducir la cantidad si hay más de una
            product.quantity--;
        } else {
            // Si solo hay una, eliminar el producto del carrito
            cart = cart.filter(item => item.id !== productId);
        }
    }
    updateCart();  // Actualizar el carrito
    updateCartCount();  // Actualizar el contador de artículos
}
// Cambiar imagen de slider de productos
let currentImageIndex = 0; // Empieza con la primera imagen
function changeImage() {
    const images = [
        'UN VERANO SIN TI.png',
        'YHLQMDLG .png',
        'ME MUEVO CON DIOS.png',
        'EMB.png',
        'DONDE QUIERO ESTAR.png',
        'X 100PRE.png'
    ];
    currentImageIndex = (currentImageIndex + 1) % images.length;  // Incrementa el índice y lo reinicia si llega al final
    document.getElementById('slider-image').src = images[currentImageIndex];
}

// Cambiar imagen de slider de canciones
let currentSongIndex = 0;
function changeSongImage() {
    const songsImages = [
        'Antidepresivos.png',
        'Sanuk Sabai Saduak.png',
        'REINA.png'
    ];
    currentSongIndex = (currentSongIndex + 1) % songsImages.length;
    document.getElementById('songs-slider-image').src = songsImages[currentSongIndex];
}

// Cambiar la imagen cada 3 segundos
setInterval(() => {
    changeImage();
    changeSongImage();
}, 3000);

// Cargar los álbumes
function loadAlbums() {
    const albumList = document.getElementById('album-list');
    albumList.innerHTML = ''; // Limpiar contenido previo

    albums.forEach(album => {
        const albumDiv = document.createElement('div');
        albumDiv.innerHTML = `
            <h3>${album.name}</h3>
            <img src="${album.image}" alt="${album.name}" class="album-image">
            <p>Precio: $${album.price.toFixed(2)}</p>
            <button onclick="addToCart(${album.id})">Añadir a la cesta</button>
        `;
        albumList.appendChild(albumDiv);
    });
}

// Cargar las canciones
function loadSongs() {
    const songsList = document.getElementById('songs-list');
    songsList.innerHTML = ''; // Limpiar contenido previo

    songs.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.innerHTML = `
            <h3>${song.name}</h3>
            <img src="${song.image}" alt="${song.name}">
            <p>Precio: $${song.price.toFixed(2)}</p>
            <button onclick="addToCart(${song.id})">Añadir a la cesta</button>
        `;
        songsList.appendChild(songDiv);
    });
}
