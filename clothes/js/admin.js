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
                                pedidoUsuarioMap.set(pedidoId, { usuarioId, estado });
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
        <td><span class="pedido-link" onclick="loadOrder('${pedidoId}')">${pedidoId}</span></td>
        <td>${nombre}</td>
        <td>${email}</td>
        <td>
        <div class="status-container">
            <select class="multi-selector" onchange="actualizarEstadoPedido('${usuarioId}', '${pedidoId}', this.value)">
                <option value="PendientePago" ${estadoActual === 'Pendiente Pago' ? 'selected' : ''}>Pendiente Pago</option>
                <option value="EnCamino" ${estadoActual === 'En Camino' ? 'selected' : ''}>En Camino</option>
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

const pedidoUsuarioMap = new Map();
        // Nueva función para cargar los detalles del pedido
// Función para cargar los detalles del pedido
function loadOrder(pedidoId) {
    const database = firebase.database();
    const pedidoInfo = pedidoUsuarioMap.get(pedidoId);
    if (!pedidoInfo) {
        console.error(`No se encontró información para el pedido ${pedidoId}`);
        return;
    }
    const { usuarioId, estado } = pedidoInfo;
    const pedidoRef = database.ref(`usuarios/${usuarioId}/Productos/${estado}/${pedidoId}/Chaquetas`);
    //console.log(`Intentando cargar los detalles del pedido desde la ruta: usuarios/${usuarioId}/Productos/${estado}/${pedidoId}/Chaquetas`);

    pedidoRef.once('value')
        .then(snapshot => {
            const chaquetaData = snapshot.val();
            console.log(`Datos de chaquetas cargados para el pedido ${pedidoId}:`, chaquetaData);
            const tableOrder = document.getElementById('table-order');
            if (!tableOrder) {
                console.error('No se encontró el elemento table-order.');
                return;
            }

            // Llenar tabla para el contador de chaquetas
            const chaquetasTabla = tableOrder.querySelector('.chaquetas-table');
            chaquetasTabla.innerHTML = `
                <tr>
                    <td>Número de Chaquetas</td>
                    <td>${chaquetaData ? Object.keys(chaquetaData).length : 0}</td>
                </tr>
            `;

            // Obtener y mostrar las categorías
            const opcionesTabla = tableOrder.querySelector('.opciones-table');
            const categoriasRef = database.ref('Chaquetas');
            categoriasRef.once('value')
                .then(categoriasSnapshot => {
                    const categorias = categoriasSnapshot.val();
                    if (!categorias) {
                        console.error('No se encontraron categorías en la base de datos.');
                        return;
                    }

                    // Crear fila de categorías
                    const categoriasRow = document.createElement('tr');
                    categoriasRow.classList.add('categorias-row');
                    Object.keys(categorias).forEach(categoria => {
                        const categoriaCell = document.createElement('td');
                        categoriaCell.textContent = categoria;
                        categoriasRow.appendChild(categoriaCell);
                    });
                    opcionesTabla.innerHTML = ''; // Limpiar la tabla antes de llenarla con datos
                    opcionesTabla.appendChild(categoriasRow);

                    // Llenar la tabla con las opciones guardadas
                    if (chaquetaData) {
                        Object.entries(chaquetaData).forEach(([nombre, opciones]) => {
                            const chaquetaRow = document.createElement('tr');
                            Object.keys(categorias).forEach(categoria => {
                                const opcionCell = document.createElement('td');
                                const valor = opciones[categoria] || "N/A";
                                opcionCell.textContent = valor;
                                chaquetaRow.appendChild(opcionCell);
                            });
                            opcionesTabla.appendChild(chaquetaRow);
                        });
                    }
                })
                .catch(error => {
                    console.error("Error al obtener las categorías desde la base de datos:", error);
                });

            // Llenar tabla adicional para mostrar el costo total
            const totalTabla = tableOrder.querySelector('.total-table');
            totalTabla.innerHTML = `
                <tr>
                    <td>Total</td>
                    <td>$ ${chaquetaData ? Object.keys(chaquetaData).length * 80000 : 0}</td>
                </tr>
            `;
            setTimeout(function() {
            // Cambiar la clase "active"
            document.getElementById('contenido4').classList.remove('active');
            document.getElementById('contenido2').classList.add('active');
            }, 100);

        })
        .catch(error => {
            console.error("Error al obtener los datos de chaqueta desde la base de datos:", error);
        });
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Crear las tablas vacías y agregarlas al contenedor table-order
    const tableOrder = document.getElementById('table-order');
    if (!tableOrder) {
        console.error('No se encontró el elemento table-order.');
        return;
    }

    // Crear tabla para el contador de chaquetas
    const chaquetasTabla = document.createElement('table');
    chaquetasTabla.classList.add('chaquetas-table');
    chaquetasTabla.innerHTML = `
        <tr>
            <td>Número de Chaquetas</td>
            <td></td>
        </tr>
    `;
    tableOrder.appendChild(chaquetasTabla);

    // Crear tabla para las opciones guardadas
    const opcionesTabla = document.createElement('table');
    opcionesTabla.classList.add('opciones-table');
    opcionesTabla.innerHTML = `
        <tr class="categorias-row">
            <td>Cargando categorías...</td>
        </tr>
    `;
    tableOrder.appendChild(opcionesTabla);

    // Crear tabla adicional para mostrar el costo total
    const totalTabla = document.createElement('table');
    totalTabla.classList.add('total-table');
    totalTabla.innerHTML = `
        <tr>
            <td>Total</td>
            <td></td>
        </tr>
    `;
    tableOrder.appendChild(totalTabla);

    // Cargar las categorías desde la raíz de la base de datos
    const categoriasRef = firebase.database().ref('Chaquetas');
    categoriasRef.once('value')
        .then(snapshot => {
            const categorias = snapshot.val();
            if (!categorias) {
                console.error('No se encontraron categorías en la base de datos.');
                return;
            }
            const categoriasRow = tableOrder.querySelector('.categorias-row');
            categoriasRow.innerHTML = ''; // Limpiar la fila de categorías
            Object.keys(categorias).forEach(categoria => {
                const categoriaCell = document.createElement('td');
                categoriaCell.textContent = categoria;
                categoriasRow.appendChild(categoriaCell);
            });
        })
        .catch(error => {
            console.error("Error al obtener las categorías desde la base de datos:", error);
        });
});
