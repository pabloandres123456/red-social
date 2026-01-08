let usuarioActual = null;
let usuarioChat = null;

// Vista previa de foto
document.getElementById("fileCamera").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById("previewImg").src = reader.result;
    };
    reader.readAsDataURL(file);
});

async function login() {
    const nombre = document.getElementById("loginNombre").value.trim();
    const fotoInput = document.getElementById("fileCamera");
    const foto = fotoInput.files[0];

    if (!nombre) return alert("Ingresa un nombre");

    const formData = new FormData();
    formData.append("nombre", nombre);
    if (foto) formData.append("foto", foto);

    let res = await fetch("/usuarios", {
        method: "POST",
        body: formData
    });

    let usuario;

    if (!res.ok) {
        res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre })
        });
        usuario = await res.json();
    } else {
        usuario = await res.json();
    }

    usuarioActual = usuario.nombre;
    document.getElementById("usuarioActualLabel").textContent = usuarioActual;

    // Cambiar de vista
    document.getElementById("loginView").style.display = "none";
    document.getElementById("chatView").style.display = "block";

    cargarUsuarios();
}

async function cargarUsuarios() {
    const res = await fetch("/usuarios");
    usuariosCache = await res.json();

    const lista = document.getElementById("listaUsuarios");
    lista.innerHTML = "";

    usuariosCache.forEach(u => {
        if (u.nombre === usuarioActual) return;

        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";

        li.innerHTML = `
            <div class="user-item">
                <img src="${u.foto || 'https://via.placeholder.com/42'}" class="user-avatar">
                <span>${u.nombre}</span>
            </div>
        `;

        li.onclick = () => seleccionarUsuario(u.nombre);
        lista.appendChild(li);
    });
}

function seleccionarUsuario(nombre) {
    usuarioChat = nombre;

    const usuario = usuariosCache.find(u => u.nombre === nombre);

    document.getElementById("chatTitulo").textContent = nombre;
    document.getElementById("chatAvatar").src =
        usuario?.foto || "https://via.placeholder.com/40";
    document.getElementById("chatAvatar").style.display = "block";
    document.getElementById("chatEstado").textContent = "En línea";

    // 📱 Móvil: mostrar solo chat
    if (window.innerWidth <= 768) {
        document.querySelector(".users-panel").classList.add("hidden");
        document.querySelector(".chat-panel").classList.remove("hidden");
    }

    cargarChat();
}
function cerrarSesion() {
    usuarioActual = null;
    usuarioChat = null;

    // Limpiar UI
    document.getElementById("chat").innerHTML = "";
    document.getElementById("listaUsuarios").innerHTML = "";
    document.getElementById("chatTitulo").textContent = "Selecciona un usuario";
    document.getElementById("chatAvatar").style.display = "none";
    document.getElementById("chatEstado").textContent = "";
    document.getElementById("mensaje").value = "";

    // Volver a vista login
    document.getElementById("chatView").style.display = "none";
    document.getElementById("loginView").style.display = "block";

    // Reset foto preview
    document.getElementById("previewImg").src = "https://via.placeholder.com/130";
    document.getElementById("loginNombre").value = "";

    // Restaurar paneles (por si estaba en móvil)
    document.querySelector(".users-panel")?.classList.remove("hidden");
    document.querySelector(".chat-panel")?.classList.remove("hidden");
}


function volverUsuarios() {
    usuarioChat = null;

    document.getElementById("chatTitulo").textContent = "Selecciona un usuario";
    document.getElementById("chatAvatar").style.display = "none";
    document.getElementById("chatEstado").textContent = "";
    document.getElementById("chat").innerHTML = "";

    // 📱 SOLO en móvil: cambiar vistas
    if (window.innerWidth <= 768) {
        document.querySelector(".users-panel").classList.remove("hidden");
        document.querySelector(".chat-panel").classList.add("hidden");
    }
}


async function cargarChat() {
    const res = await fetch(`/chats/${usuarioActual}/${usuarioChat}`);
    const mensajes = await res.json();

    const usuariosRes = await fetch("/usuarios");
    const usuarios = await usuariosRes.json();

    const chat = document.getElementById("chat");
    chat.innerHTML = "";

    mensajes.forEach(m => {
        const esMio = m.emisor === usuarioActual;
        const user = usuarios.find(u => u.nombre === m.emisor);

        const avatar = user?.foto || "https://via.placeholder.com/32";

        chat.innerHTML += `
            <div class="message ${esMio ? "me" : "other"}">
                ${!esMio ? `<img src="${avatar}" class="avatar">` : ""}
                <div class="bubble">${m.mensaje}</div>
                ${esMio ? `<img src="${avatar}" class="avatar">` : ""}
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
        body: JSON.stringify({
            emisor: usuarioActual,
            receptor: usuarioChat,
            mensaje
        })
    });

    document.getElementById("mensaje").value = "";
    cargarChat();
}
window.addEventListener("beforeunload", () => {
    if (usuarioActual) {
        navigator.sendBeacon(
            "/logout",
            JSON.stringify({ nombre: usuarioActual })
        );
    }
});

