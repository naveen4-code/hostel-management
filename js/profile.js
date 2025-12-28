import { auth, db } from "./firebase.js";
import { doc, setDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.saveProfile = async function () {
  const user = auth.currentUser;

  await setDoc(doc(db, "users", user.uid), {
    name: name.value,
    phone: phone.value,
    age: age.value,
    address: address.value,
    role: "tenant",
    email: user.email,
    createdAt: new Date()
  });

  window.location.href = "dashboard.html";
};
