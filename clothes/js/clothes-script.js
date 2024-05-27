$('.menu-bar').on('click', function() {
    $('nav ul').toggleClass('reveal');
})

$('')

// Seleccionar todos los botones
var botones = document.querySelectorAll('.btnmm');

// Añadir evento de clic a cada botón
botones.forEach(function(boton) {
    boton.addEventListener('click', function() {
        // Eliminar la clase 'btn-active' de todos los botones
        botones.forEach(function(btn) {
            btn.classList.remove('btn-active');
        });

        // Añadir la clase 'btn-active' al botón clicado
        boton.classList.add('btn-active');

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
