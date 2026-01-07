let usuarioActual = null;
let usuarioChat = null;

// Función de login
async function login() {
    const nombre = document.getElementById("loginNombre").value.trim();
    if (!nombre) return alert("Ingresa un nombre");

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
    });
    const user = await res.json();
    usuarioActual = user.nombre;
    document.getElementById("usuarioActualLabel").textContent = usuarioActual;

    cargarUsuarios();
}

// Función para cargar usuarios
async function cargarUsuarios() {
    if (!usuarioActual) return;
    const res = await fetch(`/usuarios/${usuarioActual}`);
    const usuarios = await res.json();

    const lista = document.getElementById("listaUsuarios");
    lista.innerHTML = "";
    usuarios.forEach(u => {
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";
        li.textContent = u.nombre;
        li.onclick = () => seleccionarUsuario(u.nombre);
        lista.appendChild(li);
    });
}

// Función para seleccionar un usuario y cargar el chat
function seleccionarUsuario(nombre) {
    usuarioChat = nombre;
    document.getElementById("chatTitulo").textContent = "Chat con " + nombre;
    cargarChat();
}

// Función para cargar el chat entre los dos usuarios
async function cargarChat() {
    if (!usuarioActual || !usuarioChat) return;
    const res = await fetch(`/chats/${usuarioActual}/${usuarioChat}`);
    const mensajes = await res.json();

    const chat = document.getElementById("chat");
    chat.innerHTML = "";
    mensajes.forEach(m => {
        chat.innerHTML += `
            <div class="${m.emisor === usuarioActual ? "text-end" : ""}">
                <span class="badge bg-${m.emisor === usuarioActual ? "success" : "secondary"}">
                    ${m.mensaje}
                </span>
            </div>
        `;
    });
}

// Función para enviar un mensaje
async function enviarMensaje() {
    const mensaje = document.getElementById("mensaje").value.trim();
    if (!mensaje || !usuarioChat || !usuarioActual) return;

    await fetch("/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emisor: usuarioActual,
            receptor: usuarioChat,
            mensaje
        })
    });

    document.getElementById("mensaje").value = "";
    cargarChat();
}
