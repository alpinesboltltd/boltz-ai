// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEDaemjVTeEHtrQ8s_KYt3pp9wOQ8GDvQ",
  authDomain: "helix.firebaseapp.com",
  projectId: "helix",
  storageBucket: "helix.firebasestorage.app",
  messagingSenderId: "629956062943",
  appId: "1:629956062943:web:6e2ce3cc8537f2ae27436a",
  measurementId: "G-7TDKWX3CKJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
