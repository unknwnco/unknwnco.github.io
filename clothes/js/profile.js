
// Función para mostrar la información del usuario

    // Función para mostrar información del usuario
    function displayUserInfo(user) {
        if (user) {
            document.getElementById('user-info').innerText = user.displayName || 'Nombre no disponible';
            document.getElementById('user-name').innerText = user.displayName || 'Nombre no disponible';
            document.getElementById('user-mail').innerText = user.email;
            if (user.photoURL) {
                document.getElementById('user-photo').src = user.photoURL;
                document.getElementById('user-photo').style.display = 'block';
            } else {
                document.getElementById('user-photo').style.display = 'none';
            }
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('user-name').style.display = 'block';
            document.getElementById('user-mail').style.display = 'block';
            document.getElementById('sign-out').style.display = 'block';
            document.getElementById('login').style.display = 'none'; // Oculta el botón de inicio de sesión
        } else {
            // El usuario no está autenticado, oculta la información del usuario y muestra el botón de inicio de sesión
            document.getElementById('user-info').style.display = 'none';
            document.getElementById('user-name').style.display = 'none';
            document.getElementById('user-mail').style.display = 'none';
            document.getElementById('user-photo').style.display = 'none';
            document.getElementById('sign-out').style.display = 'none';
            document.getElementById('login').style.display = 'block';
        }
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

                if (userRol === 'cliente') {
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
    const usuarioActualId = firebase.auth().currentUser.uid; // Obtener el ID del usuario actual

    const usuarioRef = database.ref(`usuarios/${usuarioActualId}`);
    usuarioRef.once('value')
        .then(snapshot => {
            const usuario = snapshot.val();
            if (!usuario) {
                console.error('No se encontró información para el usuario actual.');
                return;
            }
            
            const productos = usuario.Productos;
            if (productos) {
                for (const estado in productos) {
                    if (estado !== 'Seleccionados' && estado !== 'contadorPedidos' && estado !== 'Rol') {
                        for (const pedidoId in productos[estado]) {
                            const pedido = productos[estado][pedidoId];
                            pedidoUsuarioMap.set(pedidoId, { usuarioId: usuarioActualId, estado });
                            agregarPedidoATabla(usuarioActualId, usuario.Name, usuario.Email, pedidoId, estado);
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error("Error al cargar los pedidos del usuario actual:", error);
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

    let estadoClass = '';
    switch (estadoActual) {
        case 'Pendiente Pago':
            estadoClass = 'estado-pendiente';
            break;
        case 'En Camino':
            estadoClass = 'estado-enviado';
            break;
        case 'Entregado':
            estadoClass = 'estado-entregado';
            break;
        case 'Finalizado':
            estadoClass = 'estado-finalizado';
            break;
        default:
            estadoClass = '';
    }

    row.innerHTML = `
        <td><span class="pedido-link" onclick="loadOrder('${pedidoId}')">${pedidoId}</span></td>
        <td>${nombre}</td>
        <td>${email}</td>
        <td class="${estadoClass}">${estadoActual}</td>
    `;

    tableBody.appendChild(row);
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
            document.getElementById('contenido3').classList.remove('active');
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


