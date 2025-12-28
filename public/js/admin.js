import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ---------- LOGOUT ---------- */
window.logout = async () => {
  await signOut(auth);
  location.href = "/index.html";
};

/* ---------- LOAD TENANTS ---------- */
const tenantSelect = document.getElementById("tenantSelect");

async function loadTenants() {
  const q = query(
    collection(db, "users"),
    where("role", "==", "tenant")
  );

  const snap = await getDocs(q);
  tenantSelect.innerHTML = `<option value="">Select Tenant</option>`;

  snap.forEach(docSnap => {
    const u = docSnap.data();
    tenantSelect.innerHTML += `
      <option value="${docSnap.id}">
        ${u.name} (${u.email})
      </option>`;
  });
}

loadTenants();

/* ---------- ASSIGN ROOM ---------- */
window.assignRoom = async () => {
  const uid = tenantSelect.value;
  const room = roomNo.value.trim();

  if (!uid || !room) {
    alert("Select tenant and enter room number");
    return;
  }

  await updateDoc(doc(db, "users", uid), {
    roomId: room
  });

  alert("✅ Room assigned");
};

/* ---------- LOAD COMPLAINTS ---------- */
const complaintList = document.getElementById("complaintList");

async function loadComplaints() {
  const q = query(
    collection(db, "complaints"),
    where("status", "==", "Pending")
  );

  const snap = await getDocs(q);
  complaintList.innerHTML = "";

  snap.forEach(d => {
    complaintList.innerHTML += `
      <li>
        ${d.data().message}
        <button onclick="resolveComplaint('${d.id}')">Resolve</button>
      </li>`;
  });
}

loadComplaints();

/* ---------- RESOLVE COMPLAINT ---------- */
window.resolveComplaint = async id => {
  await updateDoc(doc(db, "complaints", id), {
    status: "Resolved"
  });
  loadComplaints();
};

/* ---------- POST NOTICE ---------- */
window.postNotice = async () => {
  const text = noticeText.value.trim();
  if (!text) return;

  await addDoc(collection(db, "notices"), {
    message: text,
    createdAt: new Date()
  });

  noticeText.value = "";
  alert("📢 Notice posted");
};
