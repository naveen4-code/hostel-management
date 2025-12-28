import { auth, provider, db } from "/js/firebase.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 👇 VERY IMPORTANT: attach to window */
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await signInWithEmailAndPassword(auth, email, password);
  redirect(res.user.uid);
};

window.googleLogin = async function () {
  const res = await signInWithPopup(auth, provider);
  redirect(res.user.uid);
};

async function redirect(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) {
    location.href = "/profile.html";
  } else {
    snap.data().role === "admin"
      ? location.href = "/admin.html"
      : location.href = "/tenant.html";
  }
}
