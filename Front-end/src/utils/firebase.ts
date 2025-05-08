import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBv9wIVdH6hr9Q5RD9lC_CYwO52ceWsXb8",
    authDomain: "fds-system-d1513.firebaseapp.com",
    projectId: "fds-system-d1513",
    storageBucket: "fds-system-d1513.firebasestorage.app",
    messagingSenderId: "1016864715667",
    appId: "1:1016864715667:web:d572a567341e1ac2d5ae66",
    measurementId: "G-BSEP3982VT"
};

const app = initializeApp(firebaseConfig);

// Lấy các dịch vụ cần thiết
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore };
