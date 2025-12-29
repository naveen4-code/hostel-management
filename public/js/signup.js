import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------- GLOBAL STATE ---------- */
window.passwordStrong = false;

/* ---------- PASSWORD STRENGTH ---------- */
window.checkStrength = () => {
  const password = document.getElementById("password").value;
  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");

  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    bar.style.width = "25%";
    bar.style.background = "#dc2626";
    text.textContent = "Weak password";
    window.passwordStrong = false;
  } else if (score <= 3) {
    bar.style.width = "65%";
    bar.style.background = "#f59e0b";
    text.textContent = "Medium strength";
    window.passwordStrong = false;
  } else {
    bar.style.width = "100%";
    bar.style.background = "#16a34a";
    text.textContent = "Strong password";
    window.passwordStrong = true;
  }
};

/* ---------- SHOW / HIDE PASSWORD ---------- */
window.togglePassword = () => {
  const input = document.getElementById("password");
  document.querySelector(".toggle").textContent =
    input.type === "password" ? "🙈" : "👁";
  input.type = input.type === "password" ? "text" : "password";
};

/* ---------- SIGNUP ---------- */
window.signup = async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) return alert("Enter email and password");
  if (!window.passwordStrong) return alert("Choose a stronger password");

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    /* ✅ CREATE USER DOCUMENT */
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role: "tenant",
      name: "",
      phone: "",
      roomId: "",
      rentAmount: 0,
      rentPaid: false,
      createdAt: serverTimestamp()
    });

    location.href = "/profile.html";
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      openLoginModal(email);
    } else {
      alert(err.message);
    }
  }
};

/* ---------- LOGIN MODAL ---------- */
window.openLoginModal = (email = "") => {
  loginModal.style.display = "flex";
  loginEmail.value = email;
};

window.closeLoginModal = () => {
  loginModal.style.display = "none";
};

window.loginFromModal = async () => {
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    location.href = "/index.html";
  } catch {
    alert("Invalid login credentials");
  }
};
