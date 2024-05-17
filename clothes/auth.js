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

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener referencia a la base de datos
const database = firebase.database();

// Obtener el usuario actualmente autenticado
const usuario = firebase.auth().currentUser;

// Configurar la persistencia de Firebase Authentication
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
.then(() => {
    // La persistencia se configuró correctamente
    console.log("Persistencia de autenticación configurada correctamente.");
})
.catch((error) => {
    // Error al configurar la persistencia
    console.error("Error al configurar la persistencia de autenticación:", error);
});

// Función para iniciar sesión con Google
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .catch((error) => {
        console.error(error);
    });
}

// Función para agregar el usuario a la base de datos
function agregarUsuarioALaBaseDeDatos(user) {
    const database = firebase.database();
    const userRef = database.ref('usuarios/' + user.uid);

    userRef.once('value')
    .then((snapshot) => {
        if (!snapshot.exists()) {
            // Si el usuario no existe en la base de datos, agregarlo
            userRef.set({
                displayName: user.displayName,
                email: user.email,
                opcionesGuardadas: {} // Inicializar con un objeto vacío
            })
            .then(() => {
                console.log("Usuario agregado a la base de datos.");
            })
            .catch((error) => {
                console.error("Error al agregar el usuario a la base de datos:", error);
            });
        } else {
            console.log("El usuario ya existe en la base de datos.");
        }
    })
    .catch((error) => {
        console.error("Error al verificar la existencia del usuario:", error);
    });
}

// Verificar el estado de autenticación al cargar la página
firebase.auth().onAuthStateChanged((usuario) => {
    if (usuario) {
        // El usuario está autenticado, obtén y muestra los datos
        mostrarDatos(usuario);
        displayUserInfo(usuario);
    } else {
        // El usuario no está autenticado, limpia los datos de la tabla
        limpiarTabla();
        displayUserInfo(null); // Llama a displayUserInfo con null para ocultar la información del usuario
    }
});

// Función para cerrar sesión
function signOut() {
    firebase.auth().signOut().then(() => {
        // El usuario ha cerrado sesión correctamente
    }).catch((error) => {
        console.error(error);
    });
}

// Función para mostrar la información del usuario
function displayUserInfo(user) {
    if (user) {
        document.getElementById('user-info').innerText = `${user.displayName}`;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('sign-out').style.display = 'block';
        document.getElementById('login').style.display = 'none'; // Oculta el botón de inicio de sesión
        hideLogin(); // Oculta el botón de inicio de sesión flotante
    } else {
        // El usuario no está autenticado, oculta la información del usuario y muestra el botón de inicio de sesión
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('sign-out').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    }
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

            // Crear tabla para el contador de chaquetas
            const chaquetasTabla = document.createElement('table');
            chaquetasTabla.classList.add('chaquetas-table');

            // Crear fila para el contador de chaquetas
            const chaquetasCountRow = document.createElement('tr');
            const chaquetasCountCell = document.createElement('td');
            chaquetasCountCell.textContent = 'Número de Chaquetas';
            chaquetasCountRow.appendChild(chaquetasCountCell);
            const chaquetasCountValueCell = document.createElement('td');
            chaquetasCountValueCell.textContent = Object.keys(datos["Chaquetas"]).length;
            chaquetasCountRow.appendChild(chaquetasCountValueCell);
            chaquetasTabla.appendChild(chaquetasCountRow);

            // Agregar tabla del contador de chaquetas al contenedor
            datosContainer.appendChild(chaquetasTabla);

            // Crear tabla para las opciones guardadas
            const opcionesTabla = document.createElement('table');
            opcionesTabla.classList.add('opciones-table');

            // Crear fila de categorías
            const categoriasRow = document.createElement('tr');
            categoriasRow.classList.add('categorias-row'); // Agregar clase a la fila de categorías

            // Obtener las categorías de la primera chaqueta
            const primerChaqueta = Object.values(datos["Chaquetas"])[0];
            Object.keys(primerChaqueta).forEach(categoria => {
                // Crear celda para categoría
                const categoriaCell = document.createElement('td');
                categoriaCell.textContent = categoria;
                categoriasRow.appendChild(categoriaCell);
            });

            // Agregar fila de categorías a la tabla
            opcionesTabla.appendChild(categoriasRow);

            // Iterar sobre las chaquetas guardadas
            Object.entries(datos["Chaquetas"]).forEach(([nombre, opciones]) => {
                // Crear fila para chaqueta
                const chaquetaRow = document.createElement('tr');
                chaquetaRow.classList.add('chaqueta-row'); // Agregar clase a la fila de chaqueta

                // Iterar sobre las opciones y categorías
                Object.values(opciones).forEach(valor => {
                    // Crear celda para opción
                    const opcionCell = document.createElement('td');
                    // Mostrar "N/A" si la opción está vacía
                    opcionCell.textContent = valor === "" ? "N/A" : valor;
                    chaquetaRow.appendChild(opcionCell);
                });

                // Agregar fila de chaqueta a la tabla
                opcionesTabla.appendChild(chaquetaRow);
            });

            // Agregar tabla de opciones al contenedor
            datosContainer.appendChild(opcionesTabla);

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
            const formattedCostoTotal = '$ ' + Intl.NumberFormat('es-ES').format(Object.keys(datos["Chaquetas"]).length * 80000); // Multiplicar el número de chaquetas por el costo de cada una
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
