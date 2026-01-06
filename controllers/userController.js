const User = require("../models/User");
const { agregarUsuario, obtenerUsuarios } = require("../services/storage");
const { rl } = require("../utils/input");

function crearUsuario(callback) {
    rl.question("Nombre de usuario: ", nombre => {
        if (!nombre) {
            console.log("Nombre inválido");
            return callback();
        }

        const existe = obtenerUsuarios().some(u => u.nombre === nombre);
        if (existe) {
            console.log("El usuario ya existe");
            return callback();
        }

        const usuario = new User(nombre);
        agregarUsuario(usuario);

        console.log("✅ Usuario creado correctamente");
        callback();
    });
}

module.exports = { crearUsuario };
