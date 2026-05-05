const params = new URLSearchParams(window.location.search);
const equipoId = params.get("id");
let equipoData = null;

async function cargarEquipo() {
    equipoData = await getEquipo(equipoId);
    document.title = `ElLineup — ${equipoData.nombre}`;
    document.getElementById("equipo-nombre").textContent = equipoData.nombre;

    // Cargar nombre de la division para el breadcrumb
    const divisiones = await getDivisiones();
    const division = divisiones.find(d => d.id == equipoData.division_id);
    if (division) {
        document.getElementById("equipo-division").textContent = `División ${division.nombre} — Temporada ${division.temporada}`;
        document.getElementById("breadcrumb-division").textContent = division.nombre;
        document.getElementById("breadcrumb-division").href = `division.html?id=${division.id}`;
    }

    document.getElementById("breadcrumb-equipo").textContent = equipoData.nombre;
    if (equipoData.logo_url) {
        mostrarLogo(`${API_URL}${equipoData.logo_url}`);
    }
}

async function cargarJugadores() {
    const jugadores = await getJugadores(equipoId);
    const lista = document.getElementById("lista-jugadores");

    document.getElementById("total-jugadores").textContent =
        jugadores && jugadores.length > 0 ? `${jugadores.length} jugadores` : "";

    if (!jugadores || jugadores.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <p>No hay jugadores en este equipo.</p>
                <button class="btn btn-primary" onclick="abrirModalJugador()">+ Agregar primer jugador</button>
            </div>`;
        return;
    }

    lista.innerHTML = jugadores.map(j => `
        <div class="jugador-row">
            <div class="jugador-numero">${j.numero || "—"}</div>
            <div class="jugador-info">
                <div class="jugador-nombre">${j.nombre}</div>
                <div class="jugador-posicion">${j.posicion || "Sin posición"}</div>
            </div>
            <div class="jugador-actions">
                <button class="btn btn-secondary btn-sm" 
                    onclick="abrirModalJugador(${j.id}, '${j.nombre}', ${j.numero}, '${j.posicion}')">
                    Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarJugador(${j.id})">
                    Eliminar
                </button>
            </div>
        </div>
    `).join("");
}

function abrirModalJugador(id = null, nombre = "", numero = "", posicion = "") {
    document.getElementById("modal-jugador-titulo").textContent = id ? "Editar Jugador" : "Nuevo Jugador";
    document.getElementById("jugador-id").value = id || "";
    document.getElementById("input-jugador-nombre").value = nombre;
    document.getElementById("input-jugador-numero").value = numero;
    document.getElementById("input-jugador-posicion").value = posicion;
    document.getElementById("modal-jugador").classList.add("active");
}

function cerrarModalJugador() {
    document.getElementById("modal-jugador").classList.remove("active");
}

async function guardarJugador() {
    const id = document.getElementById("jugador-id").value;
    const data = {
        nombre: document.getElementById("input-jugador-nombre").value,
        numero: parseInt(document.getElementById("input-jugador-numero").value) || 0,
        posicion: document.getElementById("input-jugador-posicion").value
    };

    if (id) {
        await updateJugador(id, data);
    } else {
        await createJugador(equipoId, data);
    }

    cerrarModalJugador();
    cargarJugadores();
}

async function eliminarJugador(id) {
    if (!confirm("¿Eliminar este jugador?")) return;
    await deleteJugador(id);
    cargarJugadores();
}

document.getElementById("modal-jugador").addEventListener("click", function (e) {
    if (e.target === this) cerrarModalJugador();
});

async function subirImagen() {
    const input = document.getElementById("input-imagen");
    if (!input.files[0]) return;

    const formData = new FormData();
    formData.append("imagen", input.files[0]);

    const res = await uploadImagenEquipo(equipoId, formData);
    if (res.logo_url) {
        mostrarLogo(`${API_URL}${res.logo_url}`);
    } else {
        alert(res.error || "Error al subir la imagen");
    }
}

function mostrarLogo(url) {
    const img = document.getElementById("equipo-logo");
    const placeholder = document.getElementById("equipo-logo-placeholder");
    img.src = url;
    img.style.display = "block";
    placeholder.style.display = "none";
}

cargarEquipo();
cargarJugadores();