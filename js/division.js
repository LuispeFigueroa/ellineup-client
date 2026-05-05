const params = new URLSearchParams(window.location.search);
const divisionId = params.get("id");
let equipos = [];

async function cargarDivision() {
    const divisiones = await getDivisiones();
    const division = divisiones.find(d => d.id == divisionId);
    if (!division) return;

    document.title = `ElLineup — ${division.nombre}`;
    document.getElementById("division-nombre").textContent = division.nombre;
    document.getElementById("division-temporada").textContent = `Temporada ${division.temporada}`;
    document.getElementById("breadcrumb-nombre").textContent = division.nombre;
}

async function cargarStandings() {
    const standings = await getStandings(divisionId);
    const tbody = document.getElementById("standings-body");

    if (!standings || standings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1rem; color:var(--gris-texto)">Sin datos aún</td></tr>`;
        return;
    }

    tbody.innerHTML = standings.map((s, i) => {
        const posClass = i === 0 ? "pos-1" : i === 1 ? "pos-2" : i === 2 ? "pos-3" : "pos-n";
        return `
        <tr>
            <td><span class="pos-badge ${posClass}">${i + 1}</span></td>
            <td><a href="equipo.html?id=${s.id}" class="equipo-link">${s.nombre}</a></td>
            <td>${s.juegos_jugados}</td>
            <td>${s.ganados}</td>
            <td>${s.perdidos}</td>
            <td>${s.carreras_anotadas}</td>
        </tr>`;
    }).join("");
}

async function cargarEquipos() {
    equipos = await getEquipos(divisionId);
    const lista = document.getElementById("lista-equipos");

    if (!equipos || equipos.length === 0) {
        lista.innerHTML = `<div class="empty-state"><p>No hay equipos registrados.</p></div>`;
        return;
    }

    lista.innerHTML = equipos.map(e => `
        <div class="jugador-row">
            <div class="jugador-info">
                <div class="jugador-nombre">
                    <a href="equipo.html?id=${e.id}" class="equipo-link">${e.nombre}</a>
                </div>
            </div>
            <div class="jugador-actions">
                <button class="btn btn-secondary btn-sm" onclick="abrirModalEquipo(${e.id}, '${e.nombre}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarEquipo(${e.id})">Eliminar</button>
                <a href="equipo.html?id=${e.id}" class="btn btn-primary btn-sm">Ver →</a>
            </div>
        </div>
    `).join("");
}

async function cargarPartidos() {
    const partidos = await getPartidos(divisionId);
    const lista = document.getElementById("lista-partidos");

    if (!partidos || partidos.length === 0) {
        lista.innerHTML = `<div class="empty-state"><p>No hay partidos registrados.</p></div>`;
        return;
    }

    lista.innerHTML = partidos.map(p => {
        const local = equipos.find(e => e.id === p.equipo_local_id)?.nombre || p.equipo_local_id;
        const visita = equipos.find(e => e.id === p.equipo_visita_id)?.nombre || p.equipo_visita_id;
        return `
        <div class="partido-card">
            <div class="partido-equipos">
                <span class="partido-equipo">${local}</span>
                <div class="partido-score">
                    <span>${p.carreras_local}</span>
                    <span class="score-vs">vs</span>
                    <span>${p.carreras_visita}</span>
                </div>
                <span class="partido-equipo">${visita}</span>
            </div>
            <div class="partido-meta">
                <div>${p.campo || ""}</div>
                <div>${p.fecha ? p.fecha.split("T")[0] : ""}</div>
                <span class="estado-badge estado-${p.estado}">${p.estado}</span>
            </div>
            <div class="jugador-actions">
                <button class="btn btn-secondary btn-sm" onclick="abrirModalPartidoEditar(${p.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPartido(${p.id})">Eliminar</button>
            </div>
        </div>`;
    }).join("");
}

