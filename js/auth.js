import { auth, provider, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await signInWithEmailAndPassword(auth, email, password);
  checkProfile(res.user.uid);
};

window.googleLogin = async function () {
  const res = await signInWithPopup(auth, provider);
  checkProfile(res.user.uid);
};

async function checkProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) {
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "profile.html";
  }
}
