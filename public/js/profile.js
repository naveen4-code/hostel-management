import { auth, db } from "./firebase.js";
import {
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
auth.onAuthStateChanged(async user => {
  if (!user) location.href = "/index.html";

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) {
    alert("Profile not found");
    location.href = "/index.html";
  }
});
window.saveProfile = async () => {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  if (!name || !phone) {
    alert("Fill all fields");
    return;
  }
  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    name,
    phone
  });
  location.href = "/tenant.html";
};