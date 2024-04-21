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

    const ambientLight = new THREE.AmbientLight(0xffffff, .5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
    directionalLight.position.set(1, 10, 20);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    let jacketMaterial; // Variable para almacenar el material de la chaqueta
    let capotaMesh;
    let capotaVisible = true;
    let bolsilloMesh;
    let bolsilloVisible = true;

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

        // Buscar el grupo con nombre "Capota"
        gltf.scene.traverse(function (child) {
            if (child.type === "Group" && child.name === "Capota") {
                capotaMesh = child;
            }
        });


        // Buscar el mesh con nombre "Capota"
        gltf.scene.traverse(function (child) {
            if (child.isMesh && child.name === "Bolsillo") {
                bolsilloMesh = child;
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
    });

    // Escuchar clics en el elemento con id "color1"
    const color2 = document.getElementById('color2');
    color2.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "color1"'); // Agregando console.log
        if (jacketMaterial) {
            // Cambiar el color de la textura del material a rojo
            jacketMaterial.color.set(0xFFFFFF); // Color rojo
        }
    });

    // Escuchar clics en el elemento con id "color1"
    const color3 = document.getElementById('color3');
    color3.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "color1"'); // Agregando console.log
        if (jacketMaterial) {
            // Cambiar el color de la textura del material a rojo
            jacketMaterial.color.set(0xFE2E2E); // Color rojo
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

    // Escuchar clics en el elemento con id "hat"
    const bolsillo = document.getElementById('bolsillo');
    bolsillo.addEventListener('click', function () {
        console.log('Se hizo clic en el elemento con id "hat"'); // Agregando console.log
        if (bolsilloMesh) {
            // Alternar la visibilidad del mesh del bolsillo
            bolsilloVisible = !bolsilloVisible;
            bolsilloMesh.visible = bolsilloVisible;
        }
    });
}

document.addEventListener('DOMContentLoaded', inicializar);
