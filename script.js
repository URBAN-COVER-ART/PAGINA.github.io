const albums = [
    { id: 1, name: "Un Verano Sin Ti", image: "5.png", price: 7.95, type: "albums" },
    { id: 13, name: "BUENAS NOCHES", image: "13.png", price: 7.95, type: "albums" },
    { id: 2, name: "YHLQMDLG", image: "3.png", price: 7.95, type: "albums" },
    { id: 12, name: "DeBI TiRAR MAS FOToS", image: "12.png", price: 7.95, type: "albums" },
    { id: 3, name: "X 100PRE", image: "4.png", price: 7.95, type: "albums" },
    { id: 4, name: "Donde Quiero Estar", image: "6.png", price: 7.95, type: "albums" },
    { id: 5, name: "Easy Money Baby", image: "1.png", price: 7.95, type: "albums" },
    { id: 6, name: "Me Muevo Con Dios", image: "2.png", price: 7.95, type: "albums" },
    { id: 7, name: "Saturno", image: "11.png", price: 7.95, type: "albums" }
];

const songs = [
    { id: 8, name: "Antidepresivos", image: "7.png", price: 7.95, type: "songs" },
    { id: 9, name: "Sanuk Sabai Saduak", image: "8.png", price: 7.95, type: "songs" },
    { id: 10, name: "Reina", image: "9.png", price: 7.95, type: "songs" },
    { id: 11, name: "7 Lagrimas - Remix", image: "10.png", price: 7.95, type: "songs" }
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
    document.getElementById('payment-container').style.display = 'none';
    document.getElementById('quien-somos').style.display = 'none';
    // Mostrar la sección seleccionada
    if (section === 'home') {
        if (window.matchMedia("(max-width: 678px)").matches) {
            document.getElementById('home-options').style.display = 'block';
            document.getElementById('quien-somos').style.display = 'block';
        } else {
            document.getElementById('home-options').style.display = 'flex';
            document.getElementById('quien-somos').style.display = 'block';
        }

    } else if (section === 'products') {
        document.getElementById('products').style.display = 'block';
    } else if (section === 'albums') {
        document.getElementById('albums').style.display = 'block';
        loadAlbums();
    } else if (section === 'cart') {
        document.getElementById('cart').style.display = 'block';

    } else if (section === 'songs') {
        document.getElementById('songs').style.display = 'block';
        loadSongs();
    } else if (section === 'checkout') {
        document.getElementById('checkout').style.display = 'block';
    } else if (section === 'quien-somos') {
        if (window.matchMedia("(max-width: 678px)").matches) {
            document.getElementById('home-options').style.display = 'block';
            document.getElementById('quien-somos').style.display = 'block';
            document.getElementById('quien-somos').scrollIntoView({ behavior: 'smooth' });
        } else {
            document.getElementById('home-options').style.display = 'flex';
            document.getElementById('quien-somos').style.display = 'flex';
            document.getElementById('quien-somos').scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Mostrar mensaje de confirmación temporal cuando un producto se agrega al carrito
function MostrarMensaje(productName, productType) {
    const message = document.createElement('div');
    message.classList.add('added-message');
    if (productType === 'albums') {
        message.textContent = `El álbum "${productName}" ha sido añadido a tu cesta.`;
    } else if (productType === 'songs') {
        message.textContent = `La canción "${productName}" ha sido añadida a tu cesta.`;
    }
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

// Modificar la función `addToCart` para guardar el carrito cada vez que cambie
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingProduct = cart.find(item => item.id === product.id);
        
        if (existingProduct) {
            // Si el producto ya está en el carrito, incrementamos su cantidad
            existingProduct.quantity++;
        } else {
            // Si no está, lo añadimos al carrito con cantidad 1
            cart.push({ ...product, quantity: 1 });
        }

        // Actualizamos el carrito visualmente y los contadores
        updateCart();
        updateCartCount();
        MostrarMensaje(product.name, product.type);
        
        
        saveCartToLocalStorage();

        // Recargamos los productos (álbumes y canciones) con los precios actualizados
        loadAlbums();  // Recarga los álbumes
        loadSongs();   // Recarga las canciones

        // Animación de vibración en el icono del carrito
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('shake'); // Añadimos clase de vibración
            setTimeout(() => {
                cartIcon.classList.remove('shake'); // Quitamos la clase tras la animación
            }, 500); // Duración de la animación
        }

}}

// Función para finalizar la compra
function finalizarCompra() {
    console.log('Función llamada');
    const cartItems = document.getElementById('cart-items').children;
    console.log('Número de ítems en el carrito:', cartItems.length);

    if (cartItems.length === 0) {
        alert('Tu cesta está vacía. No puedes finalizar la compra.');
        return;
    }

    const total = document.getElementById('cart-total').textContent;
    console.log('Total del carrito:', total);

    const mensaje = `El total de tu compra es ${total}€. ¿Quieres continuar con el pago?`;
    const confirmacion = confirm(mensaje);

    if (confirmacion) {
        console.log('Compra confirmada');
        document.getElementById('cart').style.display = 'none';
        document.getElementById('payment-container').style.display = 'block';
    } else {
        console.log('Compra cancelada');
        alert('La compra no se ha completado.');
    }
}

// Actualizar la visualización del carrito
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';  // Limpiar los artículos del carrito

    let total = 0;
    let totalQuantity = 0;  // Contador para la cantidad total de productos
    let productIndex = 0;   // Para llevar el conteo de los productos y aplicar los descuentos

    cart.forEach(item => {
        totalQuantity += item.quantity;  // Sumar la cantidad total de productos

        let itemTotalPrice = 0; // Precio total del producto con el descuento aplicado

        // Calcular el precio para cada unidad del producto
        for (let i = 0; i < item.quantity; i++) {
            let priceToUse = item.price; // Precio normal

            // Si es el segundo producto o el siguiente, aplicar el precio con descuento
            if (productIndex % 2 === 1) {
                priceToUse = 3.95;  // Aplicamos 2.95€ por el segundo producto
            }

            itemTotalPrice += priceToUse;
            productIndex++; // Aumentamos el índice de productos
        }

        // Crear un elemento de lista con botón de eliminar
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="item-image-container"><img src="${item.image}" alt="${item.name}" class="cart-item-image"></span>
            ${item.name} x${item.quantity} = ${itemTotalPrice.toFixed(2)}€
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
        `;
        
        cartItems.appendChild(listItem);

        // Añadir el precio del producto al total global
        total += itemTotalPrice;
    });

    // Mostrar el total final en la página
    cartTotal.textContent = total.toFixed(2); // Actualizar total
}



// Actualizar el contador de artículos en el carrito
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0); // Muestra el número de productos en el carrito
}

// Modificar la función `removeFromCart` para guardar el carrito después de eliminar productos
function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        if (product.quantity > 1) {
            product.quantity--;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
        updateCart();
        updateCartCount();
        saveCartToLocalStorage();
        
    }
    // Animación de vibración en el ícono del carrito al eliminar 
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('shake'); // Añadir clase de vibración
        setTimeout(() => {
            cartIcon.classList.remove('shake'); // Quitar clase tras la animación
        }, 500); // Duración de la animación
    }
}

// Llamar a `loadCartFromLocalStorage` al cargar la página
window.addEventListener('load', () => {
    loadCartFromLocalStorage();
});









// Cambiar imagen de slider de albums
let currentImageIndex = 0; // Empieza con la primera imagen
function changeImage() {
    const images = [
        'Imagenes_albums/1.png',
        '2.png',
        '3.png',
        '4.png',
        '5.png',
        '6.png',
        '12.png',
        '13.png'
    ];
    currentImageIndex = (currentImageIndex + 1) % images.length;  // Incrementa el índice y lo reinicia si llega al final
    document.getElementById('albums-slider-image').src = images[currentImageIndex];
}

// Cambiar imagen de slider de canciones
let currentSongIndex = 0; // Empieza con la primera imagen
function changeSongImage() {
    const songsImages = [
        '7.png',
        '8.png',
        '9.png',
        '10.png'
    ];
    currentSongIndex = (currentSongIndex + 1) % songsImages.length; // Incrementa el índice y lo reinicia si llega al final
    document.getElementById('songs-slider-image').src = songsImages[currentSongIndex];
}

// Cambiar la imagenes cada 3 segundos
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

        // Verificar si el producto está en el carrito y cuántos productos en total hay
        const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
        
        let priceToDisplay = album.price; // El precio normal
        let priceClass = 'price-normal';  // Establecer la clase por defecto

        // Si hay más de un producto en el carrito, el segundo producto cuesta 3.95€
        if (totalQuantity % 2 !== 0) {
            priceToDisplay = 3.95;  // El precio de descuento
            priceClass = 'price-discount';  // Cambiar la clase a la del descuento
        }

        albumDiv.innerHTML = `
            <h3>${album.name}</h3>
            <img src="${album.image}" alt="${album.name}">
            <p><span class="price-label ${priceClass}">Precio: ${priceToDisplay.toFixed(2)}€</span></p>
            <button onclick="addToCart(${album.id})">Añadir a la cesta</button>
        `;
        albumList.appendChild(albumDiv);
    });
}

function loadSongs() {
    const songsList = document.getElementById('songs-list');
    songsList.innerHTML = ''; // Limpiar contenido previo

    songs.forEach(song => {
        const songDiv = document.createElement('div');

        // Verificar si el producto está en el carrito y cuántos productos en total hay
        const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

        let priceToDisplay = song.price; // El precio normal
        let priceClass = 'price-normal';  // Establecer la clase por defecto

        // Si hay más de un producto en el carrito, el segundo producto cuesta 3.95€
        if (totalQuantity % 2 !== 0) {
            priceToDisplay = 3.95;  // El precio de descuento
            priceClass = 'price-discount';  // Cambiar la clase a la del descuento
        }

        songDiv.innerHTML = `
            <h3>${song.name}</h3>
            <img src="${song.image}" alt="${song.name}">
            <p><span class="price-label ${priceClass}">Precio: ${priceToDisplay.toFixed(2)}€</span></p>
            <button onclick="addToCart(${song.id})">Añadir a la cesta</button>
        `;

        songsList.appendChild(songDiv);
    });
}

window.addEventListener('scroll', function () {
    var nav = document.querySelector('nav');  // Selecciona el nav
    if (window.scrollY > nav.offsetTop) {  // Si el desplazamiento es mayor que la posición inicial del nav
        nav.classList.add('fixed');  // Agrega la clase 'fixed' al nav
    } else {
        nav.classList.remove('fixed');  // Si está en la parte superior, elimina la clase
    }
});

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
        updateCartCount();
    }
}

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const contactData = {
        name: name,
        email: email,
        message: message
    };

    
});






document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
        const target = option.getAttribute('data-target');
        navigateTo(target);
    });
});


document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});


//Busqueda
document.getElementById('search-bar').addEventListener('input', function () {
    const query = this.value.toLowerCase(); // Obtener el texto ingresado y convertirlo a minúsculas

    if (query === '') {
        navigateTo('home'); // Ir a la sección de inicio
        return; // Detener el resto de la ejecución
    }

    // Filtrar álbumes y canciones
    const filteredAlbums = albums.filter(album => album.name.toLowerCase().includes(query));
    const filteredSongs = songs.filter(song => song.name.toLowerCase().includes(query));

    // Ocultar los <h2> de las secciones de álbumes y canciones
    const albumTitle = document.querySelector('#albums h3');
    const songTitle = document.querySelector('#songs h3');
    if (albumTitle) albumTitle.style.display = 'none';
    if (songTitle) songTitle.style.display = 'none';

    if (filteredAlbums.length > 0) {
        navigateTo('albums'); // Ir a la sección de álbumes
        const albumList = document.getElementById('album-list');
        albumList.innerHTML = ''; // Limpiar la lista de álbumes

        // Mostrar los álbumes filtrados
        filteredAlbums.forEach(album => {
            const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

            let priceToDisplay = album.price; // Precio normal
            let priceClass = 'price-normal'; // Clase por defecto

            // Determinar precio y clase basada en la cantidad total de productos
            if (totalQuantity % 2 !== 0) {
                priceToDisplay = 3.95; // Precio con descuento
                priceClass = 'price-discount'; // Clase para precio con descuento
            }

            const albumDiv = document.createElement('div');
            albumDiv.innerHTML = `
                <h3>${album.name}</h3>
                <img src="${album.image}" alt="${album.name}" class="album-image">
                <p class="${priceClass}">Precio: ${priceToDisplay.toFixed(2)}€</p>
                <button onclick="addToCart(${album.id}, true)">Añadir a la cesta</button>
            `;
            albumList.appendChild(albumDiv);
        });

        // Mostrar el <h2> de la sección de álbumes de nuevo
        albumTitle.style.display = 'block';
    } else if (filteredSongs.length > 0) {
        navigateTo('songs'); // Ir a la sección de canciones
        const songsList = document.getElementById('songs-list');
        songsList.innerHTML = ''; // Limpiar la lista de canciones

        // Mostrar las canciones filtradas
        filteredSongs.forEach(song => {
            const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

            let priceToDisplay = song.price; // Precio normal
            let priceClass = 'price-normal'; // Clase por defecto

            // Determinar precio y clase basada en la cantidad total de productos
            if (totalQuantity % 2 !== 0) {
                priceToDisplay = 3.95; // Precio con descuento
                priceClass = 'price-discount'; // Clase para precio con descuento
            }

            const songDiv = document.createElement('div');
            songDiv.innerHTML = `
                <h3>${song.name}</h3>
                <img src="${song.image}" alt="${song.name}">
                <p class="${priceClass}">Precio: ${priceToDisplay.toFixed(2)}€</p>
                <button onclick="addToCart(${song.id}, true)">Añadir a la cesta</button>
            `;
            songsList.appendChild(songDiv);
        });

        // Mostrar el <h2> de la sección de canciones de nuevo
        songTitle.style.display = 'block';
    } else {
        // Mostrar mensaje "SIN RESULTADOS" en la sección correspondiente
        if (albums.length > 0) {
            navigateTo('albums'); // Ir a álbumes
            const albumList = document.getElementById('album-list');
            albumList.innerHTML = '<div class="no-results">SIN RESULTADOS. Recuerda que lo puedes solicitar en el apartado "Contacto".</div>';
        } else if (songs.length > 0) {
            navigateTo('songs'); // Ir a canciones
            const songsList = document.getElementById('songs-list');
            songsList.innerHTML = '<div class="no-results">SIN RESULTADOS. Recuerda que lo puedes solicitar en el apartado "Contacto".</div>';
        }
    }
});
// Inicializa Stripe con tu clave pública
const stripe = Stripe('pk_live_51QfTWRIgqMmhC0OavNRY3L3fiZc6dmMPEcmFWlRRMuy83bYJoIkImB5GDRstxvzeLKkJidO3PoSEIk2xT0YNL2Yr00IWNKbXP9'); // Reemplaza con tu clave pública
const elements = stripe.elements();

// Crea el elemento de la tarjeta
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Maneja el formulario de pago
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();



    // Crea el token de pago
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (error) {
        // Muestra errores al cliente

        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message;
    } else {
        // Envía el token al servidor
        console.log('Pago exitoso:', paymentMethod);
        alert('Pago procesado con éxito.');
    }
});

