import { auth } from "/js/firebase.js";
import {
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.logout = async () => {
  await signOut(auth);
  location.href = "/index.html";
};
