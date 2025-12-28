import { auth, db } from "/js/firebase.js";
import {
  collection, addDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async user => {
  if (!user) location.href = "/index.html";
  loadComplaints(user.uid);
});

window.raiseComplaint = async () => {
  const text = document.getElementById("complaintText").value;

  await addDoc(collection(db, "complaints"), {
    userId: auth.currentUser.uid,
    message: text,
    status: "Pending",
    createdAt: new Date()
  });

  alert("Complaint submitted");
};

async function loadComplaints(uid) {
  const list = document.getElementById("complaints");
  const q = query(collection(db, "complaints"), where("userId", "==", uid));
  const snap = await getDocs(q);

  list.innerHTML = "";
  snap.forEach(d => {
    list.innerHTML += `<li>${d.data().message} - ${d.data().status}</li>`;
  });
}
