const express = require("express");
const path = require("path");
const User = require("./models/User");
const Chat = require("./models/Chat");
const { agregarUsuario, obtenerUsuarios, agregarChat, obtenerChats } = require("./services/storage");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Ruta para registrar o iniciar sesión con un nombre de usuario
app.post("/login", (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    let usuarios = obtenerUsuarios();
    let usuario = usuarios.find(u => u.nombre === nombre);

    if (!usuario) {
        // Crear un nuevo usuario si no existe
        usuario = new User(nombre);
        agregarUsuario(usuario);
    }

    res.json(usuario);
});

// Ruta para obtener todos los usuarios (excepto el usuario actual)
app.get("/usuarios/:actual", (req, res) => {
    const actual = req.params.actual;
    const usuarios = obtenerUsuarios().filter(u => u.nombre !== actual);
    res.json(usuarios);
});

// Ruta para enviar un mensaje de chat
app.post("/chats", (req, res) => {
    const { emisor, receptor, mensaje } = req.body;
    if (!emisor || !receptor || !mensaje)
        return res.status(400).json({ error: "Datos incompletos" });

    const usuarios = obtenerUsuarios();
    if (!usuarios.find(u => u.nombre === emisor) || !usuarios.find(u => u.nombre === receptor))
        return res.status(400).json({ error: "Usuario no válido" });

    const chat = new Chat(emisor, receptor, mensaje);
    agregarChat(chat);
    res.json(chat);
});

// Ruta para obtener los mensajes entre dos usuarios
app.get("/chats/:u1/:u2", (req, res) => {
    const { u1, u2 } = req.params;
    res.json(obtenerChats(u1, u2));
});

// Iniciar servidor
app.listen(3000, () => console.log("🔥 Servidor corriendo en http://localhost:3000"));
