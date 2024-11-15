import { auth } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

// Register function
export function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert('Registered successfully!');
      window.location.href = 'hello.html'; // Redirect to "Hello World" page after registration
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById("register-error").innerText = errorMessage;
    });
}

// Login function
export function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert('Logged in successfully!');
      window.location.href = 'hello.html'; // Redirect to "Hello World" page
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById("login-error").innerText = errorMessage;
    });
}

// Logout function
export function logout() {
  signOut(auth).then(() => {
    alert('Logged out successfully!');
    window.location.href = 'index.html'; // Redirect to login page
  }).catch((error) => {
    console.error('Error logging out:', error);
  });
}

// Check if the user is logged in and redirect only if necessary
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname;

  if (user) {
    // If user is logged in, redirect to hello.html only if they are not already there
    if (currentPage.endsWith('index.html')) {
      window.location.href = 'hello.html';
    }
  } else {
    // If no user is logged in, redirect to index.html only if they are not already there
    if (currentPage.endsWith('hello.html')) {
      window.location.href = 'index.html';
    }
  }
});

// Expose login, logout, and register functions to global scope
window.login = login;
window.logout = logout;
window.register = register;
