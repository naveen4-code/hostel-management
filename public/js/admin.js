import { db } from "/js/firebase.js";
import {
  collection, addDoc, getDocs, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.addRoom = async () => {
  const roomNumber = document.getElementById("roomNumber").value;
  const rent = document.getElementById("rent").value;

  await addDoc(collection(db, "rooms"), {
    roomNumber,
    rent,
    occupied: false
  });

  alert("Room Added");
};

async function loadComplaints() {
  const list = document.getElementById("adminComplaints");
  const snap = await getDocs(collection(db, "complaints"));

  list.innerHTML = "";
  snap.forEach(d => {
    list.innerHTML += `
      <li>
        ${d.data().message}
        <button onclick="resolve('${d.id}')">Resolve</button>
      </li>`;
  });
}

window.resolve = async id => {
  await updateDoc(doc(db, "complaints", id), { status: "Resolved" });
  loadComplaints();
};

loadComplaints();
