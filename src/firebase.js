// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAXSprifwt4ZgK0yK9zGnCm0KMujqzR2N4",
  authDomain: "twin-mind-webapp.firebaseapp.com",
  projectId: "twin-mind-webapp",
  storageBucket: "twin-mind-webapp.firebasestorage.app",
  messagingSenderId: "849854425801",
  appId: "1:849854425801:web:01348cea20eeff1bdabb18",
  measurementId: "G-X9HC6XTHXQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider }; 