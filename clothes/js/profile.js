        // Seleccionar todos los botones
        var botones = document.querySelectorAll('.btnmm');
    
        // Añadir evento de clic a cada botón
        botones.forEach(function(boton) {
            boton.addEventListener('click', function() {
                // Ocultar todos los elementos de contenido
                var contenidos = document.querySelectorAll('.content');
                contenidos.forEach(function(contenido) {
                    contenido.classList.remove('active');
                });
                // Mostrar el contenido relacionado con el botón clicado
                var contentId = boton.getAttribute('data-content');
                document.getElementById(contentId).classList.add('active');
            });
        });