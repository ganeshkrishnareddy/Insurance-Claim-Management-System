import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDnEv_EDxNPuqS_o46CpobHmd9rlrt4MuQ",
    authDomain: "insuranceclaimportal.firebaseapp.com",
    projectId: "insuranceclaimportal",
    storageBucket: "insuranceclaimportal.firebasestorage.app",
    messagingSenderId: "265189984722",
    appId: "1:265189984722:web:d7213a96f2fe374dfe600b",
    measurementId: "G-WFBK6KKJRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
