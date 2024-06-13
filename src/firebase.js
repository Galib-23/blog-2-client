// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "galib-blog.firebaseapp.com",
  projectId: "galib-blog",
  storageBucket: "galib-blog.appspot.com",
  messagingSenderId: "63261289805",
  appId: "1:63261289805:web:70dfac03ae58be10dcdb04"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);