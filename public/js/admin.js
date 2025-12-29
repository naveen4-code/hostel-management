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

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- AUTH GUARD ---------- */
  auth.onAuthStateChanged(async user => {
  if (!user) {
    location.href = "/index.html";
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists() || snap.data().role !== "admin") {
    alert("Admin access only");
    location.href = "/index.html";
  }
});


  /* ---------- ELEMENTS ---------- */
  const tenantSelect = document.getElementById("tenantSelect");
  const rentTenantSelect = document.getElementById("rentTenantSelect");
  const roomTable = document.getElementById("roomTable");
  const complaintList = document.getElementById("complaintList");
  const noticeList = document.getElementById("noticeList");
  const noticeText = document.getElementById("noticeText");

  const tenantsCount = document.getElementById("tenants");
  const paidRents = document.getElementById("paidRents");
  const complaintsCount = document.getElementById("complaints");

  /* ---------- LOAD TENANTS + ROOM LIST ---------- */
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

  /* ---------- ASSIGN ROOM ---------- */
  window.assignRoom = async () => {
    if (!tenantSelect.value || !roomNo.value.trim()) {
      alert("Select tenant and room");
      return;
    }

    await updateDoc(doc(db, "users", tenantSelect.value), {
      roomId: roomNo.value.trim()
    });

    loadTenants();
  };

  /* ---------- UPDATE RENT ---------- */
  window.updateRent = async () => {
    if (!rentTenantSelect.value || !rentAmount.value) {
      alert("Missing rent details");
      return;
    }

    await updateDoc(doc(db, "users", rentTenantSelect.value), {
      rentAmount: Number(rentAmount.value),
      rentPaid: rentStatus.value === "true"
    });

    loadTenants();
  };

  /* ---------- POST NOTICE ---------- */
  window.postNotice = async () => {
    const text = noticeText.value.trim();
    if (!text) return alert("Enter notice");

    await addDoc(collection(db, "notices"), {
      message: text,
      createdAt: new Date()
    });

    noticeText.value = "";
    loadNotices();
  };

  /* ---------- LOAD NOTICES ---------- */
  async function loadNotices() {
    noticeList.innerHTML = "";

    const snap = await getDocs(
      query(collection(db, "notices"), orderBy("createdAt", "desc"))
    );

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

  /* ---------- LOAD COMPLAINTS ---------- */
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

  /* ---------- INIT ---------- */
  loadTenants();
  loadComplaints();
  loadNotices();
});
