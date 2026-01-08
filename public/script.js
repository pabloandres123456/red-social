/* ===============================
   ESTADO GLOBAL
================================ */
let usuarioActual = null;
let usuarioChat = null;
let usuariosCache = [];
let fotoSeleccionada = false;

/* ===============================
   ELEMENTOS DOM
================================ */
const loginView = document.getElementById("loginView");
const chatView = document.getElementById("chatView");

const inputNombre = document.getElementById("loginNombre");
const inputFoto = document.getElementById("fileCamera");
const previewImg = document.getElementById("previewImg");
const btnEntrar = document.getElementById("btnEntrar");

const miAvatar = document.getElementById("miAvatar");
const usuarioLabel = document.getElementById("usuarioActualLabel");

const listaUsuarios = document.getElementById("listaUsuarios");
const chatPanel = document.querySelector(".chat-panel");
const usersPanel = document.querySelector(".users-panel");

const chatTitulo = document.getElementById("chatTitulo");
const chatAvatar = document.getElementById("chatAvatar");
const chatEstado = document.getElementById("chatEstado");
const chatBody = document.getElementById("chat");
const inputMensaje = document.getElementById("mensaje");

/* ===============================
   LOGIN / REGISTRO
================================ */

// Foto preview + validación
inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
        previewImg.src = reader.result;
        document.querySelector(".profile-container").style.backgroundImage = "none";
        fotoSeleccionada = true;
        validarLogin();
    };
    reader.readAsDataURL(file);
});

// Validar nombre
inputNombre.addEventListener("input", validarLogin);

function validarLogin() {
    btnEntrar.disabled = !(inputNombre.value.trim() && fotoSeleccionada);
}

// Login
async function login() {
    const nombre = inputNombre.value.trim();
    const foto = inputFoto.files[0];

    if (!nombre || !foto) return;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("foto", foto);

    let res = await fetch("/usuarios", { method: "POST", body: formData });
    let usuario;

    if (!res.ok) {
        res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre })
        });
    }

    usuario = await res.json();

    usuarioActual = usuario.nombre;
    miAvatar.src = usuario.foto;
    usuarioLabel.textContent = usuarioActual;

    loginView.style.display = "none";
    chatView.style.display = "block";

    cargarUsuarios();
}

/* ===============================
   USUARIOS
================================ */

async function cargarUsuarios() {
    const res = await fetch("/usuarios");
    usuariosCache = await res.json();

    listaUsuarios.innerHTML = "";

    usuariosCache.forEach(u => {
        if (u.nombre === usuarioActual) return;

        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";

        li.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <img src="${u.foto}" class="user-avatar">
                <span>${u.nombre}</span>
            </div>
        `;

        li.onclick = () => abrirChat(u);
        listaUsuarios.appendChild(li);
    });
}

function abrirChat(usuario) {
    usuarioChat = usuario.nombre;

    chatTitulo.textContent = usuario.nombre;
    chatAvatar.src = usuario.foto;
    chatAvatar.style.display = "block";
    chatEstado.textContent = "En línea";

    usersPanel.classList.add("hidden");
    chatPanel.classList.remove("hidden");

    cargarChat();
}

/* ===============================
   CHAT
================================ */

async function cargarChat() {
    const res = await fetch(`/chats/${usuarioActual}/${usuarioChat}`);
    const mensajes = await res.json();

    chatBody.innerHTML = "";

    mensajes.forEach(m => {
        const esMio = m.emisor === usuarioActual;
        const user = usuariosCache.find(u => u.nombre === m.emisor);

        chatBody.innerHTML += `
            <div class="message ${esMio ? "me" : "other"}">
                ${!esMio ? `<img src="${user.foto}" class="avatar">` : ""}
                <div class="bubble">${m.mensaje}</div>
                ${esMio ? `<img src="${user.foto}" class="avatar">` : ""}
            </div>
        `;
    });

    chatBody.scrollTop = chatBody.scrollHeight;
}

async function enviarMensaje() {
    const mensaje = inputMensaje.value.trim();
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

    inputMensaje.value = "";
    cargarChat();
}

/* ===============================
   NAVEGACIÓN
================================ */

function volverUsuarios() {
    usuarioChat = null;

    chatTitulo.textContent = "Selecciona un usuario";
    chatAvatar.style.display = "none";
    chatEstado.textContent = "";
    chatBody.innerHTML = "";

    usersPanel.classList.remove("hidden");
    chatPanel.classList.add("hidden");
}

function cerrarSesion() {
    usuarioActual = null;
    usuarioChat = null;

    chatView.style.display = "none";
    loginView.style.display = "flex";

    inputNombre.value = "";
    inputFoto.value = "";
    previewImg.src = "/perfil-de-usuario.png";
    btnEntrar.disabled = true;
    fotoSeleccionada = false;
}
