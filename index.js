
let filtroActual = 'Todos';

let personajeSecretoAsignado = null;
let secretoRevelado = false;

// 1. Renderizado de tarjetas (Base de datos)
function mostrarPeliculas(listaFiltrada = marvelMovies) {
    const contenedor = document.getElementById("ConteinerCard");
    contenedor.innerHTML = "";

    if (listaFiltrada.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted-custom fs-4">⚠️ Registro no encontrado en los servidores de SHIELD.</p></div>`;
        return;
    }

    let cardHTML = "";
    listaFiltrada.forEach(personaje => {
        cardHTML += `
            <div class="col d-flex justify-content-center">
                <div class="card marvel-card text-white h-100 pointer-cursor" style="width: 100%; max-width: 18rem;" onclick="abrirModal(${personaje.id})">
                    <img src="${personaje.imagen_url}" class="card-img-top" alt="${personaje.titulo}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title fw-bold text-danger text-uppercase mb-1">${personaje.titulo}</h5>
                            <h6 class="card-subtitle mb-3 text-muted" style="font-size: 0.85rem;">Primera Aparición: ${personaje.anio}</h6>
                        </div>
                        <div class="badge bg-dark border border-secondary w-100 py-2 mt-3">ID: ${personaje.id} | ${personaje.bando.toUpperCase()}</div>
                    </div>
                </div>
            </div>
        `;
    });
    contenedor.innerHTML = cardHTML;
}

// Lógica de Búsqueda y Filtrado Combinado
window.buscar = function() {
    const textoInput = document.getElementById("nPokemon").value.toLowerCase().trim();
    
    const resultado = marvelMovies.filter(personaje => {
        const coincideTexto = (textoInput === "") || 
                              (personaje.id.toString() === textoInput) || 
                              (personaje.titulo.toLowerCase().includes(textoInput));
        
        const coincideBando = (filtroActual === 'Todos') || (personaje.bando === filtroActual);
        
        return coincideTexto && coincideBando;
    });
    
    mostrarPeliculas(resultado);
}

// Cambiar Filtro de Bando
window.filtrarBando = function(bando, botonPresionado) {
    filtroActual = bando;
    
    const botones = document.querySelectorAll('.filter-btn');
    botones.forEach(btn => {
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-outline-danger');
    });
    botonPresionado.classList.remove('btn-outline-danger');
    botonPresionado.classList.add('btn-danger');

    buscar();
}

// Personaje Aleatorio (Sorpréndeme)
window.heroeAleatorio = function() {
    const randomIndex = Math.floor(Math.random() * marvelMovies.length);
    const personajeMisterioso = marvelMovies[randomIndex];
    abrirModal(personajeMisterioso.id);
}

// Función para inyectar datos en el Modal y abrirlo
window.abrirModal = function(id) {
    const personaje = marvelMovies.find(p => p.id === id);
    
    if (personaje) {
        document.getElementById("modalTitulo").innerText = personaje.titulo;
        document.getElementById("modalImagen").src = personaje.imagen_url;
        document.getElementById("modalAnio").innerText = personaje.anio;
        document.getElementById("modalBando").innerText = personaje.bando.toUpperCase();
        document.getElementById("modalDesc").innerText = personaje.descripcion;
        document.getElementById("modalId").innerText = personaje.id;
        
        const myModal = new bootstrap.Modal(document.getElementById('modalHeroe'));
        myModal.show();
    }
}

// ================= PIEZA NUEVA: LÓGICA DEL JUEGO "ADIVINA QUIÉN" =================

// Genera el tablero compacto para el juego
function inicializarTableroJuego() {
    const tablero = document.getElementById("tableroJuego");
    tablero.innerHTML = "";

    let tableroHTML = "";
    marvelMovies.forEach(personaje => {
        tableroHTML += `
            <div class="col">
                <div class="card game-card text-white h-100 pointer-cursor text-center" id="game-card-${personaje.id}" onclick="conmutarDescarte(${personaje.id})">
                    <div class="position-relative overflow-hidden card-img-wrapper">
                        <img src="${personaje.imagen_url}" class="game-card-img" alt="${personaje.titulo}">
                        <div class="game-card-overlay-abs">ELIMINADO</div>
                    </div>
                    <div class="p-2 bg-dark border-top border-secondary">
                        <p class="game-card-title fw-bold m-0 text-truncate text-uppercase text-danger small">${personaje.titulo}</p>
                    </div>
                </div>
            </div>
        `;
    });
    tablero.innerHTML = tableroHTML;
}

// Prende o apaga un personaje del tablero (Escala de grises / Opacidad)
window.conmutarDescarte = function(id) {
    const tarjeta = document.getElementById(`game-card-${id}`);
    if (tarjeta) {
        tarjeta.classList.toggle("character-eliminated");
    }
}

// Elige un personaje al azar para el jugador de esta máquina
window.generarPersonajeSecreto = function() {
    const randomIndex = Math.floor(Math.random() * marvelMovies.length);
    personajeSecretoAsignado = marvelMovies[randomIndex];
    secretoRevelado = false;
    
    actualizarVistaSecreta();
}

// Alterna entre mostrar la tarjeta volteada o la cara del personaje asignado
window.revelarOcultarSecreto = function() {
    if (!personajeSecretoAsignado) return;
    secretoRevelado = !secretoRevelado;
    actualizarVistaSecreta();
}

// Dibuja el estado actual de la tarjeta secreta
function actualizarVistaSecreta() {
    const contenedor = document.getElementById("tarjetaSecretaContainer");
    
    if (!personajeSecretoAsignado) {
        contenedor.className = "game-secret-card-box empty-state";
        contenedor.innerHTML = `
            <div id="contenidoSecreto" class="text-center text-muted">
                <span class="fs-1 d-block mb-2">❓</span>
            </div>`;
        return;
    }

    if (secretoRevelado) {
        contenedor.className = "game-secret-card-box revealed-state card text-white border-danger overflow-hidden";
        contenedor.innerHTML = `
            <img src="${personajeSecretoAsignado.imagen_url}" style="width:100%; height:180px; object-fit:cover; object-position:top;">
            <div class="bg-dark p-2 text-center border-top border-danger w-100">
                <span class="text-uppercase fw-black text-danger d-block text-truncate" style="font-size: 1.1rem;">${personajeSecretoAsignado.titulo}</span>
                <span class="badge bg-secondary style="font-size: 0.7rem;">${personajeSecretoAsignado.bando.toUpperCase()}</span>
                <span class="d-block text-muted mt-1" style="font-size: 0.75rem;">(Haz clic para ocultar)</span>
            </div>`;
    } else {
        contenedor.className = "game-secret-card-box hidden-state text-center";
        contenedor.innerHTML = `
            <div class="text-white">
                <h4 class="fw-black text-danger text-uppercase tracking-wider m-0 mb-1" style="font-size:1.1rem;">TU PERSONAJE</h4>
                <div class="badge bg-danger mb-2">SECRETO</div>
                <p class="text-muted small m-0 px-2">(Haz clic para mirar / ocultar)</p>
            </div>`;
    }
}

// Limpia el juego completo
window.reiniciarTableroJuego = function() {
    personajeSecretoAsignado = null;
    secretoRevelado = false;
    actualizarVistaSecreta();
    inicializarTableroJuego();
}

// Inicialización de la App
window.solicitudAJAX = function() {
    mostrarPeliculas();
    inicializarTableroJuego(); // Carga el tablero del juego automáticamente
}