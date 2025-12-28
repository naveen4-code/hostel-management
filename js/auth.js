import { auth, provider, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const res = await signInWithEmailAndPassword(auth, email, password);
  redirect(res.user.uid);
};

window.googleLogin = async () => {
  const res = await signInWithPopup(auth, provider);
  redirect(res.user.uid);
};

async function redirect(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) {
    location.href = "profile.html";
  } else {
    snap.data().role === "admin"
      ? location.href = "admin.html"
      : location.href = "tenant.html";
  }
}
