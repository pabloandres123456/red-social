class Chat {
    constructor(emisor, receptor, mensaje) {
        this.emisor = emisor;
        this.receptor = receptor;
        this.mensaje = mensaje;
        this.fecha = new Date();
    }
}

module.exports = Chat;
