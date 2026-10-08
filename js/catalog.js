import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const E = (window.elvixe = window.elvixe || {});

try {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), 6000),
  );
  const snap = await Promise.race([
    getDocs(query(collection(db, "products"), where("active", "==", true))),
    timeout,
  ]);
  const list = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  if (list.length) E.products = list; // an empty collection keeps the built-in list
} catch (err) {
  console.warn("Using the built-in product list:", err.message);
}

E.ready = true;
document.dispatchEvent(new CustomEvent("catalog:ready"));
