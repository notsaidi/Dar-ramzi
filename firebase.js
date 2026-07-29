// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDkgcOW2przepoZgmJmiBE6oEunfxUpjMQ",
    authDomain: "dar-ramzi.firebaseapp.com",
    projectId: "dar-ramzi",
    storageBucket: "dar-ramzi.firebasestorage.app",
    messagingSenderId: "403661695022",
    appId: "1:403661695022:web:953b01deacfb8a0ae717bf",
    measurementId: "G-T75W6F1B7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);