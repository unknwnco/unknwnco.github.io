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

// Función para obtener usuarios desde una referencia
function getUsers(ref) {
    return ref.once('value').then(snapshot => {
        const users = [];
        snapshot.forEach(childSnapshot => {
            const user = { id: childSnapshot.key, ...childSnapshot.val() };
            users.push(user);
        });
        return users;
    });
}

// Función para cargar y mostrar los usuarios pendientes de pago y en camino
function loadUsersPending() {
    const pendientePagoRef = firebase.database().ref('ProcesoCompra/PendientePago');
    const enCaminoRef = firebase.database().ref('ProcesoCompra/EnCamino');
    const entregadoRef = firebase.database().ref('ProcesoCompra/Entregado');

    Promise.all([getUsers(pendientePagoRef), getUsers(enCaminoRef), getUsers(entregadoRef)])
        .then(([pendientePagoUsers, enCaminoUsers, entregadoUsers]) => {
            const allUsers = [...pendientePagoUsers, ...enCaminoUsers, ...entregadoUsers];
            const usersTable = document.getElementById('users-table-pending');
            usersTable.innerHTML = ''; // Limpiar la tabla antes de cargar los datos

            allUsers.forEach(user => {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                const emailCell = document.createElement('td');
                const statusCell = document.createElement('td'); // Nueva celda para el estado

                // Verificar si Name y Email tienen valores
                const name = user.Name || 'Nombre no disponible';
                const email = user.Email || 'Email no disponible';

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
                    if (option === user.status) {
                        optionElement.selected = true; // Marcar la opción actual del usuario como seleccionada
                    }
                    statusSelect.appendChild(optionElement);
                });

                // Event listener para detectar cambios en la selección
                statusSelect.addEventListener('change', function(event) {
                    const selectedStatus = event.target.value;
                    const userId = user.id;

                    switch(selectedStatus) {
                        case 'EnCamino':
                            // Copiar el usuario a la lista 'EnCamino'
                            const userRef = firebase.database().ref(`ProcesoCompra/EnCamino/${userId}`);
                            userRef.set(user);

                            // Eliminar el usuario de 'PendientePago'
                            pendientePagoRef.child(userId).remove()
                                .catch(error => console.error('Error al eliminar usuario de PendientePago:', error));
                            // Eliminar el usuario de 'Entregado'
                            entregadoRef.child(userId).remove()
                                .catch(error => console.error('Error al eliminar usuario de PendientePago:', error));
                            break;
                        case 'PendientePago':
                            // Copiar el usuario a la lista 'PendientePago'
                            const userRefPendientePago = firebase.database().ref(`ProcesoCompra/PendientePago/${userId}`);
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
                            const userRefEntregado = firebase.database().ref(`ProcesoCompra/Entregado/${userId}`);
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

                nameCell.textContent = name;
                emailCell.textContent = email;
                statusCell.appendChild(statusSelect); // Agregar el multiselector a la celda
                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(statusCell); // Agregar la nueva celda a la fila
                usersTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al obtener los usuarios:', error);
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
