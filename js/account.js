import { auth, db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const $ = (s, r = document) => r.querySelector(s);
const views = [...document.querySelectorAll("[data-view]")];
const tabs = $("#a-tabs"),
  social = $("#a-social"),
  title = $("#a-title");

// ?next=checkout.html sends the visitor on after signing in (only plain local .html names are allowed)
const nextParam = new URLSearchParams(location.search).get("next");
const NEXT = /^[a-z0-9-]+\.html$/i.test(nextParam || "") ? nextParam : null;

const TITLES = {
  signin: "Welcome back.",
  signup: "Create your account.",
  reset: "Reset your password.",
  account: "Your account.",
};

function show(view) {
  views.forEach((v) => (v.hidden = v.dataset.view !== view));
  const gate = view === "signin" || view === "signup";
  tabs.hidden = !gate;
  social.hidden = !gate;
  tabs
    .querySelectorAll("button")
    .forEach((b) => b.classList.toggle("is-on", b.dataset.go === view));
  title.textContent = TITLES[view];
  document.querySelectorAll(".astatus").forEach(clear);
}
const clear = (el) => {
  el.textContent = "";
  el.className = "astatus";
};
const say = (el, msg, ok = false) => {
  el.textContent = msg;
  el.className = "astatus " + (ok ? "is-ok" : "is-err");
};

const ERRORS = {
  "auth/invalid-credential": "That email and password don’t match.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/email-already-in-use":
    "An account with that email already exists. Try signing in.",
  "auth/weak-password": "Please choose a password of at least 8 characters.",
  "auth/too-many-requests":
    "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed":
    "Network problem. Please check your connection.",
  "auth/popup-closed-by-user": "The Google window was closed before finishing.",
  "auth/popup-blocked":
    "Your browser blocked the Google window. Allow pop-ups and try again.",
  "auth/operation-not-allowed": "This sign-in method isn’t switched on yet.",
};
const friendly = (err) =>
  ERRORS[err.code] || "Something went wrong. Please try again.";
const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v);

// Tab / link navigation
document.addEventListener("click", (e) => {
  const go = e.target.closest("[data-go]");
  if (go) show(go.dataset.go);
});

let signingUp = false;
const goNext = () => {
  if (NEXT) location.href = NEXT;
};

// Sign in
$("#f-signin").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget,
    status = $(".astatus", f),
    btn = $("button[type=submit]", f);
  const email = f.email.value.trim(),
    password = f.password.value;
  if (!emailOk(email) || !password)
    return say(status, "Please enter your email and password.");
  btn.disabled = true;
  clear(status);
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    say(status, friendly(err));
  } finally {
    btn.disabled = false;
  }
});

// Create account
$("#f-signup").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget,
    status = $(".astatus", f),
    btn = $("button[type=submit]", f);
  const name = f.name.value.trim(),
    email = f.email.value.trim(),
    password = f.password.value;
  if (!name) return say(status, "Please tell us your name.");
  if (!emailOk(email))
    return say(status, "Please enter a valid email address.");
  if (password.length < 8)
    return say(status, "Please choose a password of at least 8 characters.");
  btn.disabled = true;
  clear(status);
  signingUp = true;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    signingUp = false;
    goNext();
    renderAccount(auth.currentUser);
  } catch (err) {
    signingUp = false;
    say(status, friendly(err));
  } finally {
    btn.disabled = false;
  }
});

// Forgot password
$("#f-reset").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget,
    status = $(".astatus", f),
    btn = $("button[type=submit]", f);
  const email = f.email.value.trim();
  if (!emailOk(email))
    return say(status, "Please enter a valid email address.");
  btn.disabled = true;
  clear(status);
  try {
    await sendPasswordResetEmail(auth, email);
    say(
      status,
      "If an account exists for that email, a reset link is on its way.",
      true,
    );
  } catch (err) {
    say(status, friendly(err));
  } finally {
    btn.disabled = false;
  }
});

// Google
$("#btn-google").addEventListener("click", async (e) => {
  const btn = e.currentTarget,
    status = $("#google-status");
  btn.disabled = true;
  clear(status);
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (err) {
    say(status, friendly(err));
  } finally {
    btn.disabled = false;
  }
});

// Signed-in actions
$("#btn-signout").addEventListener("click", () => signOut(auth));
$("#btn-change-pass").addEventListener("click", async () => {
  const status = $("#account-status");
  try {
    await sendPasswordResetEmail(auth, auth.currentUser.email);
    say(
      status,
      "We’ve sent a link to your email to choose a new password.",
      true,
    );
  } catch (err) {
    say(status, friendly(err));
  }
});

function renderAccount(user) {
  const name = user.displayName || user.email.split("@")[0];
  title.textContent = `Hello, ${name}.`;
  $("#a-email").textContent = user.email;
  views.forEach((v) => (v.hidden = v.dataset.view !== "account"));
  tabs.hidden = true;
  social.hidden = true;
  loadOrders(user);
}

onAuthStateChanged(auth, (user) => {
  if (signingUp) return; // wait until the new account's name is saved
  if (user) {
    goNext();
    renderAccount(user);
  } else show("signin");
});

async function loadOrders(user) {
  const list = $("#a-orders");
  const naira = (n) => "₦" + Number(n).toLocaleString("en-NG");
  const label = {
    pending: "Awaiting payment",
    paid_unverified: "Paid",
    paid: "Paid",
  };
  try {
    const snap = await getDocs(
      query(collection(db, "orders"), where("uid", "==", user.uid)),
    );
    const rows = snap.docs
      .map((d) => d.data())
      .sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      );
    if (!rows.length) return;
    list.innerHTML = rows
      .map(
        (o) =>
          `<li><span>${o.paystackRef}<small>${(o.items || []).map((i) => `${i.name} × ${i.qty}`).join(", ")}</small></span><span>${naira(o.total)}<small>${label[o.status] || o.status}</small></span></li>`,
      )
      .join("");
  } catch (e) {
    console.error(e);
  }
}
