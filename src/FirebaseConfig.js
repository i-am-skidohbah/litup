// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCD8dLPJAe5OmPoNgkrevJYwJhpSv5efDQ",
  authDomain: "luni-ca8eb.firebaseapp.com",
  projectId: "luni-ca8eb",
  storageBucket: "luni-ca8eb.appspot.com",
  messagingSenderId: "315853974826",
  appId: "1:315853974826:web:d63c24932cea7e41058253",
  measurementId: "G-Z0512NL3YB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firebaseApp = app;

// export other services as needed
