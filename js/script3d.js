// Obtener referencias de elementos del DOM
var modal = document.getElementById("myModal");
var closeModalBtn = document.getElementsByClassName("close")[0];
var body = document.getElementsByTagName("body")[0];

// Función para cerrar el modal al hacer clic en la "x" o fuera del modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    body.style.overflow = "auto"; // Reactivar el scroll
  }
}

// Función para cerrar el modal al hacer clic en la "x"
closeModalBtn.onclick = function() {
  modal.style.display = "none";
  body.style.overflow = "auto"; // Reactivar el scroll
}

// Mostrar el modal al cargar la página
modal.style.display = "block";
body.style.overflow = "hidden"; // Desactivar el scroll





    // Obtener la barra de progreso interna y el preloader
    const progressBar = document.querySelector('.progress-bar-inner');
    const preloader = document.getElementById('preloader-container');

    // Definir el tiempo de simulación del preloader (en milisegundos)
    const simulatedLoadTime = 1500; // Por ejemplo, 2 segundos

    // Simular el progreso de carga durante el tiempo especificado
    let startTime = null;
    function animateProgressBar(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / simulatedLoadTime, 1);
        progressBar.style.width = `${progress * 100}%`;
        if (progress < 1) {
            requestAnimationFrame(animateProgressBar);
        } else {
            // Una vez completada la simulación de carga, desvanece el preloader
            fadeOut(preloader, 500); // Desvanecer el preloader en 1 segundo (1000 milisegundos)
        }
    }

    // Iniciar la animación de la barra de progreso
    requestAnimationFrame(animateProgressBar);

    // Función para desvanecer un elemento HTML
    function fadeOut(element, duration) {
        const interval = 10; // Intervalo de tiempo para actualizar la opacidad (en milisegundos)
        const steps = duration / interval; // Número de pasos de animación
        let currentStep = 0;

        const opacityStep = 1 / steps; // Paso de opacidad en cada intervalo

        // Función para actualizar la opacidad en cada intervalo
        function updateOpacity() {
            currentStep++;
            element.style.opacity = 1 - (currentStep * opacityStep);

            // Si se alcanza el último paso, ocultar el elemento
            if (currentStep >= steps) {
                element.style.display = 'none';
            } else {
                // De lo contrario, continuar la animación
                setTimeout(updateOpacity, interval);
            }
        }

        // Iniciar la animación
        updateOpacity();
    }
// FIN DEL PRELOADER

