// auth.js

// Configuración de Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCjaTHggxSfdGVWf4QFyOlGEDEsH2dUIgk",
    authDomain: "unknwnclothes.firebaseapp.com",
    databaseURL: "https://unknwnclothes-default-rtdb.firebaseio.com",
    projectId: "unknwnclothes",
    storageBucket: "unknwnclothes.appspot.com",
    messagingSenderId: "878618511099",
    appId: "1:878618511099:web:9c60ba1c16fb22297d525e",
    measurementId: "G-V2EPB2X84N"
  };

firebase.initializeApp(firebaseConfig);


// Función para iniciar sesión con Google
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
        // El usuario ha iniciado sesión correctamente
        const user = result.user;
        displayUserInfo(user);
    })
    .catch((error) => {
        console.error(error);
    });
}

// Función para cerrar sesión
function signOut() {
    firebase.auth().signOut().then(() => {
        // El usuario ha cerrado sesión correctamente
        document.getElementById('user-info').style.display = 'none'; // Oculta la información del usuario
        document.getElementById('sign-out').style.display = 'none'; // Oculta el botón de cerrar sesión
        document.getElementById('login').style.display = 'block'; // Muestra el botón de iniciar sesión
        
    }).catch((error) => {
        console.error(error);
    });
}

// Función para mostrar la información del usuario
function displayUserInfo(user) {
    document.getElementById('user-info').innerText = `${user.displayName}`;
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('sign-out').style.display = 'block';
    document.getElementById('login').style.display = 'none'; // Oculta el botón de inicio de sesión
    hideLogin(); // Oculta el botón de inicio de sesión flotante
}

// Variable para controlar el estado del botón de inicio de sesión
let loginButtonVisible = false;

// Función para mostrar u ocultar el botón de inicio de sesión flotante
function toggleLoginButton() {
    const loginButton = document.getElementById('login-button');
    if (loginButtonVisible) {
        loginButton.style.display = 'none'; // Oculta el botón de inicio de sesión
    } else {
        loginButton.style.display = 'block'; // Muestra el botón de inicio de sesión
    }
    loginButtonVisible = !loginButtonVisible; // Cambia el estado del botón
}

// Llama a toggleLoginButton() cada vez que se llama a showLogin()
function showLogin() {
    toggleLoginButton();
}

// Función para ocultar el botón de inicio de sesión flotante
function hideLogin() {
    document.getElementById('login-button').style.display = 'none';
}

// Verificar el estado de autenticación al cargar la página
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // El usuario está autenticado
        displayUserInfo(user);
    } else {
        // El usuario no está autenticado
        // Puedes hacer cualquier acción necesaria aquí
    }
});


// Función para guardar las opciones seleccionadas en la base de datos



// Obtener referencia a la base de datos
const database = firebase.database();

// Obtener el usuario actualmente autenticado
const usuario = firebase.auth().currentUser;


firebase.auth().onAuthStateChanged((usuario) => {
    if (usuario) {
        // El usuario está autenticado, obtén y muestra los datos
        mostrarDatos(usuario);
    } else {
        // El usuario no está autenticado, limpia los datos de la tabla
        limpiarTabla();
    }
});

function mostrarDatos(usuario) {
    const userId = usuario.uid;
    const opcionesRef = database.ref('usuarios/' + userId + '/opcionesGuardadas');

    opcionesRef.on('value', (snapshot) => {
        const datos = snapshot.val();

        if (!datos) {
            console.log("No se encontraron datos en la base de datos.");
            return;
        }

        const datosContainer = document.getElementById('datos-container');
        if (!datosContainer) {
            console.log("El elemento 'datos-container' no se encontró en el documento.");
            return;
        }

        datosContainer.innerHTML = ''; // Limpiar el contenedor

        // Crear tabla
        const tabla = document.createElement('table');
        tabla.classList.add('opciones-table');

        // Crear fila de categorías
        const categoriasRow = document.createElement('tr');
        categoriasRow.classList.add('categorias-row'); // Agregar clase a la fila de categorías

        // Obtener las categorías de la primera fila de datos
        const primerOpiones = Object.values(datos)[0];
        Object.keys(primerOpiones).forEach(categoria => {
            // Crear celda para categoría
            const categoriaCell = document.createElement('td');
            categoriaCell.textContent = categoria;
            categoriasRow.appendChild(categoriaCell);
        });

        // Agregar fila de categorías a la tabla
        tabla.appendChild(categoriasRow);

        // Iterar sobre los datos
        Object.values(datos).forEach(opciones => {
            // Crear fila para opciones
            const opcionesRow = document.createElement('tr');
            opcionesRow.classList.add('opciones-row'); // Agregar clase a la fila de opciones

            // Iterar sobre las opciones y categorías
            Object.values(opciones).forEach(value => {
                // Crear celda para opción
                const opcionCell = document.createElement('td');
                opcionCell.textContent = value;
                opcionesRow.appendChild(opcionCell);
            });

            // Agregar fila de opciones a la tabla
            tabla.appendChild(opcionesRow);
        });

        // Agregar tabla al contenedor
        datosContainer.appendChild(tabla);
    });
}

function limpiarTabla() {
    const datosContainer = document.getElementById('datos-container');
    if (datosContainer) {
        datosContainer.innerHTML = ''; // Limpiar el contenedor
    }
}
