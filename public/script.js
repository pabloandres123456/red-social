async function crearUsuario() {
    const nombre = document.getElementById("usuarioNuevo").value.trim();
    if (!nombre) return alert("Ingresa un nombre válido");

    const res = await fetch("/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    document.getElementById("usuarioNuevo").value = "";
    cargarUsuarios();
}

async function crearPost() {
    const usuario = document.getElementById("autor").value;
    const contenido = document.getElementById("mensaje").value.trim();

    if (!contenido) return alert("El mensaje no puede estar vacío");

    const res = await fetch("/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contenido })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    document.getElementById("mensaje").value = "";
    cargarPosts();
}

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

async function cargarPosts() {
    const res = await fetch("/posts");
    const posts = await res.json();

    const contenedor = document.getElementById("posts");
    contenedor.innerHTML = "";

    posts.forEach(p => {
        contenedor.innerHTML += `
            <div class="card mb-2">
                <div class="card-body">
                    <h6 class="card-subtitle mb-1 text-muted">${p.usuario}</h6>
                    <p class="card-text">${p.contenido}</p>
                    <small class="text-muted">${new Date(p.fecha).toLocaleString()}</small>
                </div>
            </div>
        `;
    });
}

cargarUsuarios();
cargarPosts();
