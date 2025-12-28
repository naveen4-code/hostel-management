import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ---------- SIGNUP ---------- */
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
    text.style.color = "#dc2626";
    window.passwordStrong = false;
  } 
  else if (score === 2 || score === 3) {
    bar.style.width = "65%";
    bar.style.background = "#f59e0b";
    text.textContent = "Medium strength";
    text.style.color = "#f59e0b";
    window.passwordStrong = false;
  } 
  else {
    bar.style.width = "100%";
    bar.style.background = "#16a34a";
    text.textContent = "Strong password";
    text.style.color = "#16a34a";
    window.passwordStrong = true;
  }
};

/* ---------- SHOW / HIDE PASSWORD ---------- */
window.togglePassword = () => {
  const input = document.getElementById("password");
  const toggle = document.querySelector(".toggle");

  if (input.type === "password") {
    input.type = "text";
    toggle.textContent = "🙈";
  } else {
    input.type = "password";
    toggle.textContent = "👁";
  }
};
if (!window.passwordStrong) {
  alert("Please choose a stronger password");
  return;
}

window.signup = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    location.href = "/profile.html";
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      openLoginModal(email); // 👈 OPEN POPUP
    } else if (err.code === "auth/weak-password") {
      alert("Password must be at least 6 characters");
    } else {
      alert(err.message);
    }
  }
};

/* ---------- LOGIN MODAL ---------- */
window.openLoginModal = (email = "") => {
  document.getElementById("loginModal").style.display = "flex";
  document.getElementById("loginEmail").value = email;
};

window.closeLoginModal = () => {
  document.getElementById("loginModal").style.display = "none";
};

window.loginFromModal = async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.href = "/index.html";
  } catch {
    alert("Invalid login credentials");
  }
};
