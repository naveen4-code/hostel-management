import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async user => {
  if (!user) {
    location.href = "/index.html";
    return;
  }

  // ✅ READ OWN PROFILE (ALLOWED)
  const userSnap = await getDoc(doc(db, "users", user.uid));
  const data = userSnap.data();

  document.getElementById("room").innerHTML = `
    <div class="card">
      <h3>Room</h3>
      <p>${data.roomId || "Not assigned"}</p>
    </div>

    <div class="card">
      <h3>Monthly Rent</h3>
      <p>₹${data.rentAmount ?? "Not set"}</p>
      <span class="${data.rentPaid ? "paid" : "pending"}">
        ${data.rentPaid ? "Paid" : "Pending"}
      </span>
    </div>
  `;

  loadComplaints(user.uid);
});

/* ---------- COMPLAINTS ---------- */
async function loadComplaints(uid) {
  const q = query(
    collection(db, "complaints"),
    where("userId", "==", uid)
  );

  const snap = await getDocs(q);
  const list = document.getElementById("complaints");

  list.innerHTML = "";
  snap.forEach(d => {
    list.innerHTML += `
      <li>${d.data().message} — ${d.data().status}</li>
    `;
  });
}

window.raiseComplaint = async () => {
  const text = complaintText.value.trim();
  if (!text) return;

  await addDoc(collection(db, "complaints"), {
    userId: auth.currentUser.uid,
    message: text,
    status: "Pending",
    createdAt: new Date()
  });

  complaintText.value = "";
  loadComplaints(auth.currentUser.uid);
};
