import { auth, db } from "./firebase.js";
import { doc, setDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.saveProfile = async () => {
  const user = auth.currentUser;

  await setDoc(doc(db, "users", user.uid), {
    name: name.value,
    phone: phone.value,
    role: "tenant",
    email: user.email,
    roomId: "",
    createdAt: new Date()
  });

  location.href = "tenant.html";
};
