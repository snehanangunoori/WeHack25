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
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Sign Up
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      document.getElementById("status").innerText = `Signed up: ${userCred.user.email}`;
    })
    .catch(err => {
      document.getElementById("status").innerText = err.message;
    });
}

// Log In
function logIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCred => {
      document.getElementById("status").innerText = `Logged in: ${userCred.user.email}`;
    })
    .catch(err => {
      document.getElementById("status").innerText = err.message;
    });
}

// Log Out
function logOut() {
  auth.signOut()
    .then(() => {
      document.getElementById("status").innerText = "Logged out.";
    });
}