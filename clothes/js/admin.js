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
