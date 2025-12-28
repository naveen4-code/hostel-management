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

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ---------- AUTH + LOAD DATA ---------- */
auth.onAuthStateChanged(async user => {
  if (!user) {
    location.href = "/index.html";
    return;
  }

  // 🔹 Load tenant profile
  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.data();

  // ✅ Fill cards individually
  document.getElementById("room").textContent =
    data.roomId || "Not assigned";

  document.getElementById("rent").textContent =
    data.rentAmount ? `₹${data.rentAmount}` : "Not set";

  const statusEl = document.getElementById("status");
  if (data.rentPaid) {
    statusEl.textContent = "Paid";
    statusEl.style.color = "green";
  } else {
    statusEl.textContent = "Pending";
    statusEl.style.color = "red";
  }

  loadComplaints(user.uid);
});

/* ---------- COMPLAINTS ---------- */
async function loadComplaints(uid) {
  const list = document.getElementById("notices");
  if (!list) return;

  list.innerHTML = "";

  const q = query(
    collection(db, "complaints"),
    where("userId", "==", uid)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    list.innerHTML = "<li>No complaints yet</li>";
    return;
  }

  snap.forEach(d => {
    list.innerHTML += `
      <li>
        ${d.data().message}
        — <strong>${d.data().status}</strong>
      </li>
    `;
  });
}

/* ---------- RAISE COMPLAINT ---------- */
window.raiseComplaint = async () => {
  const text = complaintText.value.trim();
  if (!text) {
    alert("Enter complaint");
    return;
  }

  await addDoc(collection(db, "complaints"), {
    userId: auth.currentUser.uid,
    message: text,
    status: "Pending",
    createdAt: new Date()
  });

  complaintText.value = "";
  loadComplaints(auth.currentUser.uid);
};

/* ---------- LOGOUT ---------- */
window.logout = async () => {
  await signOut(auth);
  location.href = "/index.html";
};
