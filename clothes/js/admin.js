// Función para mostrar la información del usuario
function displayUserInfo(user) {
    if (user) {
        document.getElementById('user-info').innerText = user.displayName || 'Nombre no disponible';
        document.getElementById('user-mail').innerText = user.email;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-mail').style.display = 'block';
        document.getElementById('sign-out').style.display = 'block';
        document.getElementById('login').style.display = 'none'; // Oculta el botón de inicio de sesión
    } else {
        // El usuario no está autenticado, oculta la información del usuario y muestra el botón de inicio de sesión
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('user-mail').style.display = 'none';
        document.getElementById('sign-out').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    }
}

// Función para cargar y mostrar los usuarios
function loadUsers() {
    const usersRef = firebase.database().ref('usuarios');
    usersRef.once('value').then(snapshot => {
        const usersTable = document.getElementById('users-table');
        usersTable.innerHTML = ''; // Limpiar la tabla antes de cargar los datos
        snapshot.forEach(childSnapshot => {
            const user = childSnapshot.val();
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const emailCell = document.createElement('td');

            // Verificar si Name y Email tienen valores
            const name = user.Name || 'Nombre no disponible';
            const email = user.Email || 'Email no disponible';

            nameCell.textContent = name;
            emailCell.textContent = email;
            row.appendChild(nameCell);
            row.appendChild(emailCell);
            usersTable.appendChild(row);
        });
    }).catch(error => {
        console.error('Error al obtener los usuarios:', error);
    });
}
document.addEventListener('DOMContentLoaded', function () {
    // Verificar la autenticación del usuario y su rol
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Obtener el rol del usuario
            const userRef = firebase.database().ref('usuarios/' + user.uid);
            userRef.once('value').then(snapshot => {
                const userData = snapshot.val();
                const userRol = userData && userData.Rol;

                if (userRol === 'vendedor') {
                    // Usuario tiene rol de vendedor, cargar los datos
                    loadUsers();
                    loadUsersPending();
                } else {
                    // Manejar caso donde el usuario no es vendedor
                    console.log('El usuario no tiene permisos para ver esta información.');
                }
            }).catch(error => {
                console.error('Error al obtener el rol del usuario:', error);
            });
        } else {
            // No hay usuario autenticado, manejar de acuerdo a tu aplicación
            console.log('Usuario no autenticado.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Verificar la autenticación del usuario y su rol
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Obtener el rol del usuario
            const userRef = firebase.database().ref('usuarios/' + user.uid);
            userRef.once('value').then(snapshot => {
                const userData = snapshot.val();
                const userRol = userData && userData.Rol;

                if (userRol === 'vendedor') {
                    // Usuario tiene rol de vendedor, cargar los datos
                    loadUsersPending();
                } else {
                    // Manejar caso donde el usuario no es vendedor
                    console.log('El usuario no tiene permisos para ver esta información.');
                }
            }).catch(error => {
                console.error('Error al obtener el rol del usuario:', error);
            });
        } else {
            // No hay usuario autenticado, manejar de acuerdo a tu aplicación
            console.log('Usuario no autenticado.');
        }
    });
});

