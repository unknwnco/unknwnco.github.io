
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
let decal6Mesh;
let decal6Visible = false;
let decal7Mesh;
let decal7Visible = false;
let decal8Mesh;
let decal8Visible = false;
let decal9Mesh;
let decal9Visible = false;
let decal2Bolsillo2Mesh; // Variable para el mesh "Decal2.bolsillo2"
let decal2Bolsillo3Mesh; // Variable para el mesh "Decal2.bolsillo2"
// Variable para el estado de visibilidad de bolsillo3

// Definir los colores por defecto
const defaultJacketColor = 0xFFFFFF; // Color blanco
const defaultBolsilloColor = 0xDDDDDD; // Color gris

function inicializar() {
    const canvas = document.getElementById('item');

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvas.appendChild(renderer.domElement);

    const loader = new THREE.GLTFLoader();

    const camera = new THREE.PerspectiveCamera(13, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2.5;
    controls.maxDistance = 3.5;
    controls.minPolarAngle = 1.6;
    controls.maxPolarAngle = 1.6;
    controls.target = new THREE.Vector3(0, 1.3, 0);
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, .6);
    directionalLight.position.set(10, 10, 20);
    directionalLight.castShadow = true;
    scene.add(directionalLight);



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
                bolsilloMesh.visible = false;
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
        // Buscar el mesh con nombre "Decal5"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal5") {
                decal5Mesh = child;
                decal5Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Decal5"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal6") {
                decal6Mesh = child;
                decal6Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Decal5"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal7") {
                decal7Mesh = child;
                decal7Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Decal5"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal8") {
                decal8Mesh = child;
                decal8Mesh.visible = false;
            }
        });
        // Buscar el mesh con nombre "Decal5"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Decal9") {
                decal9Mesh = child;
                decal9Mesh.visible = false;
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

    // Función para verificar si el usuario está autenticado
function checkAuthentication() {
    const usuario = firebase.auth().currentUser;
    if (!usuario) {
        alert("Debe iniciar sesión para realizar esta acción.");
        return false;
    }
    return true;
}


// Escuchar clics en el elemento con id "color1"
const color1 = document.getElementById('color1');
color1.addEventListener('click', function () {
    //if (!checkAuthentication()) return;
    
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
    //if (!checkAuthentication()) return;
    
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
    //if (!checkAuthentication()) return;
    
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
    //if (!checkAuthentication()) return;
    
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
    //if (!checkAuthentication()) return;
    
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
    
    if (bolsilloMesh) {
        // Alternar la visibilidad del mesh del bolsillo
        bolsilloVisible = !bolsilloVisible;
        bolsilloMesh.visible = bolsilloVisible;
    }

    // Si ya estaba seleccionado, limpiar la selección
    if (selectedBolsillo === "Inferiores internos") {
        selectedBolsillo = null;
    } else {
        selectedBolsillo = "Inferiores internos";
    }
    updateSelectedOptions();
});

// Escuchar clics en el elemento con id "bolsillo2"
const bolsillo2 = document.getElementById('bolsillo2');
bolsillo2.addEventListener('click', function () {
    
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

    // Si ya estaba seleccionado, limpiar la selección
    if (selectedBolsillo === "Fontral medio") {
        selectedBolsillo = null;
    } else {
        selectedBolsillo = "Fontral medio";
    }
    updateSelectedOptions();
});

// Escuchar clics en el elemento con id "bolsillo3"
const bolsillo3 = document.getElementById('bolsillo3');
bolsillo3.addEventListener('click', function () {
    
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

    // Si ya estaba seleccionado, limpiar la selección
    if (selectedBolsillo === "Laterales") {
        selectedBolsillo = null;
    } else {
        selectedBolsillo = "Laterales";
    }
    updateSelectedOptions();
});

