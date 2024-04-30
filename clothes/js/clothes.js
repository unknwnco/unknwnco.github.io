let selectedDecal = null;
let selectedColor = null;
let selectedBolsillo = null;
let selectedHat = false;

let activeDecal = null;

function inicializar() {
    const canvas = document.getElementById('item');

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvas.appendChild(renderer.domElement);

    const loader = new THREE.GLTFLoader();

    const camera = new THREE.PerspectiveCamera(15, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 1;
    controls.maxDistance = 6;
    controls.minPolarAngle = 1.5;
    controls.maxPolarAngle = 1.7;
    controls.target = new THREE.Vector3(0, 1.3, 0);
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, .6);
    directionalLight.position.set(10, 10, 20);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

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
    let decal2Bolsillo2Mesh; // Variable para el mesh "Decal2.bolsillo2"
    let decal2Bolsillo3Mesh; // Variable para el mesh "Decal2.bolsillo2"
    // Variable para el estado de visibilidad de bolsillo3

// Variable para el estado de visibilidad de decal2Bolsillo3Mesh
let decal2Bolsillo3Visible = false;

    loader.load('/clothes/3d/jacket.glb', function (gltf) {
        const model = gltf.scene;
        scene.add(model);

        // Posicionar la cámara y los controles orbitales para el modelo
        camera.position.set(-0.1, 4.5, 1.8);
        controls.update();

        // Buscar el material con nombre "Jacket_Texture"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.material.name === "Jacket_Texture") {
                jacketMaterial = child.material;
            }
        });
        // Buscar el material con nombre "Jacket_Texture"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.material.name === "Bolsillo_Texture") {
                bolsilloMaterial = child.material;
            }
        });

        // Buscar el grupo con nombre "Capota"
        gltf.scene.traverse(function (child) {
            if (child.type === "Group" && child.name === "Capota") {
                capotaMesh = child;
                capotaMesh.visible = false; // Ocultar por defecto
            }
        });


        // Buscar el mesh con nombre "Bolsilo"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Bolsillo") {
                bolsilloMesh = child;
                bolsilloMesh.visible = true;
            }
        });
        // Buscar el mesh con nombre "Bolsilo"
        gltf.scene.traverse(function (child) {
            if (child.type === "Group" && child.name === "Bolsillo2") {
                bolsillo2Mesh = child;
                bolsillo2Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Bolsilo"
        gltf.scene.traverse(function (child) {
            if (child.type === "Group" && child.name === "Bolsillo3") {
                bolsillo3Mesh = child;
                bolsillo3Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Bolsilo"
        gltf.scene.traverse(function (child) {
            if (child.type === "Group" && child.name === "Bolsillo4") {
                bolsillo4Mesh = child;
                bolsillo4Mesh.visible = false;
            }
        });

        // Buscar el mesh con nombre "Decal"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal1") {
                decalMesh = child;
                decalMesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Decal2"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal2") {
                decal2Mesh = child;
                decal2Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Decal2"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal3") {
                decal3Mesh = child;
                decal3Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Decal2"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal4") {
                decal4Mesh = child;
                decal4Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Decal2"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal2bolsillo2") {
                decal2Bolsillo2Mesh = child;
                decal2Bolsillo2Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Decal2"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal2bolsillo3") {
                decal2Bolsillo3Mesh = child;
                decal2Bolsillo3Mesh.visible = false;
            }
        });

        // Función de renderizado
        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        // Llamar a la función de renderizado
        render();
    });
// Definir los colores por defecto
const defaultJacketColor = 0xFFFFFF; // Color blanco
const defaultBolsilloColor = 0xDDDDDD; // Color gris

// Escuchar clics en el elemento con id "color1"
const color1 = document.getElementById('color1');
color1.addEventListener('click', function () {
    console.log('Se hizo clic en el elemento con id "color1"');
    if (selectedColor === "Negro") { // Verificar si ya está seleccionado
        selectedColor = null; // Desactivar el color
        resetDefaultColors(); // Establecer el color por defecto
        updateSelectedOptions();
        return;
    }
    if (jacketMaterial) {
        jacketMaterial.color.set(0x1C1C1C); // Color rojo
    }
    // Cambiar el color del bolsilloMaterial a gris solo si no está seleccionado
    if (bolsilloMaterial && selectedColor !== "Negro") {
        bolsilloMaterial.color.set(0x363636); // Color gris
    }
    selectedColor = "Negro";
    updateSelectedOptions();
});

// Escuchar clics en el elemento con id "color2"
const color2 = document.getElementById('color2');
color2.addEventListener('click', function () {
    console.log('Se hizo clic en el elemento con id "color2"');
    if (selectedColor === "Blanco") {
        selectedColor = null; // Desactivar el color
        resetDefaultColors(); // Establecer el color por defecto
        updateSelectedOptions();
        return;
    }
    if (jacketMaterial) {
        jacketMaterial.color.set(0xFFFFFF); // Color blanco
    }
    if (bolsilloMaterial && selectedColor !== "Blanco") {
        bolsilloMaterial.color.set(0xDDDDDD); // Color gris
    }
    selectedColor = "Blanco";
    updateSelectedOptions();
});

// Escuchar clics en el elemento con id "color3"
const color3 = document.getElementById('color3');
color3.addEventListener('click', function () {
    console.log('Se hizo clic en el elemento con id "color3"');
    if (selectedColor === "Rojo") {
        selectedColor = null; // Desactivar el color
        resetDefaultColors(); // Establecer el color por defecto
        updateSelectedOptions();
        return;
    }
    if (jacketMaterial) {
        jacketMaterial.color.set(0xB40404); // Color rojo
    }
    if (bolsilloMaterial && selectedColor !== "Rojo") {
        bolsilloMaterial.color.set(0xC00606); // Color rojo oscuro
    }
    selectedColor = "Rojo";
    updateSelectedOptions();
});

// Escuchar clics en el elemento con id "color4"
const color4 = document.getElementById('color4');
color4.addEventListener('click', function () {
    console.log('Se hizo clic en el elemento con id "color4"');
    if (selectedColor === "Azul") {
        selectedColor = null; // Desactivar el color
        resetDefaultColors(); // Establecer el color por defecto
        updateSelectedOptions();
        return;
    }
    if (jacketMaterial) {
        jacketMaterial.color.set(0x0431B4); // Color azul oscuro
    }
    if (bolsilloMaterial && selectedColor !== "Azul") {
        bolsilloMaterial.color.set(0x08298A); // Color azul
    }
    selectedColor = "Azul";
    updateSelectedOptions();
});

// Función para restablecer los colores por defecto
function resetDefaultColors() {
    if (jacketMaterial) {
        jacketMaterial.color.set(defaultJacketColor);
    }
    if (bolsilloMaterial) {
        bolsilloMaterial.color.set(defaultBolsilloColor);
    }
}

// Resto del código...


    // Escuchar clics en el elemento con id "hat"
    const hat = document.getElementById('hat');
    hat.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "hat"'); // Agregando console.log
        if (capotaMesh) {
            // Alternar la visibilidad del mesh del hat
            capotaVisible = !capotaVisible;
            capotaMesh.visible = capotaVisible;
        }
        selectedHat = !selectedHat;
        updateSelectedOptions();
    });

    // Escuchar clics en el elemento con id "bolsillo"
    const bolsillo = document.getElementById('bolsillo');
    bolsillo.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "hat"'); // Agregando console.log
        if (bolsilloMesh) {
            // Alternar la visibilidad del mesh del bolsillo
            bolsilloVisible = !bolsilloVisible;
            bolsilloMesh.visible = bolsilloVisible;
        }
        selectedBolsillo = "Bolsillo inferiores internos";
        updateSelectedOptions();
    });

    // Escuchar clics en el elemento con id "bolsillo2"
    const bolsillo2 = document.getElementById('bolsillo2');
    bolsillo2.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "bolsillo2"');
        if (bolsillo2Mesh) {
            // Alternar la visibilidad del mesh del bolsillo 2
            bolsillo2Visible = !bolsillo2Visible;
            bolsillo2Mesh.visible = bolsillo2Visible;
    
            // Verificar si ambos bolsillo2Mesh y decal2Mesh son visibles
            if (bolsillo2Visible && decal2Visible) {
                // Si ambos son visibles, hacer visible el mesh Decal2.bolsillo2
                if (decal2Bolsillo2Mesh) {
                    decal2Bolsillo2Mesh.visible = true;
                }
            }
        }
        selectedBolsillo = "Bolsillos fontral medio";
        updateSelectedOptions();
    });

    // Escuchar clics en el elemento con id "bolsillo"
    const bolsillo3 = document.getElementById('bolsillo3');
    bolsillo3.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "hat"'); // Agregando console.log
        if (bolsillo3Mesh) {
            // Alternar la visibilidad del mesh del bolsillo
            bolsillo3Visible = !bolsillo3Visible;
            bolsillo3Mesh.visible = bolsillo3Visible;

        // Verificar si bolsillo3Mesh y decal2Mesh son visibles
        if (bolsillo3Visible && decal2Visible) {
            // Si ambos son visibles, alternar la visibilidad del mesh decal2Bolsillo3Mesh
            decal2Bolsillo3Visible = !decal2Bolsillo3Visible;
            decal2Bolsillo3Mesh.visible = decal2Bolsillo3Visible;
        }
        }
        selectedBolsillo = "Bolsillos laterales";
        updateSelectedOptions();
    });

    // Escuchar clics en el elemento con id "bolsillo"
    const bolsillo4 = document.getElementById('bolsillo4');
    bolsillo4.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "hat"'); // Agregando console.log
        if (bolsillo4Mesh) {
            // Alternar la visibilidad del mesh del bolsillo
            bolsillo4Visible = !bolsillo4Visible;
            bolsillo4Mesh.visible = bolsillo4Visible;
        }
        selectedBolsillo = "Bolsillos inferiores externos";
        updateSelectedOptions();
    });

