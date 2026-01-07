const usuarios = [];
const chats = [];

// Usuarios
function agregarUsuario(user) {
    usuarios.push(user);
}
function obtenerUsuarios() {
    return usuarios;
}

// Chats
function agregarChat(chat) {
    chats.push(chat);
}
function obtenerChats(u1, u2) {
    // Devuelve todos los mensajes entre u1 y u2
    return chats.filter(c =>
        (c.emisor === u1 && c.receptor === u2) ||
        (c.emisor === u2 && c.receptor === u1)
    );
}

module.exports = {
    agregarUsuario,
    obtenerUsuarios,
    agregarChat,
    obtenerChats
};
