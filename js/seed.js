import { auth, db } from "./firebase-config.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const log = (m) => {
  document.getElementById("log").textContent += m + "\n";
};

onAuthStateChanged(auth, (u) => {
  document.getElementById("go").disabled = !u;
  if (u) log("Signed in as " + u.email);
});
document.getElementById("in").onclick = () =>
  signInWithPopup(auth, new GoogleAuthProvider()).catch((e) => log(e.message));

document.getElementById("go").onclick = async () => {
  const list = window.elvixe.products;
  for (const [i, p] of list.entries()) {
    const data = JSON.parse(
      JSON.stringify({ ...p, order: i + 1, active: true }),
    ); // strips undefined fields
    try {
      await setDoc(doc(db, "products", p.id), data, { merge: true });
      log("✓ " + p.id);
    } catch (e) {
      log("✗ " + p.id + ": " + (e.code || e.message));
    }
  }
  log("Done. Check Firestore → products.");
};
