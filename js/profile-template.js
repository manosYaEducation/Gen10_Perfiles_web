const perfiles = [
    {
        "nombre": "Sebastián Santana",
        "ubicacion": "Punta Arenas, Magallanes, 61200000",
        "telefono": "(569) 63952221",
        "correo": "sebastian.santanacardenas@hotmail.com",
        "descripcion": "Un placer, aquí Sebastián. Oriundo de Punta Arenas y con 28 años, me considero una persona motivada por mis pasiones, curiosa por lo desconocido y ambiciosa en cuanto a mis aspiraciones. Siempre he sido de bajo perfil, pero muy sociable. Por eso, actualmente aspiro a tener un canal de YouTube estilo Cozy vlogs - Lofi - Study With Me!, donde podré compartir mi perspectiva sobre la vida."
    },
    {
        "nombre": "Felipe Cárdenas",
        "ubicacion": "Punta Arenas, Magallanes, 61200000",
        "telefono": "(569) 63952221",
        "correo": "felipe.cardenas@example.com",
        "descripcion": "Un placer, aquí Felipe. Soy un apasionado del diseño gráfico y la comunicación visual, con el objetivo de inspirar a otros a través de mi trabajo."
    },{
        "nombre": "armando casas",
        "ubicacion": "Punta Arenas, Magallanes, 61200000",
        "telefono": "(569) 63952221",
        "correo": "felipe.cardenas@example.com",
        "descripcion": "Un placer, aquí Felipe. Soy un apasionado del diseño gráfico y la comunicación visual, con el objetivo de inspirar a otros a través de mi trabajo."
    }
];

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const index = parseInt(id, 10);
    const user = perfiles[index];

    document.getElementById('name-hero').textContent = user.nombre; 
    document.getElementById('personal-information-hero').innerHTML = `
        <p>Ubicación: ${user.ubicacion}</p>
        <p>Teléfono: ${user.telefono}</p>
        <p>Correo: ${user.correo}</p>
    `;
    document.getElementById('description-hero').textContent = user.descripcion; 
});
