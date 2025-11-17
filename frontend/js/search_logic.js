// frontend/js/search_logic.js

let allData = []; // Aquí guardaremos a todos (clientes y equipo) mezclados

document.addEventListener("DOMContentLoaded", async function () {
    // 1. Verificar configuración
    if (!window.API_URL_PHP) {
        console.warn("API_URL_PHP no definida, usando ruta relativa por defecto.");
        window.API_URL_PHP = './backend/'; // Ajusta esto si tu API está en otra ruta
    }

    // 2. Cargar datos iniciales
    await loadAllProfiles();

    // 3. Configurar los eventos de los filtros del HTML
    setupFilterEvents();
});

async function loadAllProfiles() {
    try {
        // Fetch Equipo (sin ID devuelve todos los perfiles)
        const usersReq = fetch(`${window.API_URL_PHP}read_user.php`).then(r => r.json()).catch(() => ({ profiles: [] }));
        // Fetch Clientes (sin ID devuelve todos los clientes)
        const clientsReq = fetch(`${window.API_URL_PHP}read_client.php`).then(r => r.json()).catch(() => ({ clients: [] }));

        const [usersData, clientsData] = await Promise.all([usersReq, clientsReq]);

        console.log("Datos recibidos del equipo:", usersData);
        console.log("Datos recibidos de clientes:", clientsData);

        // Normalizar datos del Equipo
        const team = (usersData.profiles || []).map(u => ({
            id: u.id,
            nombre: u.name || "Sin nombre",
            rol: "trabajador", // Etiqueta para el filtro
            imagen: u.image || './assets/img/default-profile.png',
            descripcion: u.description || u.phrase || "Miembro del equipo",
            phrase: u.phrase || "" // Para búsqueda profunda
        }));

        // Normalizar datos de Clientes
        const clients = (clientsData.clients || []).map(c => ({
            id: c.id,
            nombre: c.name || "Cliente",
            rol: "cliente", // Etiqueta para el filtro
            imagen: c.image || './assets/img/default-profile.png',
            descripcion: c.description || c.company || "Cliente Kreative",
            company: c.company || "" // Para mostrar empresa
        }));

        // Combinar todo
        allData = [...team, ...clients];
        
        console.log("Datos cargados para búsqueda:", allData.length, allData);

    } catch (error) {
        console.error("Error cargando datos para el buscador:", error);
        document.getElementById('profiles-container').innerHTML = "<p>Error cargando perfiles. Intente recargar.</p>";
    }
}

function setupFilterEvents() {
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');

    // Función para normalizar texto (remover tildes y convertir a minúsculas)
    const normalizeText = (text) => {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const runFilter = () => {
        const texto = searchInput ? normalizeText(searchInput.value.trim()) : '';
        const rol = roleFilter ? roleFilter.value : 'all';

        // Si no hay filtros activos, limpiamos el contenedor
        if (!texto && rol === 'all') {
            document.getElementById('profiles-container').innerHTML = ""; 
            return;
        }

        const filtrados = allData.filter(item => {
            // Búsqueda Profunda: busca en nombre, descripción, frase y empresa (sin tildes)
            const matchTexto = !texto || 
                normalizeText(item.nombre).includes(texto) || 
                (item.descripcion && normalizeText(item.descripcion).includes(texto)) ||
                (item.phrase && normalizeText(item.phrase).includes(texto)) ||
                (item.company && normalizeText(item.company).includes(texto));
            
            // Filtro de Tipo (trabajador/cliente)
            const matchRol = rol === 'all' || item.rol === rol;

            return matchTexto && matchRol;
        });

        renderResults(filtrados);
    };

    // Event Listeners
    [searchInput, roleFilter].forEach(el => {
        if(el) el.addEventListener('input', runFilter);
    });
}

function renderResults(lista) {
    const container = document.getElementById('profiles-container');
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p style='text-align:center; width:100%; padding:40px; color:#666; font-size:1.1rem;'>🔍 No se encontraron resultados para tu búsqueda.</p>";
        return;
    }

    // Usamos estilos grid para mostrar las tarjetas
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
    container.style.gap = "25px";
    container.style.padding = "20px";

    lista.forEach(perfil => {
        const card = document.createElement('div');
        card.className = 'search-card';
        
        // Estilos mejorados para las tarjetas
        card.style.border = "1px solid #e0e0e0";
        card.style.borderRadius = "12px";
        card.style.padding = "20px";
        card.style.background = "#fff";
        card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        card.style.textAlign = "center";
        card.style.transition = "all 0.3s ease";
        card.style.cursor = "pointer";
        card.style.position = "relative";
        card.style.overflow = "hidden";
        
        // Hover effect
        card.onmouseover = function() {
            this.style.transform = "translateY(-5px)";
            this.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
        };
        card.onmouseout = function() {
            this.style.transform = "translateY(0)";
            this.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        };

        // Truncar descripción a 3 líneas
        const shortDesc = perfil.descripcion.length > 100 
            ? perfil.descripcion.substring(0, 100) + '...' 
            : perfil.descripcion;

        card.innerHTML = `
            <img src="${perfil.imagen}" 
                 alt="${perfil.nombre}" 
                 style="width:90px; height:90px; border-radius:50%; object-fit:cover; margin-bottom:15px; border: 3px solid ${perfil.rol === 'trabajador' ? '#4CAF50' : '#FF9800'};">
            
            <h3 style="margin: 8px 0; color:#2c3e50; font-size: 1.15rem; font-weight: 600;">${perfil.nombre}</h3>
            
            <span style="background:${perfil.rol === 'trabajador' ? '#e8f5e9' : '#fff3e0'}; 
                         color:${perfil.rol === 'trabajador' ? '#2e7d32' : '#e65100'}; 
                         padding:5px 14px; 
                         border-radius:20px; 
                         font-size:0.75rem; 
                         font-weight: 600; 
                         display: inline-block; 
                         margin: 10px 0;
                         text-transform: uppercase;
                         letter-spacing: 0.5px;">
                ${perfil.rol === 'trabajador' ? '👨‍💻 Equipo' : '🤝 Cliente'}
            </span>
            
            <p style="font-size:0.9rem; 
                      color:#546e7a; 
                      margin: 15px 0; 
                      line-height: 1.5;
                      height: 4.5em;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      display: -webkit-box;
                      -webkit-line-clamp: 3;
                      -webkit-box-orient: vertical;">${shortDesc}</p>
            
            <a href="frontend/perfiles/profile-template.php?id=${perfil.id}" 
               style="display:inline-block; 
                      margin-top:15px; 
                      padding: 10px 24px; 
                      text-decoration:none; 
                      color:#fff; 
                      background: ${perfil.rol === 'trabajador' ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #FF9800 0%, #f57c00 100%)'}; 
                      border-radius: 6px; 
                      font-weight:600; 
                      font-size: 0.9rem;
                      transition: all 0.3s;
                      box-shadow: 0 2px 5px rgba(0,0,0,0.15);" 
               onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)'" 
               onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 5px rgba(0,0,0,0.15)'">
                Ver Perfil →
            </a>
        `;
        
        container.appendChild(card);
    });
}