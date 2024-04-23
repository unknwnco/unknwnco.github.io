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
                capotaMesh.visible = true; // Ocultar por defecto
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

        // Función de renderizado
        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }

        // Llamar a la función de renderizado
        render();
    });

    // Escuchar clics en el elemento con id "color1"
    const color1 = document.getElementById('color1');
    color1.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "color1"'); // Agregando console.log
        if (jacketMaterial) {
            // Cambiar el color de la textura del material a rojo
            jacketMaterial.color.set(0x1C1C1C); // Color rojo
        }
            // Cambiar el color del bolsilloMaterial a gris
        if (bolsilloMaterial) {
            bolsilloMaterial.color.set(0x363636); // Color gris
        }
    });

    // Escuchar clics en el elemento con id "color1"
    const color2 = document.getElementById('color2');
    color2.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "color1"'); // Agregando console.log
        if (jacketMaterial) {
            // Cambiar el color de la textura del material a rojo
            jacketMaterial.color.set(0xFFFFFF); // Color rojo
        }
        
            // Cambiar el color del bolsilloMaterial a gris
        if (bolsilloMaterial) {
            bolsilloMaterial.color.set(0xDDDDDD); // Color gris
        }
    });

    // Escuchar clics en el elemento con id "color1"
    const color3 = document.getElementById('color3');
    color3.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "color1"'); // Agregando console.log
        if (jacketMaterial) {
            // Cambiar el color de la textura del material a rojo
            jacketMaterial.color.set(0xB40404); // Color rojo
        }
            // Cambiar el color del bolsilloMaterial a gris
        if (bolsilloMaterial) {
            bolsilloMaterial.color.set(0xc00606); // Color gris
        }
    });

    // Escuchar clics en el elemento con id "color1"
    const color4 = document.getElementById('color4');
    color4.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "color1"'); // Agregando console.log
        if (jacketMaterial) {
            // Cambiar el color de la textura del material a rojo
            jacketMaterial.color.set(0x0431B4); // Color rojo
        }
            // Cambiar el color del bolsilloMaterial a gris
        if (bolsilloMaterial) {
            bolsilloMaterial.color.set(0x08298A); // Color gris
        }
    });

    // Escuchar clics en el elemento con id "hat"
    const hat = document.getElementById('hat');
    hat.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "hat"'); // Agregando console.log
        if (capotaMesh) {
            // Alternar la visibilidad del mesh del hat
            capotaVisible = !capotaVisible;
            capotaMesh.visible = capotaVisible;
        }
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
    });

    // Escuchar clics en el elemento con id "bolsillo"
    const bolsillo2 = document.getElementById('bolsillo2');
    bolsillo2.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "hat"'); // Agregando console.log
        if (bolsillo2Mesh) {
            // Alternar la visibilidad del mesh del bolsillo
            bolsillo2Visible = !bolsillo2Visible;
            bolsillo2Mesh.visible = bolsillo2Visible;
        }
    });

    // Escuchar clics en el elemento con id "bolsillo"
    const bolsillo3 = document.getElementById('bolsillo3');
    bolsillo3.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "hat"'); // Agregando console.log
        if (bolsillo3Mesh) {
            // Alternar la visibilidad del mesh del bolsillo
            bolsillo3Visible = !bolsillo3Visible;
            bolsillo3Mesh.visible = bolsillo3Visible;
        }
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
    });

    // Escuchar clics en el elemento con id "hat"
    const decal = document.getElementById('decal');
    decal.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "hat"'); // Agregando console.log
        if (decalMesh) {
            // Alternar la visibilidad del mesh del bolsillo
            decalVisible = !decalVisible;
            decalMesh.visible = decalVisible;
        }
    });
}

document.addEventListener('DOMContentLoaded', inicializar);
