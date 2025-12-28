import { auth, db } from "/js/firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* 🔐 AUTH CHECK */
onAuthStateChanged(auth, user => {
  if (!user) location.href = "/";
});

/* 🚪 LOGOUT */
window.logout = async () => {
  await signOut(auth);
  location.href = "/";
};

/* 📊 DASHBOARD */
async function loadDashboard() {
  const usersSnap = await getDocs(collection(db, "users"));
  const rentsSnap = await getDocs(collection(db, "rents"));
  const complaintsSnap = await getDocs(collection(db, "complaints"));

  document.getElementById("tenants").innerText =
    usersSnap.docs.filter(u => u.data().role === "tenant").length;

  document.getElementById("paidRents").innerText =
    rentsSnap.docs.filter(r => r.data().status === "PAID").length;

  document.getElementById("complaints").innerText =
    complaintsSnap.docs.filter(c => c.data().status === "Pending").length;
}

loadDashboard();

/* 🏠 ASSIGN ROOM */
window.assignRoom = async () => {
  const uid = document.getElementById("tenantId").value.trim();
  const room = document.getElementById("roomNo").value.trim();

  if (!uid || !room) return alert("Enter tenant UID and room number");

  await updateDoc(doc(db, "users", uid), {
    roomId: room
  });

  alert("Room assigned successfully");
};

/* 💰 MARK RENT PAID */
window.markPaid = async () => {
  const uid = document.getElementById("rentUid").value.trim();
  const amount = document.getElementById("amount").value.trim();

  if (!uid || !amount) return alert("Enter rent details");

  const month = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  await addDoc(collection(db, "rents"), {
    userId: uid,
    amount: Number(amount),
    month,
    status: "PAID"
  });

  alert("Rent marked as PAID");
  loadDashboard();
};

/* 🛠️ COMPLAINTS */
async function loadComplaints() {
  const snap = await getDocs(collection(db, "complaints"));
  const list = document.getElementById("complaintList");
  list.innerHTML = "";

  snap.forEach(d => {
    const c = d.data();
    list.innerHTML += `
      <li>
        ${c.message} — ${c.status}
        ${
          c.status === "Pending"
            ? `<button onclick="resolveComplaint('${d.id}')">Resolve</button>`
            : ""
        }
      </li>
    `;
  });
}

loadComplaints();

window.resolveComplaint = async id => {
  await updateDoc(doc(db, "complaints", id), {
    status: "Resolved"
  });
  loadComplaints();
  loadDashboard();
};

/* 📢 NOTICE */
window.postNotice = async () => {
  const msg = document.getElementById("noticeText").value.trim();
  if (!msg) return alert("Enter notice message");

  await addDoc(collection(db, "notices"), {
    message: msg,
    createdAt: new Date()
  });

  alert("Notice posted");
};
