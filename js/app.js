// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Example: Add data to Firestore
  db.collection("messages").add({
    text: "Hello, Firebase!",
    timestamp: new Date()
  }).then(() => {
    document.getElementById("content").innerText = "Data added to Firestore!";
  }).catch((error) => {
    console.error("Error adding document: ", error);
  });