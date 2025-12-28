import { auth, db } from "/js/firebase.js";
import {
  doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.saveProfile = async () => {
  const user = auth.currentUser;

  const nameVal = document.getElementById("name").value;
  const phoneVal = document.getElementById("phone").value;

  await setDoc(doc(db, "users", user.uid), {
    name: nameVal,
    phone: phoneVal,
    role: "tenant",
    email: user.email,
    roomId: "",
    createdAt: new Date()
  });

  location.href = "/tenant.html";
};
