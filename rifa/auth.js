// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAo5mpO0hjRQDXvNznrXSLou0ZnyCDCoIU",
  authDomain: "unk-rifa.firebaseapp.com",
  projectId: "unk-rifa",
  storageBucket: "unk-rifa.appspot.com",
  messagingSenderId: "344252901671",
  appId: "1:344252901671:web:6b842209dd6f50fb30e102",
  measurementId: "G-JP914YMLB4"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Función para iniciar sesión con Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
      .catch((error) => {
          console.error("Error al iniciar sesión con Google:", error);
      });
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



// Función para actualizar la lista de participantes en el DOM
async function updateParticipantList() {
  const participantList = document.getElementById('participantList');
  try {
      const snapshot = await database.ref('participants').once('value');
      participantList.innerHTML = '';
      snapshot.forEach(childSnapshot => {
          const participant = childSnapshot.val();
          const li = document.createElement('li');
          li.textContent = `${participant.name} - Número: ${participant.number}`;
          participantList.appendChild(li);
          document.getElementById(`cell-${participant.number}`).classList.add('selected');
      });
  } catch (error) {
      console.error('Error al obtener participantes:', error);
  }
}

// Función para agregar participante a la base de datos si no existe
async function addParticipantToDatabase(participantName, participantNumber) {
  try {
      const participantRef = database.ref('participants/' + participantNumber);
      const snapshot = await participantRef.once('value');
      if (!snapshot.exists()) {
          await participantRef.set({
              name: participantName,
              number: participantNumber
          });
          return true; // Participante agregado correctamente
      } else {
          return false; // Participante con ese número ya existe
      }
  } catch (error) {
      console.error('Error al agregar participante:', error);
      return false;
  }
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




// Función para cerrar sesión
function signOut() {
  firebase.auth().signOut().then(() => {
      // Éxito al cerrar sesión
  }).catch((error) => {
      console.error("Error al cerrar sesión:", error);
  });
}

// Evento para verificar el estado de autenticación al cargar la página
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
      displayUserInfo(user);
      updateParticipantList();
  } else {
      displayUserInfo(null);
  }
});

// Función para obtener el rol del usuario y redirigir
function obtenerRolUsuario() {
  const user = firebase.auth().currentUser;
  if (user) {
      const userRef = database.ref('usuarios/' + user.uid);
      userRef.once('value').then((snapshot) => {
          if (snapshot.exists()) {
              const rol = snapshot.val().Rol;
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
      }).catch((error) => {
          console.error("Error al obtener el rol del usuario:", error);
      });
  } else {
      console.log("Usuario no autenticado.");
  }
}

// Evento click para el perfil
document.addEventListener('DOMContentLoaded', () => {
  const userInfoElement = document.getElementById('user-info');
  if (userInfoElement) {
      userInfoElement.addEventListener('click', obtenerRolUsuario);
  }
});

// Función para limpiar la tabla de datos
function limpiarTabla() {
  const tableBody = document.getElementById('tableBody');
  if (tableBody) {
      tableBody.innerHTML = '';
  }
}

// Código para el formulario de rifa y gestión de participantes
document.addEventListener('DOMContentLoaded', () => {
  const raffleForm = document.getElementById('raffleForm');
  const participantList = document.getElementById('participantList');
  const drawWinnerButton = document.getElementById('drawWinner');
  const tableBody = document.querySelector('table tbody');
  const participantNumberSelect = document.getElementById('participantNumber');
  let assignedNumbers = new Set();

  // Generar la tabla con celdas enumeradas del 00 al 99
  for (let i = 0; i < 10; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < 10; j++) {
          const cell = document.createElement('td');
          const number = (i * 10 + j).toString().padStart(2, '0');
          cell.textContent = number;
          cell.id = `cell-${number}`;
          row.appendChild(cell);
      }
      tableBody.appendChild(row);
  }

  // Generar las opciones del selector del 00 al 99
  for (let i = 0; i < 100; i++) {
      const option = document.createElement('option');
      option.value = i.toString().padStart(2, '0');
      option.textContent = i.toString().padStart(2, '0');
      participantNumberSelect.appendChild(option);
  }

  // Al cargar la página, mostrar los participantes guardados
  updateParticipantList();

  // Escuchar el evento de submit del formulario
  raffleForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const participantName = document.getElementById('participantName').value;
      const participantNumber = document.getElementById('participantNumber').value;

      if (participantName && participantNumber && !assignedNumbers.has(participantNumber)) {
          const added = await addParticipantToDatabase(participantName, participantNumber);
          if (added) {
              assignedNumbers.add(participantNumber);
              updateParticipantList();
              updateNumberOptions();
              raffleForm.reset();
          } else {
              console.log('Error: El participante con ese número ya existe.');
              alert("ya esta ocupado");
          }
      }
  });

  // drawWinnerButton.addEventListener('click', () => {
      // Lógica para seleccionar un ganador (sin cambios)
 //  });

});

