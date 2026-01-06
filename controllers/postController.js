const Post = require("../models/Post");
const { agregarPost, obtenerPosts, obtenerUsuarios } = require("../services/storage");
const { rl } = require("../utils/input");

function crearPost(callback) {
    const usuarios = obtenerUsuarios();

    if (usuarios.length === 0) {
        console.log("Primero debes crear usuarios");
        return callback();
    }

    console.log("\nUsuarios:");
    usuarios.forEach((u, i) => {
        console.log(`${i + 1}. ${u.nombre}`);
    });

    rl.question("Selecciona un usuario: ", index => {
        const usuario = usuarios[index - 1];
        if (!usuario) {
            console.log("Usuario inválido");
            return callback();
        }

        rl.question("Escribe el mensaje: ", contenido => {
            const post = new Post(usuario.nombre, contenido);
            agregarPost(post);

            console.log("📝 Mensaje publicado");
            callback();
        });
    });
}

function verPosts(callback) {
    const posts = obtenerPosts();

    if (posts.length === 0) {
        console.log("No hay publicaciones aún");
    } else {
        console.log("\n=== mensajes ===");
        posts.forEach((p, i) => {
            console.log(`\n${i + 1}. ${p.usuario}`);
            console.log(`   ${p.contenido}`);
            console.log(`   🕒 ${p.fecha.toLocaleString()}`);
        });
    }

    callback();
}

module.exports = {
    crearPost,
    verPosts
};
