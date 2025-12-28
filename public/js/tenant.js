import { auth, db } from "/js/firebase.js";
import {
  doc, getDoc, collection, addDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

auth.onAuthStateChanged(async user => {
  if (!user) return location.href = "/";

  const userSnap = await getDoc(doc(db, "users", user.uid));
  const data = userSnap.data();

  document.getElementById("room").innerText = data.roomId || "Not assigned";
  document.getElementById("rent").innerText = "₹ " + data.rent;

  loadRentStatus(user.uid);
  loadNotices();
});

async function loadRentStatus(uid) {
  const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const q = query(collection(db, "rents"),
    where("userId", "==", uid),
    where("month", "==", month)
  );

  const snap = await getDocs(q);
  document.getElementById("status").innerText =
    snap.empty ? "DUE" : snap.docs[0].data().status;
}

window.raiseComplaint = async () => {
  const msg = document.getElementById("complaintText").value;

  await addDoc(collection(db, "complaints"), {
    userId: auth.currentUser.uid,
    message: msg,
    status: "Pending",
    createdAt: new Date()
  });

  alert("Complaint submitted");
};

async function loadNotices() {
  const snap = await getDocs(collection(db, "notices"));
  const list = document.getElementById("notices");
  list.innerHTML = "";

  snap.forEach(d =>
    list.innerHTML += `<li>${d.data().message}</li>`
  );
}

window.logout = async () => {
  await signOut(auth);
  location.href = "/";
};