// Escuchar clics en el elemento con id "bolsillo4"
const bolsillo4 = document.getElementById('bolsillo4');
bolsillo4.addEventListener('click', function () {
    
    if (bolsillo4Mesh) {
        // Alternar la visibilidad del mesh del bolsillo
        bolsillo4Visible = !bolsillo4Visible;
        bolsillo4Mesh.visible = bolsillo4Visible;
    }

    // Si ya estaba seleccionado, limpiar la selección
    if (selectedBolsillo === "Inferiores externos") {
        selectedBolsillo = null;
    } else {
        selectedBolsillo = "Inferiores externos";
    }
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
    //if (!checkAuthentication()) return;
    
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
    //if (!checkAuthentication()) return;
    
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
    //if (!checkAuthentication()) return;
    
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
    //if (!checkAuthentication()) return;
    
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
// Escuchar clics en el elemento con id "decal4"
const decal5 = document.getElementById('decal5');
decal5.addEventListener('click', function () {
    //if (!checkAuthentication()) return;
    
    if (activeDecal !== decal5Mesh) {
        if (activeDecal) {
            activeDecal.visible = false;
        }
        decal5Mesh.visible = true;
        activeDecal = decal5Mesh;
        selectedDecal = "Custom"; // Establecer el decal seleccionado
    } else {
        deactivateDecal(decal5Mesh);
        selectedDecal = null; // Vaciar el decal seleccionado
    }
    updateSelectedOptions();
});
// Escuchar clics en el elemento con id "decal4"
const decal6 = document.getElementById('decal6');
decal6.addEventListener('click', function () {
    //if (!checkAuthentication()) return;
    
    if (activeDecal !== decal6Mesh) {
        if (activeDecal) {
            activeDecal.visible = false;
        }
        decal6Mesh.visible = true;
        activeDecal = decal6Mesh;
        selectedDecal = "Porshe"; // Establecer el decal seleccionado
    } else {
        deactivateDecal(decal6Mesh);
        selectedDecal = null; // Vaciar el decal seleccionado
    }
    updateSelectedOptions();
});
// Escuchar clics en el elemento con id "decal4"
const decal7 = document.getElementById('decal7');
decal7.addEventListener('click', function () {
    //if (!checkAuthentication()) return;
    
    if (activeDecal !== decal7Mesh) {
        if (activeDecal) {
            activeDecal.visible = false;
        }
        decal7Mesh.visible = true;
        activeDecal = decal7Mesh;
        selectedDecal = "Toyota"; // Establecer el decal seleccionado
    } else {
        deactivateDecal(decal7Mesh);
        selectedDecal = null; // Vaciar el decal seleccionado
    }
    updateSelectedOptions();
});
// Escuchar clics en el elemento con id "decal4"
const decal8 = document.getElementById('decal8');
decal8.addEventListener('click', function () {
    //if (!checkAuthentication()) return;
    
    if (activeDecal !== decal8Mesh) {
        if (activeDecal) {
            activeDecal.visible = false;
        }
        decal8Mesh.visible = true;
        activeDecal = decal8Mesh;
        selectedDecal = "Ferrari"; // Establecer el decal seleccionado
    } else {
        deactivateDecal(decal8Mesh);
        selectedDecal = null; // Vaciar el decal seleccionado
    }
    updateSelectedOptions();
});
// Escuchar clics en el elemento con id "decal4"
const decal9 = document.getElementById('decal9');
decal9.addEventListener('click', function () {
    //if (!checkAuthentication()) return;
    
    if (activeDecal !== decal9Mesh) {
        if (activeDecal) {
            activeDecal.visible = false;
        }
        decal9Mesh.visible = true;
        activeDecal = decal9Mesh;
        selectedDecal = "Volkswagen"; // Establecer el decal seleccionado
    } else {
        deactivateDecal(decal9Mesh);
        selectedDecal = null; // Vaciar el decal seleccionado
    }
    updateSelectedOptions();
});


}

document.addEventListener('DOMContentLoaded', inicializar);


// Inicializar arrays para almacenar los bolsillos seleccionados


// Escuchar clics en el elemento con id "bolsillo"
const bolsillo = document.getElementById('bolsillo');
bolsillo.addEventListener('click', function () {
    toggleSelection("Inferiores internos");
});

// Escuchar clics en el elemento con id "bolsillo2"
const bolsillo2 = document.getElementById('bolsillo2');
bolsillo2.addEventListener('click', function () {
    toggleSelection("Frontal medio");
});

// Escuchar clics en el elemento con id "bolsillo3"
const bolsillo3 = document.getElementById('bolsillo3');
bolsillo3.addEventListener('click', function () {
    toggleSelection("Laterales");
});

// Escuchar clics en el elemento con id "bolsillo4"
const bolsillo4 = document.getElementById('bolsillo4');
bolsillo4.addEventListener('click', function () {
    toggleSelection("Inferiores externos");
});



// Función para alternar la selección de un bolsillo
function toggleSelection(bolsilloName) {
    selectedBolsillos = Array.isArray(selectedBolsillos) ? selectedBolsillos : [];
    
    if (!selectedBolsillos.includes(bolsilloName)) {
        selectedBolsillos.push(bolsilloName);
    } else {
        selectedBolsillos = selectedBolsillos.filter(bolsillo => bolsillo !== bolsilloName);
    }
    updateSelectedOptions();
}


// Función para desactivar un decal
function deactivateDecal(decal) {
    decal.visible = false;
    activeDecal = null;
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
function vaciarOpciones() {
    limpiarOpciones(); // Limpia las opciones, lo que ya incluye establecer el contador a 1
    contadorSelecciones = 1;
}

document.addEventListener('DOMContentLoaded', function() {
    updateSelectedOptions(); // Llama a la función cuando el DOM se haya cargado

    // Agregar evento de clic al elemento "Vaciar opciones"
    const vaciarOpcionesButton = document.getElementById('vaciarOpciones');
    if (vaciarOpcionesButton) {
        vaciarOpcionesButton.addEventListener('click', vaciarOpciones);
    }
});

// Función para obtener las opciones guardadas desde la base de datos al cargar la página
function obtenerOpcionesGuardadas() {
    const usuario = firebase.auth().currentUser;

    if (usuario) {
        const database = firebase.database();
        const opcionesRef = database.ref(`usuarios/${usuario.uid}/Productos/Seleccionados`);

        opcionesRef.once('value')
            .then(snapshot => {
                const opcionesGuardadas = snapshot.val();
                console.log("Opciones guardadas obtenidas:", opcionesGuardadas);

                if (opcionesGuardadas && opcionesGuardadas["Chaquetas"]) {
                    contadorSelecciones = Object.keys(opcionesGuardadas["Chaquetas"]).length;
                    const shopDiv = document.getElementById('shop');
                    if (shopDiv) {
                        shopDiv.textContent = "+" + contadorSelecciones;
                    } else {
                        console.error("Elemento con id 'shop' no encontrado.");
                    }
                } else {
                    console.log("No se encontraron opciones guardadas para el usuario:", usuario.displayName);
                }
            })
            .catch(error => {
                console.error("Error al obtener las opciones guardadas:", error);
            });
    } else {
        console.log("Usuario no autenticado. No se pueden obtener las opciones guardadas.");
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    obtenerOpcionesGuardadas();
});

// Variables globales para almacenar las opciones seleccionadas y guardadas
let selectedOptions = {};
let opcionesGuardadasArray = [];
let contadorSelecciones = 1;


// Función para actualizar las opciones seleccionadas
function updateSelectedOptions() {
    // Restablecer la visibilidad de todos los bolsillos
    let bolsilloVisible = false;
    let bolsillo2Visible = false;
    let bolsillo3Visible = false;
    let bolsillo4Visible = false;

    // Actualizar las opciones seleccionadas
    selectedOptions = {
        "Diseño": selectedDecal || "",
        "Color": selectedColor || "",
        "Bolsillos": selectedBolsillos.length > 0 ? selectedBolsillos.join(", ") : "",
        "Capota": selectedHat ? "si" : "",
        "Cantidad": selectedCantidad
    };

    // Actualizar el contenido de la tabla
    const comprasBody = document.getElementById('comprasBody');
    comprasBody.innerHTML = ""; // Limpiar la tabla antes de agregar filas

    Object.entries(selectedOptions).forEach(([category, selection]) => {
        const row = document.createElement('tr');
        const categoryCell = document.createElement('td');
        categoryCell.textContent = category;
        row.appendChild(categoryCell);

        const valueCell = document.createElement('td');
        if (category === 'Cantidad') {
            const select = document.createElement('select');
            select.size = 1;
            select.addEventListener('change', function () {
                selectedCantidad = this.value;
                updateSelectedOptions();
            });
            for (let i = 1; i <= 99; i++) {
                const optionElement = document.createElement('option');
                optionElement.value = i;
                optionElement.textContent = i;
                if (i == selectedCantidad) {
                    optionElement.selected = true;
                }
                select.appendChild(optionElement);
            }
            valueCell.appendChild(select);
        } else {
            valueCell.textContent = selection;
        }
        row.appendChild(valueCell);
        comprasBody.appendChild(row);
    });

    // Actualizar el contenido del div "shop"
    const shopDiv = document.getElementById('shop');
    if (Object.keys(selectedOptions).filter(option => option !== 'Cantidad').some(option => selectedOptions[option] !== "")) {
        shopDiv.textContent = "+" + contadorSelecciones;
    } else if (contadorSelecciones === 1) {
        shopDiv.textContent = "";
    }

    // Actualizar la visibilidad de los bolsillos
    const updatePocketVisibility = (mesh, isVisible) => {
        if (mesh) mesh.visible = isVisible;
    };

    updatePocketVisibility(bolsilloMesh, selectedBolsillos.includes("Inferiores internos"));
    updatePocketVisibility(bolsillo2Mesh, selectedBolsillos.includes("Frontal medio"));
    updatePocketVisibility(bolsillo3Mesh, selectedBolsillos.includes("Laterales"));
    updatePocketVisibility(bolsillo4Mesh, selectedBolsillos.includes("Inferiores externos"));
    
    // Actualizar la visibilidad del capotaMesh
    if (capotaMesh) capotaMesh.visible = selectedHat;

    console.log("Opciones seleccionadas:", selectedOptions);
}

// Función para verificar y agregar opciones seleccionadas
// Función para verificar y agregar opciones seleccionadas
// Agregar un evento de clic al elemento con el id "continuar"
document.getElementById('continuar').addEventListener('click', function() {
    firebase.auth().onAuthStateChanged((usuario) => {
        if (!usuario) {
            // Mostrar el modal de inicio de sesión
            cerrarCompras()
            loginModal();
        } else {
            // Si el usuario está autenticado, activar la función continuar
            continuar();
            window.location.href = 'compra.html';
        }
    });
});

// Definir la función para el modal de inicio de sesión
function loginModal() {
    const loginModal = document.getElementById('login-modal');
    const body = document.querySelector('body');

    if (loginModal) {
        loginModal.style.display = 'block'; // Mostrar el modal
        body.style.overflow = "hidden"; // Desactivar el scroll

        // Agregar un evento de clic al fondo oscuro del modal
        loginModal.addEventListener('click', function(event) {
            // Verificar si el clic ocurrió fuera del contenido del modal
            if (event.target === loginModal) {
                // Cerrar el modal y reactivar el scroll del cuerpo
                loginModal.style.display = 'none';
                body.style.overflow = "auto";
            }
        });

        // Agregar un evento de clic al botón de cerrar el modal (si lo tienes)
        const closeButton = loginModal.querySelector('.close2');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                // Cerrar el modal y reactivar el scroll del cuerpo
                loginModal.style.display = 'none';
                body.style.overflow = "auto";
            });
        }

        // Agregar un evento para detectar el inicio de sesión
        firebase.auth().onAuthStateChanged((usuario) => {
            if (usuario) {
                // Cerrar el modal y reactivar el scroll del cuerpo si el usuario se autentica
                loginModal.style.display = 'none';
                body.style.overflow = "auto";
                continuar(); // Ejecutar la función continuar
            }
        });
    }
}





