
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

    const cargarDetallesPedido = (ref, tipo, costoUnitario, opcionesTablaClase, tableOrder, categoriasRef) => {
        return ref.once('value')
            .then(snapshot => {
                const data = snapshot.val();
                console.log(`Datos de ${tipo} cargados para el pedido ${pedidoId}:`, data);
                const tabla = tableOrder.querySelector(`.${tipo.toLowerCase()}-table`);
                tabla.innerHTML = `
                    <tr>
                        <td>Número de ${tipo}</td>
                        <td>${data ? Object.keys(data).length : 0}</td>
                    </tr>
                `;

                const opcionesTabla = tableOrder.querySelector(`.${opcionesTablaClase}`);
                return categoriasRef.once('value')
                    .then(categoriasSnapshot => {
                        const categorias = categoriasSnapshot.val();
                        if (!categorias) {
                            console.error('No se encontraron categorías en la base de datos.');
                            return { data, total: 0 };
                        }

                        const categoriasRow = document.createElement('tr');
                        categoriasRow.classList.add('categorias-row');
                        Object.keys(categorias).forEach(categoria => {
                            const categoriaCell = document.createElement('td');
                            categoriaCell.textContent = categoria;
                            categoriasRow.appendChild(categoriaCell);
                        });
                        opcionesTabla.innerHTML = ''; 
                        opcionesTabla.appendChild(categoriasRow);

                        if (data) {
                            Object.entries(data).forEach(([nombre, opciones]) => {
                                const itemRow = document.createElement('tr');
                                Object.keys(categorias).forEach(categoria => {
                                    const opcionCell = document.createElement('td');
                                    const valor = opciones[categoria] || "N/A";
                                    opcionCell.textContent = valor;
                                    itemRow.appendChild(opcionCell);
                                });
                                opcionesTabla.appendChild(itemRow);
                            });
                        }

                        return { data, total: data ? Object.keys(data).length * costoUnitario : 0 };
                    });
            });
    };

    const tableOrder = document.getElementById('table-order');
    if (!tableOrder) {
        console.error('No se encontró el elemento table-order.');
        return;
    }

    const pedidoRefChaquetas = database.ref(`usuarios/${usuarioId}/Productos/${estado}/${pedidoId}/Chaquetas`);
    const pedidoRefCamisetas = database.ref(`usuarios/${usuarioId}/Productos/${estado}/${pedidoId}/Camisetas`);

    const categoriasRefChaquetas = database.ref('Chaquetas');
    const categoriasRefCamisetas = database.ref('Camisetas');

    Promise.all([
        cargarDetallesPedido(pedidoRefChaquetas, 'Chaquetas', 80000, 'opciones-table', tableOrder, categoriasRefChaquetas),
        cargarDetallesPedido(pedidoRefCamisetas, 'Camisetas', 50000, 'opciones-table2', tableOrder, categoriasRefCamisetas)
    ]).then(results => {
        const total = results.reduce((acc, result) => acc + result.total, 0);
        const totalTabla = tableOrder.querySelector('.total-table');
        totalTabla.innerHTML = `
            <tr>
                <td>Total</td>
                <td>$ ${total}</td>
            </tr>
        `;

        setTimeout(function() {
            document.getElementById('contenido3').classList.remove('active');
            document.getElementById('contenido2').classList.add('active');
        }, 100);

    }).catch(error => {
        console.error("Error al obtener los datos del pedido desde la base de datos:", error);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const tableOrder = document.getElementById('table-order');
    if (!tableOrder) {
        console.error('No se encontró el elemento table-order.');
        return;
    }

    const crearTabla = (tipo, opcionesTablaClase) => {
        const tabla = document.createElement('table');
        tabla.classList.add(`${tipo.toLowerCase()}-table`);
        tabla.innerHTML = `
            <tr>
                <td>Número de ${tipo}</td>
                <td></td>
            </tr>
        `;
        tableOrder.appendChild(tabla);

        const opcionesTabla = document.createElement('table');
        opcionesTabla.classList.add(opcionesTablaClase);
        opcionesTabla.innerHTML = `
            <tr class="categorias-row">
                <td>Cargando categorías...</td>
            </tr>
        `;
        tableOrder.appendChild(opcionesTabla);
    };

    crearTabla('Chaquetas', 'opciones-table');
    crearTabla('Camisetas', 'opciones-table2');

    const totalTabla = document.createElement('table');
    totalTabla.classList.add('total-table');
    totalTabla.innerHTML = `
        <tr>
            <td>Total</td>
            <td></td>
        </tr>
    `;
    tableOrder.appendChild(totalTabla);

    const cargarCategorias = (ref, opcionesTablaClase) => {
        ref.once('value')
            .then(snapshot => {
                const categorias = snapshot.val();
                if (!categorias) {
                    console.error(`No se encontraron categorías en la base de datos.`);
                    return;
                }
                const categoriasRow = tableOrder.querySelector(`.${opcionesTablaClase} .categorias-row`);
                categoriasRow.innerHTML = '';
                Object.keys(categorias).forEach(categoria => {
                    const categoriaCell = document.createElement('td');
                    categoriaCell.textContent = categoria;
                    categoriasRow.appendChild(categoriaCell);
                });
            })
            .catch(error => {
                console.error(`Error al obtener las categorías desde la base de datos:`, error);
            });
    };

    cargarCategorias(firebase.database().ref('Chaquetas'), 'opciones-table');
    cargarCategorias(firebase.database().ref('Camisetas'), 'opciones-table2');
});