// Función para desactivar un decal
function deactivateDecal(decal) {
    decal.visible = false;
    activeDecal = null;
}

// Escuchar clics en el elemento con id "decal"
const decal = document.getElementById('decal');
decal.addEventListener('click', function () {
    console.log('Se hizo clic en el elemento con id "decal"');
    if (activeDecal !== decalMesh) {
        if (activeDecal) {
            activeDecal.visible = false;
        }
        decalMesh.visible = true;
        activeDecal = decalMesh;
        selectedDecal = "BlackAir"; // Establecer el decal seleccionado
    } else {
        deactivateDecal(decalMesh);
        selectedDecal = null; // Vaciar el decal seleccionado
    }
    updateSelectedOptions();
});

// Escuchar clics en el elemento con id "decal2"
const decal2 = document.getElementById('decal2');
decal2.addEventListener('click', function () {
    console.log('Se hizo clic en el elemento con id "decal2"');
    if (activeDecal !== decal2Mesh) {
        if (activeDecal) {
            activeDecal.visible = false;
        }
        decal2Mesh.visible = true;
        activeDecal = decal2Mesh;
        selectedDecal = "Celtics"; // Establecer el decal seleccionado
    } else {
        deactivateDecal(decal2Mesh);
        selectedDecal = null; // Vaciar el decal seleccionado
    }
    updateSelectedOptions();
});

