import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { signOut } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

auth.onAuthStateChanged(async user => {
  if (!user) location.href = "/index.html";

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists() || snap.data().role !== "admin") {
    alert("Access denied");
    location.href = "/index.html";
  }
});

/* ELEMENTS */
const tenantSelect = document.getElementById("tenantSelect");
const rentTenantSelect = document.getElementById("rentTenantSelect");
const roomTable = document.getElementById("roomTable");
const complaintList = document.getElementById("complaintList");

const tenantsCount = document.getElementById("tenants");
const paidRents = document.getElementById("paidRents");
const complaintsCount = document.getElementById("complaints");

/* LOAD TENANTS + ROOM LIST */
async function loadTenants() {
  const snap = await getDocs(collection(db, "users"));

  tenantSelect.innerHTML = `<option value="">Select Tenant</option>`;
  rentTenantSelect.innerHTML = `<option value="">Select Tenant</option>`;
  roomTable.innerHTML = "";

  let total = 0, paid = 0;

  snap.forEach(d => {
    const u = d.data();
    if (u.role === "tenant") {
      total++;
      if (u.rentPaid) paid++;

      const opt = new Option(`${u.name} (${u.email})`, d.id);
      tenantSelect.add(opt.cloneNode(true));
      rentTenantSelect.add(opt);

      roomTable.innerHTML += `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.roomId || "-"}</td>
          <td>${u.rentAmount ? "₹" + u.rentAmount : "-"}</td>
          <td>${u.rentPaid ? "Paid" : "Pending"}</td>
        </tr>
      `;
    }
  });

  tenantsCount.textContent = total;
  paidRents.textContent = paid;
}

/* ASSIGN ROOM */
window.assignRoom = async () => {
  if (!tenantSelect.value || !roomNo.value) return alert("Missing fields");
  await updateDoc(doc(db, "users", tenantSelect.value), { roomId: roomNo.value });
  loadTenants();
};

/* UPDATE RENT */
window.updateRent = async () => {
  await updateDoc(doc(db, "users", rentTenantSelect.value), {
    rentAmount: Number(rentAmount.value),
    rentPaid: rentStatus.value === "true"
  });
  loadTenants();
};

/* POST NOTICE */
window.postNotice = async () => {
  const text = noticeText.value.trim();
  if (!text) return alert("Enter notice");

  await addDoc(collection(db, "notices"), {
    message: text,
    createdAt: new Date()
  });

  noticeText.value = "";
  loadNotices();
  alert("📢 Notice posted");
};

const noticeList = document.getElementById("noticeList");

async function loadNotices() {
  const snap = await getDocs(
    query(collection(db, "notices"), orderBy("createdAt", "desc"))
  );

  noticeList.innerHTML = "";

  if (snap.empty) {
    noticeList.innerHTML = "<li class='muted'>No notices posted</li>";
    return;
  }

  snap.forEach(d => {
    noticeList.innerHTML += `
      <li>
        ${d.data().message}
        <button class="small danger" onclick="deleteNotice('${d.id}')">
          Delete
        </button>
      </li>
    `;
  });
}
window.deleteNotice = async id => {
  if (!confirm("Delete this notice?")) return;

  await deleteDoc(doc(db, "notices", id));
  loadNotices();
};

/* LOAD COMPLAINTS WITH TENANT NAME */
async function loadComplaints() {
  const snap = await getDocs(
    query(collection(db, "complaints"), where("status", "==", "Pending"))
  );

  complaintList.innerHTML = "";
  complaintsCount.textContent = snap.size;

  for (const d of snap.docs) {
    const c = d.data();
    const userSnap = await getDoc(doc(db, "users", c.userId));

    complaintList.innerHTML += `
      <li>
        <strong>${userSnap.data().name}</strong>: ${c.message}
        <button class="small" onclick="resolve('${d.id}')">Resolve</button>
      </li>
    `;
  }
}

window.resolve = async id => {
  await updateDoc(doc(db, "complaints", id), { status: "Resolved" });
  loadComplaints();
};

window.logout = async () => {
  await signOut(auth);
  location.href = "/index.html";
};

loadTenants();
loadComplaints();
loadNotices();