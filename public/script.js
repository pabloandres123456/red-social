// Crear usuario
async function crearUsuario() {
    const nombre = document.getElementById("usuarioNuevo").value.trim();
    if (!nombre) {
        alert("Ingresa un nombre válido");
        return;
    }

    const res = await fetch("/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error);
        return;
    }

    alert("Usuario creado ✅");
    document.getElementById("usuarioNuevo").value = "";
    cargarUsuarios();
}

// Crear post
async function crearPost() {
    const usuario = document.getElementById("autor").value;
    const contenido = document.getElementById("mensaje").value.trim();

    if (!contenido) {
        alert("El mensaje no puede estar vacío");
        return;
    }

    const res = await fetch("/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contenido })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error);
        return;
    }

    document.getElementById("mensaje").value = "";
    cargarPosts();
}

// Cargar usuarios en el select
async function cargarUsuarios() {
    const res = await fetch("/usuarios");
    const usuarios = await res.json();

    const select = document.getElementById("autor");
    select.innerHTML = "";
    usuarios.forEach(u => {
        const option = document.createElement("option");
        option.value = u.nombre;
        option.textContent = u.nombre;
        select.appendChild(option);
    });
}

// Cargar posts
async function cargarPosts() {
    const res = await fetch("/posts");
    const posts = await res.json();

    const contenedor = document.getElementById("posts");
    contenedor.innerHTML = "";

    posts.forEach(p => {
        contenedor.innerHTML += `
            <div class="post">
                <strong>${p.usuario}</strong>
                <p>${p.contenido}</p>
                <small>${new Date(p.fecha).toLocaleString()}</small>
            </div>
        `;
    });
}

// Inicializar
cargarUsuarios();
cargarPosts();
