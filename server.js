const express = require("express");
const path = require("path");

const User = require("./models/User");
const Chat = require("./models/Chat");
const { agregarUsuario, obtenerUsuarios, agregarChat, obtenerChats } = require("./services/storage");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Registrar usuario
app.post("/usuarios", (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    if (obtenerUsuarios().some(u => u.nombre === nombre)) {
        return res.status(400).json({ error: "Usuario ya existe" });
    }

    const user = new User(nombre);
    agregarUsuario(user);
    res.json(user);
});

// Login
app.post("/login", (req, res) => {
    const { nombre } = req.body;
    const usuario = obtenerUsuarios().find(u => u.nombre === nombre);
    if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });
    res.json(usuario);
});

// Obtener todos los usuarios
app.get("/usuarios", (req, res) => {
    res.json(obtenerUsuarios());
});

// Enviar mensaje
app.post("/chats", (req, res) => {
    const { emisor, receptor, mensaje } = req.body;
    if (!emisor || !receptor || !mensaje) {
        return res.status(400).json({ error: "Datos incompletos" });
    }
    if (!obtenerUsuarios().some(u => u.nombre === emisor) ||
        !obtenerUsuarios().some(u => u.nombre === receptor)) {
        return res.status(400).json({ error: "Usuario no válido" });
    }

    const chat = new Chat(emisor, receptor, mensaje);
    agregarChat(chat);
    res.json(chat);
});

// Obtener chat entre dos usuarios
app.get("/chats/:u1/:u2", (req, res) => {
    const { u1, u2 } = req.params;
    res.json(obtenerChats(u1, u2));
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
