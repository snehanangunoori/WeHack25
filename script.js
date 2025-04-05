import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnzGQIwlwpRcs2PJ1HhDp9a6FZof3NN9U",
  authDomain: "login-6547a.firebaseapp.com",
  projectId: "login-6547a",
  storageBucket: "login-6547a.firebasestorage.app",
  messagingSenderId: "590992873527",
  appId: "1:590992873527:web:1c6b68030c750e630c47b2"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Sign Up
window.signUp = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCred => {
      document.getElementById("status").innerText = `Signed up!`;
    })
    .catch(error => {
      document.getElementById("status").innerText = `Error: ${error.message}`;
    });
};

// Log In
window.logIn = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCred => {      
      // Redirect to the dashboard page after successful login
      window.location.href = '../dashboard.html';
    })
    .catch(error => {
      document.getElementById("status").innerText = `Error: ${error.message}`;
    });
};



// Log Out
window.logOut = function () {
  signOut(auth)
    .then(() => {
      document.getElementById("status").innerText = "Logged out successfully.";
    })
    .catch(error => {
      document.getElementById("status").innerText = `Error: ${error.message}`;
    });
};

// Auth state listener
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is signed in:", user.email);
  } else {
    console.log("User is signed out.");
  }
});