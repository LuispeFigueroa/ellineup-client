const API_URL = "http://localhost:8080";

// Divisiones
//obtener todas las divisiones
async function getDivisiones() {
    const res = await fetch(`${API_URL}/divisiones`);
    return res.json();
}
//crear una division
async function createDivision(data) {
    const res = await fetch(`${API_URL}/divisiones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
//modificar datos de una division
async function updateDivision(id, data) {
    const res = await fetch(`${API_URL}/divisiones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
//eliminar division
async function deleteDivision(id) {
    await fetch(`${API_URL}/divisiones/${id}`, { method: "DELETE" });
}

// Equipos

//todos los equipos de una division
async function getEquipos(divisionId) {
    const res = await fetch(`${API_URL}/divisiones/${divisionId}/equipos`);
    return res.json();
}
//Un equipo especifico
async function getEquipo(id) {
    const res = await fetch(`${API_URL}/equipos/${id}`);
    return res.json();
}
//crear un equipo 
async function createEquipo(divisionId, data) {
    const res = await fetch(`${API_URL}/divisiones/${divisionId}/equipos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
//modificar datos de un equipo
async function updateEquipo(id, data) {
    const res = await fetch(`${API_URL}/equipos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
//eliminar equipo
async function deleteEquipo(id) {
    await fetch(`${API_URL}/equipos/${id}`, { method: "DELETE" });
}

// Jugadores
//todos los jugadores de un equipo
async function getJugadores(equipoId) {
    const res = await fetch(`${API_URL}/equipos/${equipoId}/jugadores`);
    return res.json();
}
//crear un jugador dentro de un equipo
async function createJugador(equipoId, data) {
    const res = await fetch(`${API_URL}/equipos/${equipoId}/jugadores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
//Modificar datos de un jugador
async function updateJugador(id, data) {
    const res = await fetch(`${API_URL}/jugadores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

//Eliminar un jugador
async function deleteJugador(id) {
    await fetch(`${API_URL}/jugadores/${id}`, { method: "DELETE" });
}

// Partidos
//todos los partidos de una division
async function getPartidos(divisionId) {
    const res = await fetch(`${API_URL}/divisiones/${divisionId}/partidos`);
    return res.json();
}
//crear un partido
async function createPartido(divisionId, data) {
    const res = await fetch(`${API_URL}/divisiones/${divisionId}/partidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
//modificar datos de un partido
async function updatePartido(id, data) {
    const res = await fetch(`${API_URL}/partidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}
//eliminar un partido
async function deletePartido(id) {
    await fetch(`${API_URL}/partidos/${id}`, { method: "DELETE" });
}

// Standings
async function getStandings(divisionId) {
    const res = await fetch(`${API_URL}/divisiones/${divisionId}/standings`);
    return res.json();
}