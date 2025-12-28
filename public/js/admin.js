import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- AUTH GUARD ---------- */
  auth.onAuthStateChanged(async user => {
    if (!user) {
      location.href = "/index.html";
      return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.data();

    if (!data || data.role !== "admin") {
      alert("Access denied");
      location.href = "/index.html";
      return;
    }
  });

  /* ---------- ELEMENTS ---------- */
  const tenantSelect = document.getElementById("tenantSelect");
  const rentTenantSelect = document.getElementById("rentTenantSelect");
  const complaintList = document.getElementById("complaintList");

  const tenantsCount = document.getElementById("tenants");
  const paidRents = document.getElementById("paidRents");
  const complaintsCount = document.getElementById("complaints");

  /* ---------- LOAD TENANTS ---------- */
  async function loadTenants() {
    const snap = await getDocs(collection(db, "users"));

    tenantSelect.innerHTML = `<option value="">Select Tenant</option>`;
    rentTenantSelect.innerHTML = `<option value="">Select Tenant</option>`;

    let tenantTotal = 0;
    let rentPaidTotal = 0;

    snap.forEach(d => {
      const u = d.data();
      if (u.role === "tenant") {
        tenantTotal++;
        if (u.rentPaid) rentPaidTotal++;

        const option = document.createElement("option");
        option.value = d.id;
        option.textContent = `${u.name} (${u.email})`;

        tenantSelect.appendChild(option.cloneNode(true));
        rentTenantSelect.appendChild(option);
      }
    });

    tenantsCount.textContent = tenantTotal;
    paidRents.textContent = rentPaidTotal;
  }

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

  /* ---------- UPDATE RENT ---------- */
  window.updateRent = async () => {
    const uid = rentTenantSelect.value;
    const amount = Number(rentAmount.value);
    const paid = rentStatus.value === "true";

    if (!uid || !amount) {
      alert("Select tenant and enter rent amount");
      return;
    }

    await updateDoc(doc(db, "users", uid), {
      rentAmount: amount,
      rentPaid: paid,
      rentUpdatedAt: new Date()
    });

    alert("💰 Rent updated");
    loadTenants(); // refresh stats
  };

  /* ---------- LOAD COMPLAINTS ---------- */
  async function loadComplaints() {
    const q = query(
      collection(db, "complaints"),
      where("status", "==", "Pending")
    );

    const snap = await getDocs(q);
    complaintList.innerHTML = "";
    complaintsCount.textContent = snap.size;

    snap.forEach(d => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${d.data().message}
        <button class="small">Resolve</button>
      `;

      li.querySelector("button").onclick = async () => {
        await updateDoc(doc(db, "complaints", d.id), {
          status: "Resolved"
        });
        loadComplaints();
      };

      complaintList.appendChild(li);
    });
  }

  /* ---------- LOGOUT ---------- */
  window.logout = async () => {
    await signOut(auth);
    location.href = "/index.html";
  };

  /* ---------- INIT ---------- */
  loadTenants();
  loadComplaints();
});
