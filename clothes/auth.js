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

/// Función para agregar el usuario a la base de datos
function agregarUsuarioALaBaseDeDatos(user) {
    const database = firebase.database();
    const userRef = database.ref('usuarios/' + user.uid);

    const fechaCreacion = new Date().toISOString(); // Obtener la fecha de creación actual
    userRef.once('value')
    .then((snapshot) => {
        if (!snapshot.exists()) {
            // Si el usuario no existe en la base de datos, agregarlo
            userRef.set({
                Name: user.displayName,
                Email: user.email,
                Rol: 'cliente', // Asignar el rol de cliente
                Productos: {
                    Seleccionados: null,
                    Pendiente: null, // Inicializar Pendiente como nulo
                    Aprobado: null   // Inicializar Aprobado como nulo
                },
                FechaCreacion: fechaCreacion // Agregar la fecha de creación actual
            })
            .then(() => {
                console.log("Usuario agregado a la base de datos con el rol de cliente.");
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
        agregarUsuarioALaBaseDeDatos(usuario);
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
        document.getElementById('user-info').innerText = user.displayName || 'Nombre no disponible';
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('sign-out').style.display = 'block';
        document.getElementById('login').style.display = 'none'; // Oculta el botón de inicio de sesión
        hideLogin();
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



document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('login-modal');

    if (loginModal) {
        // El modal está presente en la página, puedes agregar cualquier lógica adicional aquí si es necesario
    }
});



function mostrarDatos(usuario) {
    const chaquetasRef = database.ref('Chaquetas');
    const camisetasRef = database.ref('Camisetas'); // Referencia para camisetas
    const userId = usuario.uid;
    const opcionesRef = database.ref('usuarios/' + userId + '/Productos/Seleccionados');

    // Obtener las categorías desde la ruta 'Chaquetas' y 'Camisetas' en la base de datos
    chaquetasRef.once('value')
        .then(chaquetasSnapshot => {
            const chaquetas = chaquetasSnapshot.val();
            if (!chaquetas) {
                console.log("No se encontraron chaquetas en la base de datos.");
                return;
            }

            camisetasRef.once('value').then(camisetasSnapshot => {
                const camisetas = camisetasSnapshot.val();
                if (!camisetas) {
                    console.log("No se encontraron camisetas en la base de datos.");
                    return;
                }

                // Obtener los datos específicos del usuario
                return opcionesRef.once('value').then(snapshot => {
                    const datos = snapshot.val();
                    const datosContainer = document.getElementById('datos-container');
                    if (!datosContainer) {
                        //console.log("El elemento 'datos-container' no se encontró en el documento.");
                        return;
                    }

                    datosContainer.innerHTML = ''; // Limpiar el contenedor

                    // Inicio Chaquetas
                    // Crear tabla para el contador de chaquetas
                    const chaquetasTabla = document.createElement('table');
                    chaquetasTabla.classList.add('chaquetas-table');

                    // Crear fila para el contador de chaquetas
                    const chaquetasCountRow = document.createElement('tr');
                    const chaquetasCountCell = document.createElement('td');
                    chaquetasCountCell.textContent = 'Número de Chaquetas';
                    chaquetasCountRow.appendChild(chaquetasCountCell);
                    const chaquetasCountValueCell = document.createElement('td');
                    chaquetasCountValueCell.textContent = Object.keys(datos && datos["Chaquetas"] || {}).length;
                    chaquetasCountRow.appendChild(chaquetasCountValueCell);
                    chaquetasTabla.appendChild(chaquetasCountRow);

                    // Agregar tabla del contador de chaquetas al contenedor
                    datosContainer.appendChild(chaquetasTabla);

                    // Crear tabla para las opciones guardadas de chaquetas
                    const opcionesChaquetasTabla = document.createElement('table');
                    opcionesChaquetasTabla.classList.add('opciones-table');

                    // Crear fila de categorías de chaquetas
                    const categoriasChaquetasRow = document.createElement('tr');
                    categoriasChaquetasRow.classList.add('categorias-row'); // Agregar clase a la fila de categorías

                    // Iterar sobre las categorías obtenidas desde 'Chaquetas'
                    Object.keys(chaquetas).forEach(categoria => {
                        // Crear celda para categoría
                        const categoriaCell = document.createElement('td');
                        categoriaCell.textContent = categoria;
                        categoriasChaquetasRow.appendChild(categoriaCell);
                    });

                    // Agregar fila de categorías a la tabla de chaquetas
                    opcionesChaquetasTabla.appendChild(categoriasChaquetasRow);

                    // Iterar sobre las chaquetas guardadas del usuario
                    Object.entries(datos && datos["Chaquetas"] || {}).forEach(([nombre, opciones]) => {
                        // Crear fila para chaqueta
                        const chaquetaRow = document.createElement('tr');
                        chaquetaRow.classList.add('chaqueta-row'); // Agregar clase a la fila de chaqueta

                        // Iterar sobre las categorías para mantener el orden
                        Object.keys(chaquetas).forEach(categoria => {
                            // Crear celda para opción
                            const opcionCell = document.createElement('td');
                            // Mostrar "N/A" si la opción está vacía
                            const valor = opciones[categoria] || "N/A";
                            opcionCell.textContent = valor;
                            chaquetaRow.appendChild(opcionCell);
                        });

                        // Agregar fila de chaqueta a la tabla de chaquetas
                        opcionesChaquetasTabla.appendChild(chaquetaRow);
                    });

                    // Agregar tabla de opciones de chaquetas al contenedor
                    datosContainer.appendChild(opcionesChaquetasTabla);

                    // Fin Chaquetas

                    // Inicio Camisetas
                    // Crear tabla para el contador de camisetas
                    const camisetasTabla = document.createElement('table');
                    camisetasTabla.classList.add('camisetas-table');

                    // Crear fila para el contador de camisetas
                    const camisetasCountRow = document.createElement('tr');
                    const camisetasCountCell = document.createElement('td');
                    camisetasCountCell.textContent = 'Número de Camisetas';
                    camisetasCountRow.appendChild(camisetasCountCell);
                    const camisetasCountValueCell = document.createElement('td');
                    camisetasCountValueCell.textContent = Object.keys(datos && datos["Camisetas"] || {}).length;
                    camisetasCountRow.appendChild(camisetasCountValueCell);
                    camisetasTabla.appendChild(camisetasCountRow);

                    // Agregar tabla del contador de camisetas al contenedor
                    datosContainer.appendChild(camisetasTabla);

                    // Crear tabla para las opciones guardadas de camisetas
                    const opcionesCamisetasTabla = document.createElement('table');
                    opcionesCamisetasTabla.classList.add('opciones-table2');

                    // Crear fila de categorías de camisetas
                    const categoriasCamisetasRow = document.createElement('tr');
                    categoriasCamisetasRow.classList.add('categorias-row'); // Agregar clase a la fila de categorías

                    // Iterar sobre las categorías obtenidas desde 'Camisetas'
                    Object.keys(camisetas).forEach(categoria => {
                        // Crear celda para categoría
                        const categoriaCell = document.createElement('td');
                        categoriaCell.textContent = categoria;
                        categoriasCamisetasRow.appendChild(categoriaCell);
                    });

                    // Agregar fila de categorías a la tabla de camisetas
                    opcionesCamisetasTabla.appendChild(categoriasCamisetasRow);

                    // Iterar sobre las camisetas guardadas del usuario
                    Object.entries(datos && datos["Camisetas"] || {}).forEach(([nombre, opciones]) => {
                        // Crear fila para camiseta
                        const camisetaRow = document.createElement('tr');
                        camisetaRow.classList.add('camiseta-row'); // Agregar clase a la fila de camiseta

                        // Iterar sobre las categorías para mantener el orden
                        Object.keys(camisetas).forEach(categoria => {
                            // Crear celda para opción
                            const opcionCell = document.createElement('td');
                            // Mostrar "N/A" si la opción está vacía
                            const valor = opciones[categoria] || "N/A";
                            opcionCell.textContent = valor;
                            camisetaRow.appendChild(opcionCell);
                        });

                        // Agregar fila de camiseta a la tabla de camisetas
                        opcionesCamisetasTabla.appendChild(camisetaRow);
                    });

                    // Agregar tabla de opciones de camisetas al contenedor
                    datosContainer.appendChild(opcionesCamisetasTabla);

                    // Fin Camisetas

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
                    const chaquetasCostoTotal = Object.keys(datos && datos["Chaquetas"] || {}).length * 80000;
                    const camisetasCostoTotal = Object.keys(datos && datos["Camisetas"] || {}).length * 50000; // Supuesto costo de cada camiseta
                    const formattedCostoTotal = '$ ' + Intl.NumberFormat('es-ES').format(chaquetasCostoTotal + camisetasCostoTotal);
                    totalValueCell.textContent = formattedCostoTotal;
                    totalRow.appendChild(totalValueCell);

                    // Agregar fila de total a la tabla adicional
                    totalTabla.appendChild(totalRow);

                    // Agregar tabla adicional al contenedor
                    datosContainer.appendChild(totalTabla);
                });
            }).catch(error => {
                console.error("Error al obtener los datos de camisetas desde la base de datos:", error);
            });
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


// Función para obtener el rol del usuario
function obtenerRolUsuario() {
    const usuario = firebase.auth().currentUser;

    if (usuario) {
        const database = firebase.database();
        const userRef = database.ref('usuarios/' + usuario.uid);

        userRef.once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const rol = snapshot.val().Rol;
                    // Redirigir según el rol del usuario
                    if (rol === 'cliente') {
                        window.location.href = 'profile.html';
                    } else if (rol === 'vendedor') {
                        window.location.href = 'adminshop.html';
                    } else {
                        console.log("Rol no reconocido:", rol);
                    }
                } else {
                    console.log("El usuario no existe en la base de datos.");
                }
            })
            .catch((error) => {
                console.error("Error al obtener el rol del usuario:", error);
            });
    } else {
        console.log("Usuario no autenticado.");
    }
}


// Esperar a que el DOM se cargue completamente antes de añadir el evento click
document.addEventListener('DOMContentLoaded', function() {
    // Evento click para el perfil
    document.getElementById('user-info').addEventListener('click', obtenerRolUsuario);
});


