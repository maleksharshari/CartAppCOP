// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCEChPMjgujvNlwGdGqwYMt5zNhUGKwek0",
    authDomain: "shoppingcart01-ec42b.firebaseapp.com",
    projectId: "shoppingcart01-ec42b",
    storageBucket: "shoppingcart01-ec42b.firebasestorage.app",
    messagingSenderId: "134083421130",
    appId: "1:134083421130:web:05df2af97037fe936f6533",
    measurementId: "G-Q6TW5NPKD6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);

// Add a default export with Firebase services
const firebaseServices = {
    app,
    auth
};

export default firebaseServices;

