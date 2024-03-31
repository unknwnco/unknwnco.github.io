// Obtener referencias de elementos del DOM
var modal = document.getElementById("myModal");
var closeModalBtn = document.getElementsByClassName("close")[0];
var body = document.getElementsByTagName("body")[0];

// Función para cerrar el modal al hacer clic en la "x" o fuera del modal
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    //body.style.overflow = "auto"; // Reactivar el scroll
  }
}

// Función para cerrar el modal al hacer clic en la "x"
closeModalBtn.onclick = function() {
  modal.style.display = "none";
  //body.style.overflow = "auto"; // Reactivar el scroll
}

// Mostrar el modal al cargar la página
modal.style.display = "block";
//body.style.overflow = "hidden"; // Desactivar el scroll



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


        const scene1 = new THREE.Scene();
        const scene2 = new THREE.Scene();

        const renderer1 = new THREE.WebGLRenderer({ alpha: true,antialias: true }); // Configurar el fondo del renderizador como transparente
        const renderer2 = new THREE.WebGLRenderer({ alpha: true,antialias: true });

        renderer1.setSize(container1.clientWidth, container1.clientHeight);
        renderer2.setSize(container2.clientWidth, container2.clientHeight);

        container1.appendChild(renderer1.domElement);
        container2.appendChild(renderer2.domElement);


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
        


// Iniciar temporizador
console.time('Tiempo de carga');

// Cargar el modelo
loader.load('/3dmodels/avatarlow.glb', function (gltf) {
    // Detener temporizador
    console.timeEnd('Tiempo de carga');

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



        loader.load('/3dmodels/Outfitlow.glb', function (gltf) {
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




        // Función de renderizado y animación
        function animate() {
          requestAnimationFrame(animate);
        
          // Rotar la escena en lugar de los modelos
          scene1.rotation.y -= 0.01;
          scene2.rotation.y -= 0.01;
        
          renderer1.render(scene1, camera1);
          renderer2.render(scene2, camera2);
          
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