function loadUsersPending() {
    const database = firebase.database();
    const usuariosRef = database.ref('usuarios');

    usuariosRef.once('value')
        .then(snapshot => {
            const usuarios = snapshot.val();
            if (!usuarios) {
                console.error('No se encontraron usuarios en la base de datos.');
                return;
            }
            for (const usuarioId in usuarios) {
                const usuario = usuarios[usuarioId];
                const productos = usuario.Productos;
                if (productos) {
                    for (const estado in productos) {
                        if (estado !== 'Seleccionados' && estado !== 'contadorPedidos' && estado !== 'Rol') {
                            for (const pedidoId in productos[estado]) {
                                const pedido = productos[estado][pedidoId];
                                agregarPedidoATabla(usuarioId, usuario.Name, usuario.Email, pedidoId, estado);
                            }
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error("Error al cargar los usuarios:", error);
        });
}

function agregarPedidoATabla(usuarioId, nombre, email, pedidoId, estadoActual) {
    const tableBody = document.getElementById('pedidosTable').querySelector('tbody');

    if (!tableBody) {
        console.error('No se encontró el elemento tbody.');
        return;
    }

    // Verificar si el pedido ya está en la tabla para evitar duplicados
    if (document.getElementById(`pedido-${pedidoId}`)) {
        return;
    }

    const row = document.createElement('tr');
    row.setAttribute('id', `pedido-${pedidoId}`);

    row.innerHTML = `
        <td>${pedidoId}</td>
        <td>${nombre}</td>
        <td>${email}</td>
        <td>
        <div class="status-container">
            <select class="multi-selector" onchange="actualizarEstadoPedido('${usuarioId}', '${pedidoId}', this.value)">
                <option value="Pendiente Pago" ${estadoActual === 'Pendiente Pago' ? 'selected' : ''}>Pendiente Pago</option>
                <option value="En Camino" ${estadoActual === 'En Camino' ? 'selected' : ''}>En Camino</option>
                <option value="Entregado" ${estadoActual === 'Entregado' ? 'selected' : ''}>Entregado</option>
                <option value="Finalizado" ${estadoActual === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
            </select>
            </div>
        </td>
    `;

    tableBody.appendChild(row);
}

function actualizarEstadoPedido(usuarioId, pedidoId, nuevoEstado) {
    const database = firebase.database();
    const estadoActualRef = database.ref(`usuarios/${usuarioId}/Productos`);

    return estadoActualRef.once('value')
        .then(snapshot => {
            const estados = snapshot.val();
            if (!estados) {
                throw new Error(`No se encontraron estados para el pedido ${pedidoId}.`);
            }

            // Buscamos el estado actual del pedido
            let estadoActual;
            for (const estado in estados) {
                if (estados[estado] && estados[estado][pedidoId]) {
                    estadoActual = estado;
                    break;
                }
            }

            if (!estadoActual) {
                throw new Error(`No se encontró el estado actual del pedido ${pedidoId}.`);
            }

            // Verificamos si el estado actual es igual al nuevo estado
            if (estadoActual === nuevoEstado) {
                throw new Error(`El pedido ya está en el estado ${nuevoEstado}.`);
            }

            // Si el nuevo estado es "Finalizado", eliminamos directamente el pedido
            if (nuevoEstado === "Finalizado") {
                return database.ref(`usuarios/${usuarioId}/Productos/${estadoActual}/${pedidoId}`).remove().then(() => {
                    document.getElementById(`pedido-${pedidoId}`).remove(); // Eliminar la fila de la tabla
                });
            } else {
                // Si no, movemos el pedido al nuevo estado y lo eliminamos del estado anterior
                const pedidoRef = database.ref(`usuarios/${usuarioId}/Productos/${nuevoEstado}/${pedidoId}`);
                const promiseSet = pedidoRef.set(estados[estadoActual][pedidoId]);
                const promiseRemove = database.ref(`usuarios/${usuarioId}/Productos/${estadoActual}/${pedidoId}`).remove();
                return Promise.all([promiseSet, promiseRemove]);
            }
        })
        .then(() => {
            console.log(`Pedido ${pedidoId} movido a ${nuevoEstado}.`);
            return true; // Indicar que la actualización fue exitosa
        })
        .catch(error => {
            console.error(`Error al mover el pedido ${pedidoId} a ${nuevoEstado}:`, error);
            return false; // Indicar que ocurrió un error durante la actualización
        });
}

function gestionarSeleccion(usuarioId, pedidoId, nuevoEstado) {
    actualizarEstadoPedido(usuarioId, pedidoId, nuevoEstado)
        .then(actualizacionExitosa => {
            if (actualizacionExitosa) {
                // Recargar la página para actualizar la tabla
                window.location.reload();
            } else {
                // Manejar caso de actualización fallida si es necesario
            }
        })
        .catch(error => {
            console.error("Error al gestionar el pedido:", error);
        });
}
