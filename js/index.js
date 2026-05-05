async function cargarDivisiones() {
    const divisiones = await getDivisiones();
    const lista = document.getElementById("lista-divisiones");

    if (!divisiones || divisiones.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <p>No hay divisiones registradas.</p>
                <button class="btn btn-primary" onclick="abrirModalCrear()">+ Crear primera división</button>
            </div>`;
        return;
    }

    lista.innerHTML = divisiones.map(d => `
        <div class="division-card" >
            <div onclick="window.location.href='division.html?id=${d.id}'" style="cursor:pointer">
                <div class="division-nombre">${d.nombre}</div>
                <div class="division-temporada">Temporada ${d.temporada}</div>
            </div>
            <div class="division-actions" style="margin-top:1rem">
                <button class="btn btn-secondary btn-sm" onclick="abrirModalEditar(${d.id}, '${d.nombre}', '${d.temporada}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarDivision(${d.id})">Eliminar</button>
                <button class="btn btn-primary btn-sm" onclick="window.location.href='division.html?id=${d.id}'">Ver →</button>
            </div>
        </div>
    `).join("");
}

function abrirModalCrear() {
    document.getElementById("modal-titulo").textContent = "Nueva División";
    document.getElementById("division-id").value = "";
    document.getElementById("input-nombre").value = "";
    document.getElementById("input-temporada").value = "";
    document.getElementById("modal").classList.add("active");
}

function abrirModalEditar(id, nombre, temporada) {
    document.getElementById("modal-titulo").textContent = "Editar División";
    document.getElementById("division-id").value = id;
    document.getElementById("input-nombre").value = nombre;
    document.getElementById("input-temporada").value = temporada;
    document.getElementById("modal").classList.add("active");
}

function cerrarModal() {
    document.getElementById("modal").classList.remove("active");
}

async function guardarDivision() {
    const id = document.getElementById("division-id").value;
    const data = {
        nombre: document.getElementById("input-nombre").value,
        temporada: document.getElementById("input-temporada").value
    };

    if (id) {
        await updateDivision(id, data);
    } else {
        await createDivision(data);
    }

    cerrarModal();
    cargarDivisiones();
}

async function eliminarDivision(id) {
    if (!confirm("¿Eliminar esta división? Se eliminarán todos sus equipos y partidos.")) return;
    await deleteDivision(id);
    cargarDivisiones();
}

// Cerrar modal al hacer click fuera
document.getElementById("modal").addEventListener("click", function (e) {
    if (e.target === this) cerrarModal();
});

cargarDivisiones();