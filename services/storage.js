const fs = require("fs");
const path = require("path");

const usuariosPath = path.join(__dirname, "usuarios.json");
const chatsPath = path.join(__dirname, "chats.json");

// Función para cargar el contenido de un archivo JSON
function cargarArchivo(ruta) {
    if (!fs.existsSync(ruta)) return [];
    const contenido = fs.readFileSync(ruta, "utf-8");
    try { return JSON.parse(contenido); }
    catch { return []; }
}

// Función para guardar datos en archivo JSON
function guardarArchivo(ruta, datos) {
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
}

// Agregar un nuevo usuario
function agregarUsuario(user) {
    const usuarios = obtenerUsuarios();
    usuarios.push(user);
    guardarArchivo(usuariosPath, usuarios);
}

// Obtener todos los usuarios
function obtenerUsuarios() {
    return cargarArchivo(usuariosPath);
}

// Agregar un mensaje de chat
function agregarChat(chat) {
    const chats = obtenerChatsGlobal();
    chats.push(chat);
    guardarArchivo(chatsPath, chats);
}

// Obtener todos los chats entre dos usuarios
function obtenerChats(u1, u2) {
    return obtenerChatsGlobal().filter(
        c => (c.emisor === u1 && c.receptor === u2) || (c.emisor === u2 && c.receptor === u1)
    );
}

// Obtener todos los chats globales (sin filtro de usuarios)
function obtenerChatsGlobal() {
    return cargarArchivo(chatsPath);
}

module.exports = {
    agregarUsuario,
    obtenerUsuarios,
    agregarChat,
    obtenerChats
};
