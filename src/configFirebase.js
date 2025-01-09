// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaEm7TE3oV4B47OloGc3tI3m6NDyzoeKo",
  authDomain: "tania-kp.firebaseapp.com",
  projectId: "tania-kp",
  storageBucket: "tania-kp.firebasestorage.app",
  messagingSenderId: "1099463834271",
  appId: "1:1099463834271:web:82cb94a08dc04cc69ac0aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
