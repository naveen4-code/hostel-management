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

/* AUTH & LOAD DATA */
auth.onAuthStateChanged(async user => {
  if (!user) {
    location.href = "/index.html";
    return;
  }

  /* LOAD PROFILE */
  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.data();

  document.getElementById("room").textContent =
    data.roomId || "Not assigned";

  document.getElementById("rent").textContent =
    data.rentAmount ? `₹${data.rentAmount}` : "Not set";

  const status = document.getElementById("status");
  status.textContent = data.rentPaid ? "Paid" : "Pending";
  status.style.color = data.rentPaid ? "green" : "red";

  loadComplaints(user.uid);
  loadNotices();
});

/* LOAD MY COMPLAINTS */
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
    list.innerHTML = "<li class='muted'>No complaints yet</li>";
    return;
  }

  snap.forEach(d => {
    const c = d.data();
    list.innerHTML += `
      <li>
        ${c.message}
        <br>
        <small>Status: <strong>${c.status}</strong></small>
      </li>
    `;
  });
}

/* LOAD NOTICES */
async function loadNotices() {
  const list = document.getElementById("notices");
  list.innerHTML = "";

  const snap = await getDocs(
    query(collection(db, "notices"), orderBy("createdAt", "desc"))
  );

  if (snap.empty) {
    list.innerHTML = "<li class='muted'>No notices</li>";
    return;
  }

  snap.forEach(d => {
    list.innerHTML += `
      <li>${d.data().message}</li>
    `;
  });
}

/* RAISE COMPLAINT */
window.raiseComplaint = async () => {
  const text = complaintText.value.trim();
  if (!text) return alert("Enter complaint");

  await addDoc(collection(db, "complaints"), {
    userId: auth.currentUser.uid,
    message: text,
    status: "Pending",
    createdAt: new Date()
  });

  complaintText.value = "";
  loadComplaints(auth.currentUser.uid);
};

/* LOGOUT */
window.logout = async () => {
  await signOut(auth);
  location.href = "/index.html";
};
