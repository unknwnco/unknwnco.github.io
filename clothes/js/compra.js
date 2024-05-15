let selectedDecal = null;
let selectedColor = null;
let selectedBolsillo = null;
let selectedHat = false;


let selectedCantidad = 1;
let selectedBolsillos = [];


let jacketMaterial; // Variable para almacenar el material de la chaqueta
let bolsilloMaterial;
let capotaMesh;
let capotaVisible = false;
let bolsilloMesh;
let bolsilloVisible = false;
let bolsillo2Mesh;
let bolsillo2Visible = false;
let bolsillo3Mesh;
let bolsillo3Visible = false;
let bolsillo4Mesh;
let bolsillo4Visible = false;

let decalMesh;
let decalVisible = false;

let activeDecal = null;

let decal2Mesh;
let decal2Visible = false;
let decal3Mesh;
let decal3Visible = false;
let decal4Mesh;
let decal4Visible = false;
let decal5Mesh;
let decal5Visible = false;
let decal2Bolsillo2Mesh; // Variable para el mesh "Decal2.bolsillo2"
let decal2Bolsillo3Mesh; // Variable para el mesh "Decal2.bolsillo2"
// Variable para el estado de visibilidad de bolsillo3


function updateSelectedOptions() {
    // Restablecer la visibilidad de todos los bolsillos
    bolsilloVisible = false;
    bolsillo2Visible = false;
    bolsillo3Visible = false;
    bolsillo4Visible = false;
// Actualizar las opciones seleccionadas
    // Establecer la cantidad predeterminada en 1 si no se selecciona ninguna cantidad
    if (!selectedCantidad) {
        selectedCantidad = 1;
    }


selectedOptions = {
    "Diseño": selectedDecal || "",
    "Color": selectedColor || "",
    "Bolsillos": selectedBolsillos.length > 0 ? selectedBolsillos.join(", ") : "",
    "Capota": selectedHat ? "si" : "",
    "Cantidad": selectedCantidad || ""
};

selectedOptionsEmpt = Object.values(selectedOptions);







// Actualizar el contenido del div "shop"
const shopDiv = document.getElementById('shop');

if (Object.keys(selectedOptions).filter(option => option !== 'Cantidad').some(option => (Array.isArray(selectedOptions[option]) ? selectedOptions[option].length > 0 : selectedOptions[option] !== ""))) {
// Actualizar el contenido del div "shop" con el valor del contador
shopDiv.textContent = "+" + contadorSelecciones;

    console.log("Mostrando +1");
} else {
    shopDiv.textContent = "";
}

    // Restablecer la visibilidad de los bolsillos seleccionados
    if (selectedBolsillos.includes("Inferiores internos")) {
        bolsilloVisible = true;
    }
    if (selectedBolsillos.includes("Frontal medio")) {
        bolsillo2Visible = true;
    }
    if (selectedBolsillos.includes("Laterales")) {
        bolsillo3Visible = true;
    }
    if (selectedBolsillos.includes("Inferiores externos")) {
        bolsillo4Visible = true;
    }

    // Actualizar la visibilidad de los bolsillos
    if (bolsilloMesh) {
        bolsilloMesh.visible = bolsilloVisible;
    }
    if (bolsillo2Mesh) {
        bolsillo2Mesh.visible = bolsillo2Visible;
    }
    if (bolsillo3Mesh) {
        bolsillo3Mesh.visible = bolsillo3Visible;
    }
    if (bolsillo4Mesh) {
        bolsillo4Mesh.visible = bolsillo4Visible;
    }

    // Actualizar la visibilidad del capotaMesh
    if (capotaMesh) {
        capotaMesh.visible = selectedHat; // Mostrar el capotaMesh si selectedHat es true
    }

// Mostrar las opciones seleccionadas en la consola
console.log("Opciones seleccionadas:", selectedOptions);
console.log("Opciones sin categoria:", selectedOptionsEmpt);
}
//Funcion vaciar opciones
// Función para limpiar las opciones seleccionadas y desactivar los mesh de los decals, bolsillos y hat si están activados
function limpiarOpciones() {
    console.log("Limpiando opciones...");
    // Desactivar los decals si están activos
    if (activeDecal) {
        deactivateDecal(activeDecal);
        console.log("Decal desactivado.");
    }
    
    // Desactivar los bolsillos si están activos
    if (bolsilloMesh && bolsilloMesh.visible) {
        bolsilloMesh.visible = false;
        console.log("Bolsillo desactivado.");
    }
    if (bolsillo2Mesh && bolsillo2Mesh.visible) {
        bolsillo2Mesh.visible = false;
        console.log("Bolsillo2 desactivado.");
    }
    if (bolsillo3Mesh && bolsillo3Mesh.visible) {
        bolsillo3Mesh.visible = false;
        console.log("Bolsillo3 desactivado.");
    }
    if (bolsillo4Mesh && bolsillo4Mesh.visible) {
        bolsillo4Mesh.visible = false;
        console.log("Bolsillo4 desactivado.");
    }

    // Restaurar el estado del capotaMesh
    if (capotaMesh) {
        capotaMesh.visible = false; // Desactivar el capotaMesh por defecto
        console.log("Capota desactivado por defecto.");
    }
    // Desactivar los colores
    if (jacketMaterial) {
        // Establecer el color por defecto del material de la chaqueta
        jacketMaterial.color.set(defaultJacketColor);
    }
    if (bolsilloMaterial) {
        // Establecer el color por defecto del material del bolsillo
        bolsilloMaterial.color.set(defaultBolsilloColor);
    }
    
    // Reiniciar las opciones seleccionadas
    selectedDecal = "";
    selectedColor = "";
    selectedBolsillos = "";
    selectedHat = false;
    selectedCantidad = ""; // Establecer la cantidad seleccionada a cero o al valor por defecto

    // Actualizar las opciones seleccionadas
    updateSelectedOptions();
}

//Funcion vaciar opciones
document.addEventListener('DOMContentLoaded', function() {
    
    updateSelectedOptions(); // Llama a la función cuando el DOM se haya cargado

    // Agregar evento de clic al elemento "Vaciar opciones"
    const vaciarOpcionesButton = document.getElementById('vaciarOpciones');
    if (vaciarOpcionesButton) {
        
        vaciarOpcionesButton.addEventListener('click', limpiarOpciones);
    } else {
        
    }
});