// Inicializar PRELOADER PROGRESS BAR
function inicializar() {
       
// Inicializar la escena Three.js dentro del contenedor
        const container1 = document.getElementById('item1');
        const container2 = document.getElementById('item2');
        const container3 = document.getElementById('item3');
        const container4 = document.getElementById('item4'); // Nuevo contenedor

        const scene1 = new THREE.Scene();
        const scene2 = new THREE.Scene();
        const scene3 = new THREE.Scene();
        const scene4 = new THREE.Scene(); // Nueva escena

        const renderer1 = new THREE.WebGLRenderer({ alpha: true,antialias: true }); // Configurar el fondo del renderizador como transparente
        const renderer2 = new THREE.WebGLRenderer({ alpha: true,antialias: true });
        const renderer3 = new THREE.WebGLRenderer({ alpha: true,antialias: true });
        const renderer4 = new THREE.WebGLRenderer({ alpha: true,antialias: true }); // Nuevo renderizador

        renderer1.setSize(container1.clientWidth, container1.clientHeight);
        renderer2.setSize(container2.clientWidth, container2.clientHeight);
        renderer3.setSize(container3.clientWidth, container3.clientHeight);
        renderer4.setSize(container4.clientWidth, container4.clientHeight); // Nuevo tamaño del renderizador

        container1.appendChild(renderer1.domElement);
        container2.appendChild(renderer2.domElement);
        container3.appendChild(renderer3.domElement);
        container4.appendChild(renderer4.domElement); // Agregar renderizador al nuevo contenedor

        const loader = new THREE.GLTFLoader();

        // Definir cámaras y controles orbitales fuera de las funciones de carga de modelos
        const camera1 = new THREE.PerspectiveCamera(45, container1.clientWidth / container1.clientHeight, 0.1, 1000);
        const controls1 = new THREE.OrbitControls(camera1, renderer1.domElement);
        controls1.enableDamping = true;
        controls1.enablePan = false;
        controls1.enableZoom = true; // Deshabilitar el zoom para los primeros tres modelos
        controls1.minDistance = 3.5;
        controls1.maxDistance = 4.5; // Límite de zoom
        controls1.minPolarAngle = 1.7;
        controls1.maxPolarAngle = 1.7;
        controls1.target = new THREE.Vector3(0, 1.4, 0);
        controls1.update();
        
        const camera2 = new THREE.PerspectiveCamera(45, container2.clientWidth / container2.clientHeight, 0.1, 1000);
        const controls2 = new THREE.OrbitControls(camera2, renderer2.domElement);
        controls2.enableDamping = true;
        controls2.enablePan = false;
        controls2.enableZoom = true;
        controls2.minDistance = 2;
        controls2.maxDistance = 3.8;
        controls2.minPolarAngle = 1.4; // Ángulo mínimo de 45 grados (en radianes)
        controls2.maxPolarAngle = (3 * Math.PI) / 5; // Ángulo máximo de 135 grados (en radianes)
        controls2.target = new THREE.Vector3(0, 1.3, 0);
        controls2.update();
        
        
        const camera3 = new THREE.PerspectiveCamera(45, container3.clientWidth / container3.clientHeight, 0.1, 1000);
        const controls3 = new THREE.OrbitControls(camera3, renderer3.domElement);
        controls3.enableDamping = true;
        controls3.enablePan = false;
        controls3.enableZoom = false;
        controls3.minDistance = 1;
        controls3.maxDistance = 4.5;
        controls3.minPolarAngle = 1.4;
        controls3.maxPolarAngle = 1.4;
        controls3.target = new THREE.Vector3(0, 1.4, 0);
        controls3.update();

        const camera4 = new THREE.PerspectiveCamera(45, container4.clientWidth / container4.clientHeight, 0.1, 1000); // Nueva cámara
        const controls4 = new THREE.OrbitControls(camera4, renderer4.domElement); // Nuevos controles
        controls4.enableDamping = true;
        controls4.enablePan = false;
        controls4.enableZoom = true; // Habilitar zoom para el último modelo
        controls4.minDistance = 1;
        controls4.maxDistance = 4; // Límite de zoom
        controls4.minPolarAngle = 1.4;
        controls4.maxPolarAngle = 1.4;
        controls4.target = new THREE.Vector3(0, .9, 0);
        controls4.update();

        loader.load('/3dmodels/avatar.glb', function (gltf) {
          const model1 = gltf.scene;
          scene1.add(model1);
        
          // Recorrer todos los materiales del modelo y configurarlos como ToonMaterial
          model1.traverse((child) => {
            if (child.isMesh) {
              const toonMaterial = new THREE.MeshToonMaterial({
                color: child.material.color, // Mantener el color original del material
                specular: new THREE.Color(0x000000), // Especificar un color negro para el componente especular
              });
              child.material = toonMaterial; // Reemplazar el material existente por el nuevo material toon
            }
          });       
        
          // Crear un objeto para agrupar la luz
          const lightGroup = new THREE.Object3D();
        
          // Agregar una luz de ambiente al grupo de luces
          const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Color blanco y intensidad 0.5
          lightGroup.add(ambientLight);
        
          // Agregar el grupo de luces a la escena
          scene1.add(lightGroup);
        
          // Posicionar la cámara y los controles orbitales para el modelo1
          camera1.position.set(-0.1, 5, 1.8); // Mover la cámara hacia abajo en el eje Z
          // Mover el objetivo de la cámara
          controls1.update(); // Actualizar los controles
        });
        


        loader.load('/3dmodels/outfit.glb', function (gltf) {
          const model2 = gltf.scene;
          scene2.add(model2);
        
          // Recorrer todos los materiales del modelo y configurarlos como ToonMaterial
          model2.traverse((child) => {
            if (child.isMesh) {
              const toonMaterial = new THREE.MeshToonMaterial({
                color: child.material.color, // Mantener el color original del material
                specular: new THREE.Color(0x000000), // Especificar un color negro para el componente especular
              });
              child.material = toonMaterial; // Reemplazar el material existente por el nuevo material toon
            }
          });       
        
          // Crear un objeto para agrupar las luces
          const lightGroup = new THREE.Object3D();
          
          // Agregar la luz direccional principal al grupo de luces
          const light = new THREE.DirectionalLight(0xffffff, 1.4); // Color blanco y intensidad 1.6
          light.position.set(2, 1, 2); // Posición de la luz respecto al grupo
          light.shadow.softness = 1; // Suavidad de las sombras
          lightGroup.add(light);
          
          // Agregar una luz direccional trasera más tenue al grupo de luces
          const backLight = new THREE.DirectionalLight(0xffffff, 0.7); // Color blanco y intensidad 0.8
          backLight.position.set(-2, -1, -2); // Posición opuesta a la luz principal
          lightGroup.add(backLight);
        
          // Rotar el grupo de luces en el eje Z
          lightGroup.rotateZ(Math.PI / 2); // Rotar la luz 45 grados en el eje Z
          
          // Agregar el grupo de luces a la escena
          scene2.add(lightGroup);
        
          // Posicionar la cámara y los controles orbitales para el modelo1
          camera2.position.set(-0.1, 4.5, 1.8); // Mover la cámara hacia abajo en el eje Z
          // Mover el objetivo de la cámara
          controls2.update(); // Actualizar los controles
        });
        
        

        loader.load('/3dmodels/prop.glb', function (gltf) {
          const model3 = gltf.scene;
          scene3.add(model3);
        
          // Recorrer todos los materiales del modelo y configurarlos como ToonMaterial
          model3.traverse((child) => {
            if (child.isMesh) {
              const toonMaterial = new THREE.MeshToonMaterial({
                color: child.material.color, // Mantener el color original del material
                specular: new THREE.Color(0x000000), // Especificar un color negro para el componente especular
              });
              child.material = toonMaterial; // Reemplazar el material existente por el nuevo material toon
            }
          });       
        
          // Crear un objeto para agrupar la luz y luego rotarlo
          const lightGroup = new THREE.Object3D();
        
          // Agregar una luz direccional al grupo de luces
          const light = new THREE.DirectionalLight(0xffffff, 12); // Color blanco y intensidad 5
          light.position.set(0, 5, 0); // Posición de la luz respecto al grupo
          lightGroup.add(light);
        
          // Rotar el grupo de luces en el eje Z
          lightGroup.rotateZ(Math.PI / 5); // Rotar la luz 45 grados en el eje Z
          
          // Agregar el grupo de luces a la escena
          scene3.add(lightGroup);
        
          // Posicionar la cámara y los controles orbitales para el modelo3
          camera3.position.set(-0.1, 0, 2); // Mover la cámara hacia abajo en el eje Z
          // Mover el objetivo de la cámara
          controls3.update(); // Actualizar los controles
        });
        
        loader.load('/3dmodels/world.glb', function (gltf) {
          const model4 = gltf.scene;
          scene4.add(model4);
        
          // Recorrer todos los materiales del modelo y ajustar su reflectividad
          model4.traverse((child) => {
            if (child.isMesh) {
              child.material.reflectivity = 0; // Establecer reflectividad a 0 para eliminar el componente especular
            }
          });
        
          // Agregar una luz ambiental al modelo
          const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Color blanco y intensidad 0.5
          scene4.add(ambientLight);
        
          // Agregar luz rectangular
          const width = .4;
          const height = .2;
          const intensity = 400;
          const rectLight = new THREE.RectAreaLight(0x0000ff, intensity, width, height); // Cambiar el color a azul (0x0000ff)
          rectLight.position.set(0, .6, -.8); // Ajustar la posición para que apunte desde arriba
          rectLight.lookAt(0, -4, 0); // Orientar la luz hacia abajo
          scene4.add(rectLight);
        
          const rectLightHelper = new THREE.RectAreaLightHelper(rectLight);
          scene4.add(rectLightHelper);
        
          // Posicionar la cámara y los controles orbitales para el nuevo modelo
          camera4.position.set(.7, 4, 1); // Mover la cámara hacia abajo en el eje Z
          // Mover el objetivo de la cámara
          controls4.update(); // Actualizar los controles
        });
        
        



        // Función de renderizado y animación
        function animate() {
          requestAnimationFrame(animate);
        
          // Rotar la escena en lugar de los modelos
          scene1.rotation.y -= 0.01;
          scene2.rotation.y -= 0.01;
          scene3.rotation.y -= 0.01;
        
          renderer1.render(scene1, camera1);
          renderer2.render(scene2, camera2);
          renderer3.render(scene3, camera3);
          renderer4.render(scene4, camera4);
        }
        animate();

      }

// Llamar a la función de inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializar);









// Función de renderizado y animación
        //function animate() {
        //  requestAnimationFrame(animate);

          // Rotar los modelos sobre sí mismos en sentido opuesto
        //  if (scene1.children.length > 0) {
        //    scene1.children[0].rotation.y -= 0.01;
        //  }
        //  if (scene2.children.length > 0) {
        //    scene2.children[0].rotation.y -= 0.01;
        //  }
        //  if (scene3.children.length > 0) {
        //    scene3.children[0].rotation.y -= 0.01;
        //  }

        //  renderer1.render(scene1, camera1);
        //  renderer2.render(scene2, camera2);
        //  renderer3.render(scene3, camera3);
        //  renderer4.render(scene4, camera4);
        //}
        //animate();