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
let isUserAuthenticated = false;

// Verificar el estado de autenticación al cargar la página
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // El usuario está autenticado
        isUserAuthenticated = true;
        displayUserInfo(user);
    } else {
        // El usuario no está autenticado
        isUserAuthenticated = false;
        // Puedes hacer cualquier acción necesaria aquí
    }
});



// Función modal
firebase.auth().onAuthStateChanged(function(user) {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) { // Verifica si el modal está en el DOM
        if (user) {
            displayUserInfo(user);
            loginModal.style.display = 'none'; // Ocultar el modal si el usuario está autenticado
        } else {
            loginModal.style.display = 'block'; // Mostrar el modal si el usuario no está autenticado
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('login-modal');

    if (loginModal) {
        // El modal está presente en la página, puedes agregar cualquier lógica adicional aquí si es necesario
    }
});




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

    opcionesRef.once('value')
        .then(snapshot => {
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
            const primerOpciones = Object.values(datos)[0];
            Object.keys(primerOpciones).forEach(categoria => {
                // Crear celda para categoría
                const categoriaCell = document.createElement('td');
                categoriaCell.textContent = categoria;
                categoriasRow.appendChild(categoriaCell);
            });

            // Agregar fila de categorías a la tabla
            tabla.appendChild(categoriasRow);

            // Inicializar el costo total
            let costoTotal = 0;

            // Iterar sobre los datos
            Object.values(datos).forEach(opciones => {
                // Crear fila para opciones
                const opcionesRow = document.createElement('tr');
                opcionesRow.classList.add('opciones-row'); // Agregar clase a la fila de opciones

// Iterar sobre las opciones y categorías
Object.entries(opciones).forEach(([key, value]) => {
    // Crear celda para opción
    const opcionCell = document.createElement('td');
    // Si la opción está vacía
    if (value === '') {
        // Si la categoría es "color", mostrar "blanco"
        if (key === 'color') {
            opcionCell.textContent = 'blanco';
        } else {
            opcionCell.textContent = 'N/A';
        }
    } else {
        opcionCell.textContent = value; // Mostrar el valor normalmente
    }
    opcionesRow.appendChild(opcionCell);
});


                // Agregar fila de opciones a la tabla
                tabla.appendChild(opcionesRow);

                // Agregar el costo de este grupo de opciones al costo total
                costoTotal += 80000; // Cada grupo de opciones tiene un costo de 80000
            });

            // Agregar tabla al contenedor
            datosContainer.appendChild(tabla);

            // Crear tabla adicional para mostrar el costo total
            const totalTabla = document.createElement('table');
            totalTabla.classList.add('total-table');

            // Crear fila para el total
            const totalRow = document.createElement('tr');

            // Crear celda para la etiqueta 'Total'
            const totalLabelCell = document.createElement('td');
            totalLabelCell.textContent = 'Total';
            totalRow.appendChild(totalLabelCell);

            // Crear celda para el valor del costo total
            const totalValueCell = document.createElement('td');
            // Formatear el valor del costo total
            const formattedCostoTotal = '$ ' + Intl.NumberFormat('es-ES').format(costoTotal);
            totalValueCell.textContent = formattedCostoTotal;
            totalRow.appendChild(totalValueCell);

            // Agregar fila de total a la tabla adicional
            totalTabla.appendChild(totalRow);

            // Agregar tabla adicional al contenedor
            datosContainer.appendChild(totalTabla);
        })
        .catch(error => {
            console.error("Error al obtener los datos desde la base de datos:", error);
        });
}





function limpiarTabla() {
    const datosContainer = document.getElementById('datos-container');
    if (datosContainer) {
        datosContainer.innerHTML = ''; // Limpiar el contenedor
    }
}