// --- Modal Equipo ---
function abrirModalEquipo(id = null, nombre = "") {
    document.getElementById("modal-equipo-titulo").textContent = id ? "Editar Equipo" : "Nuevo Equipo";
    document.getElementById("equipo-id").value = id || "";
    document.getElementById("input-equipo-nombre").value = nombre;
    document.getElementById("modal-equipo").classList.add("active");
}

function cerrarModalEquipo() {
    document.getElementById("modal-equipo").classList.remove("active");
}

async function guardarEquipo() {
    const id = document.getElementById("equipo-id").value;
    const data = { nombre: document.getElementById("input-equipo-nombre").value };

    if (id) {
        await updateEquipo(id, data);
    } else {
        await createEquipo(divisionId, data);
    }

    cerrarModalEquipo();
    await cargarEquipos();
    await cargarStandings();
}

async function eliminarEquipo(id) {
    if (!confirm("¿Eliminar este equipo?")) return;
    await deleteEquipo(id);
    await cargarEquipos();
    await cargarStandings();
}

// --- Modal Partido ---
function abrirModalPartido() {
    document.getElementById("modal-partido-titulo").textContent = "Registrar Partido";
    document.getElementById("partido-id").value = "";
    document.getElementById("input-carreras-local").value = 0;
    document.getElementById("input-carreras-visita").value = 0;
    document.getElementById("input-campo").value = "";
    document.getElementById("input-fecha").value = "";
    document.getElementById("input-estado").value = "programado";
    llenarSelectEquipos();
    document.getElementById("modal-partido").classList.add("active");
}

async function abrirModalPartidoEditar(id) {
    const partido = await getPartido(id);
    document.getElementById("modal-partido-titulo").textContent = "Editar Partido";
    document.getElementById("partido-id").value = partido.id;
    document.getElementById("input-carreras-local").value = partido.carreras_local;
    document.getElementById("input-carreras-visita").value = partido.carreras_visita;
    document.getElementById("input-campo").value = partido.campo;
    document.getElementById("input-fecha").value = partido.fecha ? partido.fecha.split("T")[0] : "";
    document.getElementById("input-estado").value = partido.estado;
    llenarSelectEquipos(partido.equipo_local_id, partido.equipo_visita_id);
    document.getElementById("modal-partido").classList.add("active");
}

function llenarSelectEquipos(localId = null, visitaId = null) {
    const options = equipos.map(e => `<option value="${e.id}">${e.nombre}</option>`).join("");
    document.getElementById("input-local").innerHTML = options;
    document.getElementById("input-visita").innerHTML = options;
    if (localId) document.getElementById("input-local").value = localId;
    if (visitaId) document.getElementById("input-visita").value = visitaId;
}

function cerrarModalPartido() {
    document.getElementById("modal-partido").classList.remove("active");
}

async function guardarPartido() {
    const id = document.getElementById("partido-id").value;
    const data = {
        equipo_local_id: parseInt(document.getElementById("input-local").value),
        equipo_visita_id: parseInt(document.getElementById("input-visita").value),
        carreras_local: parseInt(document.getElementById("input-carreras-local").value),
        carreras_visita: parseInt(document.getElementById("input-carreras-visita").value),
        campo: document.getElementById("input-campo").value,
        fecha: document.getElementById("input-fecha").value,
        estado: document.getElementById("input-estado").value
    };

    if (id) {
        await updatePartido(id, data);
    } else {
        await createPartido(divisionId, data);
    }

    cerrarModalPartido();
    await cargarPartidos();
    await cargarStandings();
}

async function eliminarPartido(id) {
    if (!confirm("¿Eliminar este partido?")) return;
    await deletePartido(id);
    await cargarPartidos();
    await cargarStandings();
}

// Cerrar modales al click fuera
document.getElementById("modal-equipo").addEventListener("click", function (e) {
    if (e.target === this) cerrarModalEquipo();
});
document.getElementById("modal-partido").addEventListener("click", function (e) {
    if (e.target === this) cerrarModalPartido();
});

// Cargar todo
cargarDivision();
cargarStandings();
cargarEquipos().then(() => cargarPartidos());