// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoLexsfdggolYPrdoV7K3thTty8NtF_tM",
  authDomain: "indy09-grocery-cook-book-app.firebaseapp.com",
  projectId: "indy09-grocery-cook-book-app",
  storageBucket: "indy09-grocery-cook-book-app.appspot.com",
  messagingSenderId: "751395643186",
  appId: "1:751395643186:web:5cc5ffd0462a74ee0ec12b",
  measurementId: "G-CZ23MBNXK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Expose the logout function to the global scope (window object)
export function logout() {
  signOut(auth)
    .then(() => {
      alert('Logged out successfully!');
      window.location.href = 'index.html'; // Redirect to the login page
    })
    .catch((error) => {
      console.error('Error logging out:', error);
    });
}

// Expose the auth and db services globally
export { auth, db };

// Ensure logout is available globally
window.logout = logout;
