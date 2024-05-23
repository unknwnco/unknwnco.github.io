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

// Función para cargar y mostrar los usuarios pendientes de pago y en camino
function loadUsersPending() {
    const database = firebase.database();
    const usuario = firebase.auth().currentUser;

    if (usuario) {
        const userRef = database.ref(`usuarios/${usuario.uid}`);
        const pendientePagoRef = userRef.child('Productos/PendientePago');
        const enCaminoRef = userRef.child('Productos/EnCamino');
        const entregadoRef = userRef.child('Productos/Entregado');

        Promise.all([getUsers(pendientePagoRef), getUsers(enCaminoRef), getUsers(entregadoRef)])
            .then(([pendientePagoUsers, enCaminoUsers, entregadoUsers]) => {
                // Obtener datos de usuario (Name y Email)
                userRef.once('value').then(snapshot => {
                    const userData = snapshot.val();
                    const name = userData.Name || 'Nombre no disponible';
                    const email = userData.Email || 'Email no disponible';

                    const allUsers = [...pendientePagoUsers, ...enCaminoUsers, ...entregadoUsers];
                    const usersTable = document.getElementById('users-table-pending');
                    usersTable.innerHTML = ''; // Limpiar la tabla antes de cargar los datos

                    allUsers.forEach((user, index) => {
                        const row = document.createElement('tr');
                        const numberCell = document.createElement('td'); // Nueva celda para el número de pedido
                        const nameCell = document.createElement('td');
                        const emailCell = document.createElement('td');
                        const orderIdCell = document.createElement('td'); // Nueva celda para el ID del pedido
                        const statusCell = document.createElement('td'); // Nueva celda para el estado

                        // Utilizar Name y Email del usuario
                        const name = userData.Name || 'Nombre no disponible';
                        const email = userData.Email || 'Email no disponible';

                        // Obtener el ID del pedido
                        const orderId = user.id;

                        // Crear un multiselector
                        const statusSelect = document.createElement('select');
                        statusSelect.multiple = false; // Permitir solo una selección

                        // Opciones del multiselector
                        statusSelect.classList.add('multi-selector');
                        const options = ['PendientePago', 'EnCamino', 'Entregado'];
                        options.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option;
                            optionElement.textContent = option;
                            statusSelect.appendChild(optionElement);
                        });

                        // Establecer el estado seleccionado basado en la lista en la que se encuentra el usuario
                        if (pendientePagoUsers.find(u => u.id === user.id)) {
                            statusSelect.value = 'PendientePago';
                        } else if (enCaminoUsers.find(u => u.id === user.id)) {
                            statusSelect.value = 'EnCamino';
                        } else if (entregadoUsers.find(u => u.id === user.id)) {
                            statusSelect.value = 'Entregado';
                        }

                        // Event listener para detectar cambios en la selección
                        statusSelect.addEventListener('change', function(event) {
                            const selectedStatus = event.target.value;
                            const userId = user.id;

                            switch(selectedStatus) {
                                case 'EnCamino':
                                    // Copiar el usuario a la lista 'EnCamino'
                                    const userRefEnCamino = database.ref(`usuarios/${usuario.uid}/Productos/EnCamino/${userId}`);
                                    userRefEnCamino.set(user);

                                    // Eliminar el usuario de 'PendientePago'
                                    pendientePagoRef.child(userId).remove()
                                        .catch(error => console.error('Error al eliminar usuario de PendientePago:', error));
                                    // Eliminar el usuario de 'Entregado'
                                    entregadoRef.child(userId).remove()
                                        .catch(error => console.error('Error al eliminar usuario de PendientePago:', error));
                                    break;
                                case 'PendientePago':
                                    // Copiar el usuario a la lista 'PendientePago'
                                    const userRefPendientePago = database.ref(`usuarios/${usuario.uid}/Productos/PendientePago/${userId}`);
                                    userRefPendientePago.set(user);

                                    // Eliminar el usuario de 'EnCamino'
                                    enCaminoRef.child(userId).remove()
                                        .catch(error => console.error('Error al eliminar usuario de EnCamino:', error));
                                    // Eliminar el usuario de 'Entregado'
                                    entregadoRef.child(userId).remove()
                                        .catch(error => console.error('Error al eliminar usuario de PendientePago:', error));
                                    break;
                                case 'Entregado':
                                    // Copiar el usuario a la lista 'Entregado'
                                    const userRefEntregado = database.ref(`usuarios/${usuario.uid}/Productos/Entregado/${userId}`);
                                    userRefEntregado.set(user);

                                    // Eliminar el usuario de 'EnCamino' si está allí
                                    enCaminoRef.child(userId).remove()
                                        .catch(error => console.error('Error al eliminar usuario de EnCamino:', error));

                                    // Eliminar el usuario de 'PendientePago' si está allí
                                    pendientePagoRef.child(userId).remove()
                                        .catch(error => console.error('Error al eliminar usuario de PendientePago:', error));
                                    break;
                                default:
                                    break;
                            }
                        });

                        numberCell.textContent = orderId; // Mostrar el ID del pedido
                        nameCell.textContent = name;
                        emailCell.textContent = email;
                        statusCell.appendChild(statusSelect); // Agregar el multiselector a la celda

                        row.appendChild(numberCell); // Agregar la celda del número de pedido
                        row.appendChild(nameCell);
                        row.appendChild(emailCell);
                        row.appendChild(statusCell); // Agregar la nueva celda de estado a la fila

                        usersTable.appendChild(row);
                    });
                }).catch(error => {
                    console.error('Error al obtener los datos del usuario:', error);
                });
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
            });
    } else {
        console.log("Usuario no autenticado. No se pueden cargar los usuarios pendientes.");
    }
}

// Función






// Función para obtener los usuarios de una referencia específica
function getUsers(ref) {
    return ref.once('value').then(snapshot => {
        const users = [];
        snapshot.forEach(childSnapshot => {
            const user = childSnapshot.val();
            // Verificar y asignar valores predeterminados para 'id' y 'status'
            user.id = childSnapshot.key || ''; // Si no hay 'key', asignar una cadena vacía
            user.status = user.status || ''; // Si no hay 'status', asignar una cadena vacía
            users.push(user);
        });
        return users;
    });
}



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
