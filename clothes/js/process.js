// Función para copiar los datos del usuario a ProcesoCompra/PendientePago
function copiarUsuarioAProcesoCompra() {
    const usuario = firebase.auth().currentUser;

    if (usuario) {
        const database = firebase.database();
        const userRef = database.ref('usuarios/' + usuario.uid);

        userRef.once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const usuarioData = snapshot.val();

                    // Crear una copia del usuario en ProcesoCompra/PendientePago
                    const procesoCompraRef = database.ref('ProcesoCompra/PendientePago/' + usuario.uid);
                    procesoCompraRef.set(usuarioData)
                        .then(() => {
                            console.log("Usuario copiado a ProcesoCompra/PendientePago en la base de datos.");
                            
                            // Redirigir a la página de pagos.html
                            window.location.href = 'pagos.html';
                        })
                        .catch((error) => {
                            console.error("Error al copiar el usuario a ProcesoCompra/PendientePago:", error);
                        });
                } else {
                    console.log("El usuario no existe en la base de datos.");
                }
            })
            .catch((error) => {
                console.error("Error al obtener los datos del usuario:", error);
            });
    } else {
        console.log("Usuario no autenticado.");
    }
}

// Esperar a que el DOM se cargue completamente antes de añadir el evento click
document.addEventListener('DOMContentLoaded', function() {
    const pendienteCompraBtn = document.getElementById('pendiente-compra');
    if (pendienteCompraBtn) {
        pendienteCompraBtn.addEventListener('click', copiarUsuarioAProcesoCompra);
    } else {
        console.error("Elemento con id 'pendiente-compra' no encontrado.");
    }
});