// Definir la función continuar
function continuar() {
    // Verificar si hay opciones activas
    const hayOpcionesActivas = Object.values(selectedOptions).some(option => option !== "" && option !== 1);
    
    // Verificar si hay al menos una opción guardada
    const hayOpcionesGuardadas = opcionesGuardadasArray.length > 0;

    if (hayOpcionesActivas || !hayOpcionesGuardadas) {
        // Si hay opciones activas o no hay opciones guardadas, mostrar alerta
        
    } else {
        updateSelectedOptions();
        const opcionesClonadas = { ...selectedOptions };
        opcionesGuardadasArray.push(opcionesClonadas);

        const shopDiv = document.getElementById('shop');
        shopDiv.textContent = "+" + contadorSelecciones;

        // Guardar las opciones en la base de datos
        guardarOpciones();

        limpiarOpciones();
    }
}




// Función para guardar las opciones seleccionadas
function agregarOpciones() {
    const hayOpcionesActivas = Object.values(selectedOptions).some(option => option !== "" && option !== 1);
    
    if (hayOpcionesActivas) {
        updateSelectedOptions();
        const opcionesClonadas = { ...selectedOptions };
        opcionesGuardadasArray.push(opcionesClonadas);

        guardarOpciones();
        limpiarOpciones();
    } else {
        console.log("No hay opciones activas para agregar.");
    }
}

