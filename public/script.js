let usuarioActual = null;
let usuarioChat = null;

async function login() {
    const nombre = document.getElementById("loginNombre").value.trim();
    if (!nombre) return alert("Ingresa un nombre");

    // Intentar login
    let res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
    });

    if (res.status === 400) {
        // Registrar usuario si no existe
        res = await fetch("/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre })
        });
    }

    usuarioActual = nombre;
    document.getElementById("usuarioActualLabel").textContent = usuarioActual;
    document.getElementById("chatApp").style.display = "block";

    cargarUsuarios();
}

async function cargarUsuarios() {
    const res = await fetch("/usuarios");
    const usuarios = await res.json();
    const lista = document.getElementById("listaUsuarios");
    lista.innerHTML = "";

    usuarios.forEach(u => {
        if (u.nombre === usuarioActual) return;
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";
        li.textContent = u.nombre;
        li.onclick = () => seleccionarUsuario(u.nombre);
        lista.appendChild(li);
    });
}

function seleccionarUsuario(nombre) {
    usuarioChat = nombre;
    document.getElementById("chatTitulo").textContent = "Chat con " + nombre;
    cargarChat();
}

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
                    ${m.emisor}: ${m.mensaje}
                </span>
            </div>
        `;
    });

    chat.scrollTop = chat.scrollHeight;
}

async function enviarMensaje() {
    const mensaje = document.getElementById("mensaje").value.trim();
    if (!mensaje || !usuarioChat) return;

    await fetch("/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emisor: usuarioActual, receptor: usuarioChat, mensaje })
    });

    document.getElementById("mensaje").value = "";
    cargarChat();
}
