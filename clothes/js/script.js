function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Inicio de sesión exitoso
        var user = userCredential.user;
        document.getElementById('message').innerText = 'Inicio de sesión exitoso.';
    })
    .catch((error) => {
        // Manejo de errores
        var errorMessage = error.message;
        document.getElementById('message').innerText = errorMessage;
    });
}
