<?php
$servidor = "localhost"; // Si estás en local, usa localhost
$usuario = "root"; // El nombre de usuario de tu base de datos (en XAMPP y MAMP es root por defecto)
$contrasena = "88035864Cc?"; // La contraseña (en XAMPP y MAMP está vacía por defecto)
$basededatos = "urbancoverart"; // El nombre de tu base de datos

// Conectar a MySQL
$conn = new mysqli($servidor, $usuario, $contrasena, $basededatos);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
echo "Conexión exitosa!";
?>