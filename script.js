// Your Firebase config (replace with yours)
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "xxxxxx",
    appId: "xxxxxx"
  };
  
  // Init Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // Signup
  function handleSignUp() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
  
    auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log("User signed up:", user.user.email);
      })
      .catch(err => console.error("Sign up error:", err.message));
  }
  
  // Login
  function handleLogin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log("User logged in:", user.user.email);
      })
      .catch(err => console.error("Login error:", err.message));
  }
  
  // Logout
  function handleLogout() {
    auth.signOut().then(() => {
      console.log("User logged out");
    });
  }
  