// Escuchar clics en el elemento con id "decal3"
const decal3 = document.getElementById('decal3');
decal3.addEventListener('click', function () {
    console.log('Se hizo clic en el elemento con id "decal3"');
    if (activeDecal !== decal3Mesh) {
        if (activeDecal) {
            activeDecal.visible = false;
        }
        decal3Mesh.visible = true;
        activeDecal = decal3Mesh;
        selectedDecal = "Duplont"; // Establecer el decal seleccionado
    } else {
        deactivateDecal(decal3Mesh);
        selectedDecal = null; // Vaciar el decal seleccionado
    }
    updateSelectedOptions();
});

// Escuchar clics en el elemento con id "decal4"
const decal4 = document.getElementById('decal4');
decal4.addEventListener('click', function () {
    console.log('Se hizo clic en el elemento con id "decal4"');
    if (activeDecal !== decal4Mesh) {
        if (activeDecal) {
            activeDecal.visible = false;
        }
        decal4Mesh.visible = true;
        activeDecal = decal4Mesh;
        selectedDecal = "Rick & Morty"; // Establecer el decal seleccionado
    } else {
        deactivateDecal(decal4Mesh);
        selectedDecal = null; // Vaciar el decal seleccionado
    }
    updateSelectedOptions();
});


}

document.addEventListener('DOMContentLoaded', inicializar);

//modal compras
document.addEventListener('DOMContentLoaded', function() {
    updateSelectedOptions(); // Llama a la función cuando el DOM se haya cargado
});

let selectedOptions = {};

// Función para manejar la selección de diseño
function handleDecalSelection() {
    selectedDecal = this.value;
    updateSelectedOptions();
}

// Función para manejar la selección de color
function handleColorSelection() {
    selectedColor = this.value;
    updateSelectedOptions();
}

// Función para manejar la selección de bolsillo
function handleBolsilloSelection() {
    selectedBolsillo = this.value;
    updateSelectedOptions();
}

// Función para manejar la selección de capota
function handleHatSelection() {
    selectedHat = this.checked;
    updateSelectedOptions();
}

// Asignar eventos a los elementos de selección
const decalSelect = document.getElementById('decalSelect');
if (decalSelect) {
    decalSelect.addEventListener('change', handleDecalSelection);
}

const colorSelect = document.getElementById('colorSelect');
if (colorSelect) {
    colorSelect.addEventListener('change', handleColorSelection);
}

