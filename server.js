const express = require("express");
const path = require("path");
const multer = require("multer");

const User = require("./models/User");
const Chat = require("./models/Chat");
const { agregarUsuario, obtenerUsuarios, agregarChat, obtenerChats } = require("./services/storage");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.post("/logout", (req, res) => {
    const { nombre } = req.body;
    const usuario = obtenerUsuarios().find(u => u.nombre === nombre);
    if (usuario) usuario.online = false;
    res.json({ ok: true });
});



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
   filename: (req, file, cb) => {
    const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
}


});
const upload = multer({ storage });

// Registrar usuario
app.post("/usuarios", upload.single("foto"), (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    if (obtenerUsuarios().some(u => u.nombre === nombre)) {
        return res.status(400).json({ error: "Usuario ya existe" });
    }

    const foto = req.file ? `/uploads/${req.file.filename}` : null;
    const user = new User(nombre, foto);
    agregarUsuario(user);
    res.json(user);
});

// Login
app.post("/login", (req, res) => {
    const { nombre } = req.body;
    const usuario = obtenerUsuarios().find(u => u.nombre === nombre);
    if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });
    usuario.online = true; // 🔥 ONLINE
    res.json(usuario);
});


// Obtener usuarios
app.get("/usuarios", (req, res) => {
    res.json(obtenerUsuarios());
    const user = new User(nombre, foto);
    user.online = true;
    agregarUsuario(user);
});

// Enviar mensaje
app.post("/chats", (req, res) => {
    const { emisor, receptor, mensaje } = req.body;
    if (!emisor || !receptor || !mensaje) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    const chat = new Chat(emisor, receptor, mensaje);
    agregarChat(chat);
    res.json(chat);
});

// Obtener chats
app.get("/chats/:u1/:u2", (req, res) => {
    const { u1, u2 } = req.params;
    res.json(obtenerChats(u1, u2));
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
