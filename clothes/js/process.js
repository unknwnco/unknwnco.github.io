function moverOpcionesAPendientePago() {
    const usuario = firebase.auth().currentUser;

    if (usuario) {
        const database = firebase.database();
        const seleccionadosRef = database.ref(`usuarios/${usuario.uid}/Productos/Seleccionados`);
        const pendientePagoRef = database.ref(`usuarios/${usuario.uid}/Productos/Pendiente`);
        const contadorRef = database.ref(`usuarios/${usuario.uid}/contadorPedidos`);

        seleccionadosRef.once('value')
            .then(snapshot => {
                const seleccionados = snapshot.val();
                if (seleccionados) {
                    contadorRef.transaction(currentCount => {
                        return (currentCount || 0) + 1;
                    }).then(result => {
                        if (result.committed) {
                            const nuevoNumeroPedido = result.snapshot.val();
                            const nuevoPedidoKey = `orden ${nuevoNumeroPedido}`;
                            pendientePagoRef.child(nuevoPedidoKey).set(seleccionados)
                                .then(() => {
                                    console.log("Opciones movidas a PendientePago y enumeradas.");
                                    seleccionadosRef.remove()
                                        .then(() => {
                                            console.log("Opciones eliminadas de Seleccionados.");
                                            // Redireccionar a la página pagos.html
                                            window.location.href = 'pagos.html';
                                        })
                                        .catch(error => {
                                            console.error("Error al eliminar opciones de Seleccionados:", error);
                                        });
                                })
                                .catch(error => {
                                    console.error("Error al mover opciones a PendientePago:", error);
                                });
                        } else {
                            console.error("Error al incrementar el contador de pedidos.");
                        }
                    }).catch(error => {
                        console.error("Error al realizar la transacción del contador de pedidos:", error);
                    });
                } else {
                    console.log("No hay opciones en Seleccionados para mover.");
                }
            })
            .catch(error => {
                console.error("Error al leer opciones de Seleccionados:", error);
            });
    } else {
        console.log("Usuario no autenticado. No se pueden mover las opciones.");
    }
}

// Esperar a que el DOM se cargue completamente antes de añadir el evento click
document.addEventListener('DOMContentLoaded', function() {
    const pendienteCompraBtn = document.getElementById('pendiente-compra');
    if (pendienteCompraBtn) {
        pendienteCompraBtn.addEventListener('click', moverOpcionesAPendientePago);
    } else {
        console.error("Elemento con id 'pendiente-compra' no encontrado.");
    }
});
