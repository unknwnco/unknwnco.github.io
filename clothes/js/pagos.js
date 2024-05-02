document.getElementById("btn1").addEventListener("click", function() {
    // Mostrar la barra de progreso al hacer clic en el botón
    document.getElementById("progressBar").style.display = "block"; 
    
    // Ejecutar la función para simular progreso
    simulateProgress(function() {
        // Mostrar el contenedor2 después de que termine la simulación de progreso
        document.getElementById("container2").style.display = "flex"; 
        // Hacer que el contenedor2 esté sobre el contenedor1
        document.getElementById("container2").style.zIndex = "2"; 
    });
});

function simulateProgress(callback) {
    var progressBarFill = document.getElementById("progressBarFill");
    var width = 1;
    var interval = setInterval(function() {
        if (width >= 100) {
            clearInterval(interval);
            // Llamar al callback después de que termine la simulación de progreso
            callback();
        } else {
            width++;
            progressBarFill.style.width = width + "%";
        }
    }, 10);
}