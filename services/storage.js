const usuarios = [];
const publicaciones = [];

function agregarUsuario(usuario) {
    usuarios.push(usuario);
}

function obtenerUsuarios() {
    return usuarios;
}

function agregarPost(post) {
    publicaciones.push(post);
}

function obtenerPosts() {
    return publicaciones;
}

module.exports = {
    agregarUsuario,
    obtenerUsuarios,
    agregarPost,
    obtenerPosts
};
