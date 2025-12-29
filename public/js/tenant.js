import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let tenantData = null;

/* ---------- AUTH ---------- */
auth.onAuthStateChanged(async user => {
  if (!user) {
    location.href = "/index.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  tenantData = snap.data();

  // Cards
  room.textContent = tenantData.roomId || "Not assigned";
  rent.textContent = tenantData.rentAmount ? `₹${tenantData.rentAmount}` : "Not set";

  status.textContent = tenantData.rentPaid ? "Paid" : "Pending";
  status.style.color = tenantData.rentPaid ? "green" : "red";

  loadComplaints(user.uid);
  loadNotices();
});

/* ---------- LOAD COMPLAINTS ---------- */
async function loadComplaints(uid) {
  const list = document.getElementById("complaints");
  list.innerHTML = "";

  const q = query(
    collection(db, "complaints"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    list.innerHTML = "<li>No complaints raised</li>";
    return;
  }

  snap.forEach(d => {
    const c = d.data();
    list.innerHTML += `
      <li>
        ${c.message} —
        <strong>${c.status}</strong>
      </li>
    `;
  });
}

/* ---------- RAISE COMPLAINT ---------- */
window.raiseComplaint = async () => {
  const text = complaintText.value.trim();
  if (!text) return alert("Enter complaint");

  await addDoc(collection(db, "complaints"), {
    userId: auth.currentUser.uid,
    tenantName: tenantData.name,
    roomId: tenantData.roomId || "",
    message: text,
    status: "Pending",
    createdAt: new Date()
  });

  complaintText.value = "";
  loadComplaints(auth.currentUser.uid);
};

/* ---------- LOAD NOTICES ---------- */
async function loadNotices() {
  const list = document.getElementById("notices");
  list.innerHTML = "";

  const snap = await getDocs(
    query(collection(db, "notices"), orderBy("createdAt", "desc"))
  );

  snap.forEach(d => {
    list.innerHTML += `<li>${d.data().message}</li>`;
  });
}

/* ---------- LOGOUT ---------- */
window.logout = async () => {
  await signOut(auth);
  location.href = "/index.html";
};
