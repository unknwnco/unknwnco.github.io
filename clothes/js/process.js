// Función para copiar los datos del usuario a ProcesoCompra
function copiarUsuarioAProcesoCompra() {
    const usuario = firebase.auth().currentUser;

    if (usuario) {
        const database = firebase.database();
        const userRef = database.ref('usuarios/' + usuario.uid);

        userRef.once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const usuarioData = snapshot.val();

                    // Crear una copia del usuario en ProcesoCompra en la raíz de la base de datos
                    const procesoCompraRef = database.ref('ProcesoCompra/' + usuario.uid);
                    procesoCompraRef.set(usuarioData)
                        .then(() => {
                            console.log("Usuario copiado a ProcesoCompra en la base de datos.");
                        })
                        .catch((error) => {
                            console.error("Error al copiar el usuario a ProcesoCompra:", error);
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
    // Evento click para pendiente-compra
    document.getElementById('pendiente-compra').addEventListener('click', copiarUsuarioAProcesoCompra);
});
