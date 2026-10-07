import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("contact-form");
const status = document.getElementById("c-status");
const btn = document.getElementById("c-submit");

const setErr = (name, msg) => {
  const el = form.querySelector(`[data-err="${name}"]`);
  el.textContent = msg || "";
  el.closest(".field").classList.toggle("is-invalid", !!msg);
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  status.className = "cform__status";

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  setErr("name", name ? "" : "Please tell us your name.");
  setErr(
    "email",
    /^\S+@\S+\.\S+$/.test(email) ? "" : "Please enter a valid email address.",
  );
  setErr("message", message ? "" : "Please write a short message.");
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) return;

  // Honeypot: pretend success, store nothing
  if (form.website.value) {
    form.reset();
    status.textContent = "Thank you. Your message is on its way.";
    status.classList.add("is-ok");
    return;
  }

  btn.disabled = true;
  try {
    await addDoc(collection(db, "contact_submissions"), {
      name,
      email,
      message,
      createdAt: serverTimestamp(),
    });
    form.reset();
    status.textContent = "Thank you. Your message is on its way.";
    status.classList.add("is-ok");
  } catch (err) {
    console.error(err);
    status.textContent =
      "Something went wrong sending your message. Please try again.";
    status.classList.add("is-err");
  } finally {
    btn.disabled = false;
  }
});
