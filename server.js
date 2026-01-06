const express = require("express");
const path = require("path");

const { agregarUsuario, obtenerUsuarios, agregarPost, obtenerPosts } = require("./services/storage");
const User = require("./models/User");
const Post = require("./models/Post");

const app = express();
app.use(express.json());
app.use(express.static("public"));

/* RUTAS */

// Crear usuario
app.post("/usuarios", (req, res) => {
    const { nombre } = req.body;

    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

    const existe = obtenerUsuarios().some(u => u.nombre === nombre);
    if (existe) return res.status(400).json({ error: "Usuario ya existe" });

    const user = new User(nombre);
    agregarUsuario(user);

    res.json(user);
});

// Obtener usuarios
app.get("/usuarios", (req, res) => {
    res.json(obtenerUsuarios());
});

app.post("/posts", (req, res) => {
    const { usuario, contenido } = req.body;

    // Validar datos
    if (!usuario || !contenido) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    // Validar que el usuario exista
    const existeUsuario = obtenerUsuarios().some(u => u.nombre === usuario);
    if (!existeUsuario) {
        return res.status(400).json({
            error: "El usuario no existe. Debes crear el usuario primero."
        });
    }

    // Crear y agregar el post
    const post = new Post(usuario, contenido);
    agregarPost(post);

    res.json(post);
});


// Obtener posts
app.get("/posts", (req, res) => {
    res.json(obtenerPosts());
});

app.listen(3000, () => {
    console.log("🔥 Servidor corriendo en http://localhost:3000");
});
