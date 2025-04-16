import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDhIlVeA2VYhSpDlK-VsgwTDA1_d_xGJg",
  authDomain: "nomadtrek-c8013.firebaseapp.com",
  projectId: "nomadtrek-c8013",
  storageBucket: "nomadtrek-c8013.firebasestorage.app",
  messagingSenderId: "237916959496",
  appId: "1:237916959496:web:d00d2aefef7d063f9c72bd",
  measurementId: "G-ZPQ4MYZSRB"
};


// // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getFirestore(app);
export const analytics = () => getAnalytics(app);
export const db = getFirestore(app);

export default app;