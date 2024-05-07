import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth,GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBqYsXRUagYLPOLqJMX0xMU0ywXSztZeNA",
  authDomain: "clothes-7159b.firebaseapp.com",
  projectId: "clothes-7159b",
  storageBucket: "clothes-7159b.appspot.com",
  messagingSenderId: "900598179429",
  appId: "1:900598179429:web:4a30901dc548721283c88c",
  measurementId: "G-15W6W3JRDG"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Obtén la instancia de Firestore

console.log("Conexión a Firebase establecida correctamente.");

const provider = new GoogleAuthProvider();
const auth = getAuth();
auth.languageCode = 'en';

const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener("click", function(){
  const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    window.location.href="/clothes/pagos.html";
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  }); 
})