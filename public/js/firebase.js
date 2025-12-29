import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyB-Jj5Py0Z_nJFWvs5DobTZZoQMrmFCf-0",
  authDomain: "room-management-7fd6f.firebaseapp.com",
  projectId: "room-management-7fd6f",
  storageBucket: "room-management-7fd6f.firebasestorage.app",
  messagingSenderId: "963716835896",
  appId: "1:963716835896:web:293df262d1246bcc0b94cd"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);