const bolsilloSelect = document.getElementById('bolsilloSelect');
if (bolsilloSelect) {
    bolsilloSelect.addEventListener('change', handleBolsilloSelection);
}

const hatCheckbox = document.getElementById('hatCheckbox');
if (hatCheckbox) {
    hatCheckbox.addEventListener('change', handleHatSelection);
}

function updateSelectedOptions() {
    // Actualizar las opciones seleccionadas
    selectedOptions = {
        "Diseño": selectedDecal || "",
        "Color": selectedColor || "",
        "Bolsillo": selectedBolsillo || "",
        "Capota": selectedHat ? "si" : ""
    };

    // Actualizar el contenido de la tabla
    const comprasBody = document.getElementById('comprasBody');

    // Limpiar la tabla antes de agregar filas
    comprasBody.innerHTML = ""; 

    // Agregar fila de encabezado de categorías
    //const headerRow = document.createElement('tr');
    //const categoryHeaderCell = document.createElement('th');
    //categoryHeaderCell.textContent = "Solicitud";
    //headerRow.appendChild(categoryHeaderCell);
    //const optionHeaderCell = document.createElement('th');
    //optionHeaderCell.textContent = "";
    //headerRow.appendChild(optionHeaderCell);
    //comprasBody.appendChild(headerRow);

    // Agregar filas de categorías y opciones seleccionadas
    Object.keys(selectedOptions).forEach(category => {
        const row = document.createElement('tr');
        const categoryCell = document.createElement('td');
        categoryCell.textContent = category;
        row.appendChild(categoryCell);
        const valueCell = document.createElement('td');
        valueCell.textContent = selectedOptions[category];
        row.appendChild(valueCell);
        comprasBody.appendChild(row);
    });

    // Actualizar el contenido del div "shop"
    const shopDiv = document.getElementById('shop');
    
    if (Object.values(selectedOptions).some(option => option !== "")) {
        shopDiv.textContent = "+1";
        console.log("Mostrando +1 en el div 'shop'");
    } else {
        shopDiv.textContent = "";
    }

    // Mostrar las opciones seleccionadas en la consola
    console.log("Opciones seleccionadas:", selectedOptions);
}

document.addEventListener('DOMContentLoaded', function() {
    updateSelectedOptions(); // Llama a la función cuando el DOM se haya cargado

    // Agregar evento de clic al elemento "Vacaciones opciones"
    const vacacionesOpciones = document.getElementById('vaciarOpciones');
    if (vacacionesOpciones) {
        vacacionesOpciones.addEventListener('click', limpiarOpciones);
    }
});

// Función para limpiar las opciones seleccionadas
function limpiarOpciones() {
    // Reiniciar las opciones seleccionadas
    selectedDecal = "";
    selectedColor = "";
    selectedBolsillo = "";
    selectedHat = false;

    // Actualizar las opciones seleccionadas
    updateSelectedOptions();
}







//dropdown add

function toggleDropdown() {
    var dropdown = document.querySelector('.decalselect');
    var dropdown2 = document.querySelector('.bolselect');

    if (!dropdown.classList.contains('active')) {
        dropdown.classList.add('active');
        dropdown2.classList.remove('active');
    } else {
        dropdown.classList.remove('active');
    }
}

function toggleDropdown2() {
    var dropdown = document.querySelector('.bolselect');
    var dropdown2 = document.querySelector('.decalselect');

    if (!dropdown.classList.contains('active')) {
        dropdown.classList.add('active');
        dropdown2.classList.remove('active');
    } else {
        dropdown.classList.remove('active');
    }
}


//lista de compras
function abrirCompras() {
    var compras = document.getElementById("compras");
    compras.style.display = "flex"; // Cambiamos a "flex" para mostrar el div
    // Centramos el div de compras en el viewport
    compras.style.top = `${window.innerHeight / 2 - compras.offsetHeight / 2}px`;
    compras.style.left = `${window.innerWidth / 2 - compras.offsetWidth / 2}px`;
    // Añadimos la clase al body para evitar que haga scroll
    document.body.classList.add('modal-open');
}

function cerrarCompras() {
    var compras = document.getElementById("compras");
    compras.style.display = "none";
    // Removemos la clase del body al cerrar el modal
    document.body.classList.remove('modal-open');
}

// Cerrar compras si se hace clic fuera de ella
window.onclick = function(event) {
    var compras = document.getElementById("compras");
    if (event.target == compras) {
        compras.style.display = "none";
        // Removemos la clase del body al cerrar el modal
        document.body.classList.remove('modal-open');
    }
}

// Abrir compras al hacer clic en el div "notify"
document.getElementById("notify").onclick = function() {
    abrirCompras();
};


