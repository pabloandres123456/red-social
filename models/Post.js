class Post {
    constructor(usuario, contenido) {
        this.usuario = usuario;
        this.contenido = contenido;
        this.fecha = new Date();
    }
}

module.exports = Post;
