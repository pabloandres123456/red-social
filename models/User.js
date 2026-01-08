class User {
    constructor(nombre, foto = null) {
        this.nombre = nombre;
        this.foto = foto;
        this.online = false;
    }
}

module.exports = User;
