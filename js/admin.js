import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.addRoom = async () => {
  await addDoc(collection(db, "rooms"), {
    roomNumber: roomNumber.value,
    rent: rent.value,
    occupied: false
  });
  alert("Room Added");
};

const snap = await getDocs(collection(db, "complaints"));
snap.forEach(d => {
  adminComplaints.innerHTML += `
    <li>
      ${d.data().message}
      <button onclick="resolve('${d.id}')">Resolve</button>
    </li>`;
});

window.resolve = async id => {
  await updateDoc(doc(db, "complaints", id), { status: "Resolved" });
  location.reload();
};
