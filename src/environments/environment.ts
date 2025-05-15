
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const environment = {
    firebase: {
  apiKey: "AIzaSyDnIMOqwaaxBJe9swjhjQfqMXSyZ3fYWv0",
  authDomain: "bullwatcher-7ba4e.firebaseapp.com",
  projectId: "bullwatcher-7ba4e",
  storageBucket: "bullwatcher-7ba4e.firebasestorage.app",
  messagingSenderId: "67059385564",
  appId: "1:67059385564:web:97a0062d3243416d3e6019",
  measurementId: "G-TL638012M9"
    }
};

// Initialize Firebase
const app = initializeApp(environment.firebase);
const analytics = getAnalytics(app);