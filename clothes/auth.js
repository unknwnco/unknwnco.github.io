// auth.js

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCjaTHggxSfdGVWf4QFyOlGEDEsH2dUIgk",
    authDomain: "unknwnclothes.firebaseapp.com",
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