function guardarOpciones() {
    const usuario = firebase.auth().currentUser;

    if (usuario) {
        const database = firebase.database();
        const opcionesRef = database.ref(`usuarios/${usuario.uid}/Productos/Seleccionados/Chaquetas`);

        const nuevoNombreChaqueta = `Chaqueta ${contadorSelecciones}`;

        opcionesRef.child(nuevoNombreChaqueta).set(selectedOptions)
            .then(() => {
                console.log("Opciones guardadas en la base de datos.");
                contadorSelecciones++;
                const shopDiv = document.getElementById('shop');
                shopDiv.textContent = "+" + contadorSelecciones;
            })
            .catch(error => {
                console.error("Error al guardar las opciones:", error);
            });
    } else {
        console.log("Usuario no autenticado. No se pueden guardar las opciones.");
    }
}




// Función para limpiar todos los datos cuando se cierra la sesión
function limpiarDatosAlCerrarSesion() {
    // Limpiar todas las variables o datos que necesiten ser reiniciados
    opcionesGuardadasArray = []; // Reiniciar el array de opciones guardadas
    contadorSelecciones = 1; // Reiniciar el contador de selecciones
    limpiarOpciones(); // Limpiar las opciones
}

// Escuchar cambios en el estado de autenticación
firebase.auth().onAuthStateChanged((usuario) => {
    if (usuario) {
        console.log("Usuario ha iniciado sesión:", usuario.displayName);
        obtenerOpcionesGuardadas(); // Llamar a la función si el usuario ha iniciado sesión
    } else {
        console.log("Usuario ha cerrado sesión.");
        limpiarDatosAlCerrarSesion(); // Llamar a la función para limpiar datos cuando se cierra la sesión
    }
});




