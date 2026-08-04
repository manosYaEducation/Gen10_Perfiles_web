document.addEventListener("DOMContentLoaded", () => {
    // Definición de las secciones de la página principal (index.html)
    const seccionesIndex = [
        { selector: "header", label: "Inicio" },
        { selector: "#perfiles", label: "Equipo" },
        { selector: ".clients-carousel-container", label: "Clientes" },
        { selector: ".proyectos-destacados", label: "Proyectos" },
        { selector: "#cont", label: "Contacto" }
    ];

    const seccionesExistentes = seccionesIndex.filter(s => document.querySelector(s.selector));
    if (seccionesExistentes.length < 2) return;

    // Crear barra flotante fija de puntos redondos a la derecha de index.html
    const dotNavContainer = document.createElement("div");
    dotNavContainer.className = "main-page-dot-nav";
    dotNavContainer.setAttribute("aria-label", "Navegación rápida por la página");

    seccionesExistentes.forEach((sec, index) => {
        const itemBtn = document.createElement("button");
        itemBtn.type = "button";
        itemBtn.className = "dot-nav-item";
        itemBtn.setAttribute("data-target", sec.selector);

        itemBtn.innerHTML = `
            <span class="dot-circle ${index === 0 ? 'active' : ''}"></span>
            <span class="dot-label">${sec.label}</span>
        `;

        itemBtn.addEventListener("click", () => {
            const elTarget = document.querySelector(sec.selector);
            if (elTarget) {
                elTarget.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });

        dotNavContainer.appendChild(itemBtn);
    });

    document.body.appendChild(dotNavContainer);

    // Scroll Tracking estricto con activación del último punto al llegar al fondo
    const actualizarPuntoActivoIndex = () => {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;
        const containerHeight = window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight;

        let actualTarget = seccionesExistentes[0].selector;

        // Si se llegó al final de la página (fondo), activar forzosamente el último punto
        if (scrollPos + containerHeight >= totalHeight - 40) {
            actualTarget = seccionesExistentes[seccionesExistentes.length - 1].selector;
        } else {
            for (let i = 0; i < seccionesExistentes.length; i++) {
                const sec = seccionesExistentes[i];
                const el = document.querySelector(sec.selector);
                if (el) {
                    const top = el.offsetTop - 150;
                    if (scrollPos >= top) {
                        actualTarget = sec.selector;
                    }
                }
            }
        }

        dotNavContainer.querySelectorAll(".dot-nav-item").forEach(item => {
            const circle = item.querySelector(".dot-circle");
            if (item.getAttribute("data-target") === actualTarget) {
                circle.classList.add("active");
            } else {
                circle.classList.remove("active");
            }
        });
    };

    window.addEventListener("scroll", actualizarPuntoActivoIndex, { passive: true });
    actualizarPuntoActivoIndex();
});
