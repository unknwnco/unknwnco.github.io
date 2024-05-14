    // Actualizar la tabla
    generarTabla();


    // Función para generar la tabla con la información de opcionesGuardadasArray
function generarTabla() {
    const tabla = document.getElementById('tablaOpciones');
    const tbody = tabla.querySelector('tbody');

    // Limpiar el cuerpo de la tabla
    tbody.innerHTML = '';

    // Recorrer opcionesGuardadasArray y añadir una fila por cada array recibido
    opcionesGuardadasArray.forEach(opciones => {
        const fila = document.createElement('tr');
        Object.values(opciones).forEach(valor => {
            const celda = document.createElement('td');
            celda.textContent = valor;
            fila.appendChild(celda);
        });
        tbody.appendChild(fila);
    });
}