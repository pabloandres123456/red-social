const { crearUsuario } = require("../controllers/userController");
const { crearPost, verPosts } = require("../controllers/postController");
const { rl } = require("../utils/input");

function mostrarMenu() {
    console.log("\n=== RED SOCIAL NODE ===");
    console.log("1. Crear usuario");
    console.log("2. Publicar mensaje");
    console.log("3. Ver mensajes");
    console.log("4. Salir");

    rl.question("Selecciona una opción: ", opcion => {
        switch (opcion) {
            case "1":
                crearUsuario(mostrarMenu);
                break;
            case "2":
                crearPost(mostrarMenu);
                break;
            case "3":
                verPosts(mostrarMenu);
                break;
            case "4":
                console.log("Hasta luego 👋");
                rl.close();
                break;
            default:
                console.log("Opción inválida");
                mostrarMenu();
        }
    });
}

module.exports = { mostrarMenu };
