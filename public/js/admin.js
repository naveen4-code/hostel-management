import { db } from "/js/firebase.js";
import {
  collection, getDocs, addDoc, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
window.assignRoom = async () => {
  const uid = document.getElementById("tenantId").value;
  const room = document.getElementById("roomNo").value;

  await updateDoc(doc(db, "users", uid), {
    roomId: room
  });

  alert("Room assigned");
};
window.markPaid = async () => {
  const uid = document.getElementById("rentUid").value;
  const amount = document.getElementById("amount").value;

  const month = new Date().toLocaleString("default", {
    month: "long", year: "numeric"
  });

  await addDoc(collection(db, "rents"), {
    userId: uid,
    amount: amount,
    month: month,
    status: "PAID"
  });

  alert("Rent marked as PAID");
};  
loadDashboard();
loadComplaints();

async function loadDashboard() {
  const users = await getDocs(collection(db, "users"));
  const rents = await getDocs(collection(db, "rents"));
  const complaints = await getDocs(collection(db, "complaints"));

  document.getElementById("tenants").innerText =
    users.docs.filter(u => u.data().role === "tenant").length;

  document.getElementById("paidRents").innerText =
    rents.docs.filter(r => r.data().status === "PAID").length;

  document.getElementById("complaints").innerText =
    complaints.docs.filter(c => c.data().status === "Pending").length;
}


async function loadComplaints() {
  const snap = await getDocs(collection(db, "complaints"));
  const list = document.getElementById("complaintList");
  list.innerHTML = "";

  snap.forEach(d => {
    const c = d.data();
    list.innerHTML += `
      <li>
        ${c.message} (${c.status})
        <button onclick="resolve('${d.id}')">Resolve</button>
      </li>`;
  });
}

window.resolve = async id => {
  await updateDoc(doc(db, "complaints", id), { status: "Resolved" });
  loadComplaints();
};

window.postNotice = async () => {
  const msg = document.getElementById("noticeText").value;
  await addDoc(collection(db, "notices"), {
    message: msg,
    createdAt: new Date()
  });
  alert("Notice posted");
};