document.addEventListener('DOMContentLoaded', function() {
    updateSelectedOptions(); // Llama a la función cuando el DOM se haya cargado

    // Agregar evento de clic al elemento "Vaciar opciones"
    const vaciarOpcionesButton = document.getElementById('vaciarOpciones');
    if (vaciarOpcionesButton) {
        vaciarOpcionesButton.addEventListener('click', limpiarOpcionesButton);
    }

    // Agregar evento de clic al elemento "Guardar opciones"
    const agregarOpcionesButton = document.getElementById('agregarOpciones');
    if (agregarOpcionesButton) {
        agregarOpcionesButton.addEventListener('click', agregarOpciones);
    }
        // Agregar evento de clic al elemento "Guardar opciones"
        const guardarOpcionesButton = document.getElementById('guardarOpciones');
        if (guardarOpcionesButton) {
            guardarOpcionesButton.addEventListener('click', guardarOpciones);
        }
});

function limpiarOpcionesButton() {
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
        //console.log("Capota desactivado por defecto.");
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

        // Obtener el usuario autenticado
        const usuario = firebase.auth().currentUser;

        if (usuario) { // Si el usuario está autenticado
            // Obtener una referencia a la base de datos donde se guardan las opciones
            const database = firebase.database();
            const opcionesRef = database.ref('usuarios/' + usuario.uid + '/Productos/Seleccionados');
            
            // Eliminar los datos guardados de la base de datos
            opcionesRef.remove()
                .then(() => {
                    console.log("Datos guardados eliminados de la base de datos.");
                })
                .catch(error => {
                    console.error("Error al eliminar los datos guardados:", error);
                });
        } else {
            console.log("Usuario no autenticado. No se pueden eliminar los datos guardados.");
        }

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

//custom desing
document.getElementById('actual-btn').addEventListener('change', function() {
    var fileName = this.value.split('\\').pop();
    document.getElementById('file-name').textContent = fileName;
  });

document.getElementById('actual-btn').addEventListener('change', function() {
  var file = this.files[0];
  var reader = new FileReader();
  
  reader.onload = function(e) {
    document.getElementById('preview-img').src = e.target.result;
  }
  
  reader.readAsDataURL(file);
});

document.getElementById('actual-btn').addEventListener('change', function() {
    var file = this.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
      // Cargar la imagen en Three.js
      var textureLoader = new THREE.TextureLoader();
      textureLoader.load(e.target.result, function(texture) {
        // Reemplazar el mapa de textura del material del mesh "Decal5"
        texture.flipY = false;
        decal5Mesh.material.map = texture;
        decal5Mesh.material.needsUpdate = true;
        decal5Mesh.visible = true; // Hacer visible el mesh
      });
    }
    
    reader.readAsDataURL(file);
  });

//tabla container
