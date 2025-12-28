import { auth, db } from "./firebase.js";
import {
  collection, addDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async user => {
  if (!user) location.href = "index.html";
  loadComplaints(user.uid);
});

window.raiseComplaint = async () => {
  await addDoc(collection(db, "complaints"), {
    userId: auth.currentUser.uid,
    message: complaintText.value,
    status: "Pending",
    createdAt: new Date()
  });
  alert("Complaint submitted");
};

async function loadComplaints(uid) {
  const q = query(collection(db, "complaints"), where("userId", "==", uid));
  const snap = await getDocs(q);
  complaints.innerHTML = "";
  snap.forEach(doc =>
    complaints.innerHTML += `<li>${doc.data().message} - ${doc.data().status}</li>`
  );
}
