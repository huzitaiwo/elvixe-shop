import { auth, db } from "./firebase-config.js";
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const PAYSTACK_PUBLIC_KEY = "pk_test_df57d67f96afeb66a6085ba068a04d176a2addba";
const DELIVERY_FEE = 3500; // ₦
const FREE_DELIVERY_OVER = 50000; // ₦

const E = window.elvixe;
const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

const STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];
$("k-state").insertAdjacentHTML(
  "beforeend",
  STATES.map((s) => `<option>${s}</option>`).join(""),
);

let user = null;
onAuthStateChanged(auth, (u) => {
  user = u;
  if (u) {
    if (!$("k-email").value && u.email) $("k-email").value = u.email;
    if (!$("k-name").value && u.displayName) $("k-name").value = u.displayName;
  }
});

function totals() {
  const subtotal = E.cart.subtotal();
  const delivery = subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  return { subtotal, delivery, total: subtotal + delivery };
}

function render() {
  const items = E.cart.get();
  $("k-grid").hidden = !items.length;
  $("k-empty").hidden = !!items.length;
  if (!items.length) return;

  const t = totals();
  $("k-items").innerHTML = items
    .map(
      (i) => `
    <li>
      <span class="ksum__img" style="--tint:${esc(i.tint || "#d4c9b8")}"><img src="${esc(i.image)}" alt=""></span>
      <span class="ksum__name">${esc(i.name)}<span class="ksum__qty">Qty ${i.qty}</span></span>
      <span class="ksum__price">${E.formatPrice(i.qty * i.price)}</span>
    </li>`,
    )
    .join("");
  $("k-sub").textContent = E.formatPrice(t.subtotal);
  $("k-del").textContent = t.delivery ? E.formatPrice(t.delivery) : "Free";
  $("k-total").textContent = E.formatPrice(t.total);
  $("k-free").textContent = t.delivery
    ? `Free delivery on orders of ${E.formatPrice(FREE_DELIVERY_OVER)} or more.`
    : "Your delivery is free.";
  $("k-pay").firstChild.textContent = `Pay ${E.formatPrice(t.total)} `;
}
document.addEventListener("cart:change", render);
E.whenReady(render);

const err = (msg) => {
  $("k-err").textContent = msg || "";
};
const bad = (name, on) =>
  document
    .querySelector(`[name="${name}"]`)
    .closest(".field")
    .classList.toggle("is-invalid", on);

$("k-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  err("");
  if (!E.ready)
    return err(
      "Still loading the latest prices. Please try again in a moment.",
    );
  const f = e.currentTarget,
    btn = $("k-pay");
  const v = Object.fromEntries(
    ["email", "name", "phone", "address", "city", "state", "notes"].map((k) => [
      k,
      f[k].value.trim(),
    ]),
  );

  const checks = {
    email: /^\S+@\S+\.\S+$/.test(v.email),
    name: !!v.name,
    phone: /^[+\d][\d\s-]{8,}$/.test(v.phone),
    address: !!v.address,
    city: !!v.city,
    state: !!v.state,
  };
  Object.entries(checks).forEach(([k, ok]) => bad(k, !ok));
  if (Object.values(checks).includes(false))
    return err("Please check the highlighted fields.");

  const items = E.cart.get();
  if (!items.length) return err("Your bag is empty.");
  if (items.some((i) => i.price == null))
    return err("An item in your bag has no price yet.");
  if (PAYSTACK_PUBLIC_KEY.includes("REPLACE_ME"))
    return err("Add your Paystack public key at the top of js/checkout.js.");
  if (typeof PaystackPop === "undefined")
    return err(
      "The payment window couldn’t load. Check your connection or ad blocker and try again.",
    );

  const t = totals();
  const ref =
    "ELX-" +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase();
  const orderRef = doc(db, "orders", ref);
  const order = {
    uid: user ? user.uid : null,
    email: v.email,
    name: v.name,
    phone: v.phone,
    address: v.address,
    city: v.city,
    state: v.state,
    notes: v.notes,
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
    })),
    subtotal: t.subtotal,
    delivery: t.delivery,
    total: t.total,
    currency: "NGN",
    status: "pending",
    paystackRef: ref,
    createdAt: serverTimestamp(),
  };

  btn.disabled = true;
  try {
    await setDoc(orderRef, order);
  } catch (ex) {
    console.error(ex);
    btn.disabled = false;
    return err("We couldn’t start your order. Please try again.");
  }

  const summary = {
    ref,
    name: v.name,
    email: v.email,
    address: v.address,
    city: v.city,
    state: v.state,
    items: order.items,
    subtotal: t.subtotal,
    delivery: t.delivery,
    total: t.total,
  };

  PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: v.email,
    amount: t.total * 100, // kobo
    currency: "NGN",
    ref,
    metadata: {
      custom_fields: [
        { display_name: "Order", variable_name: "order_ref", value: ref },
      ],
    },
    callback: function () {
      onPaid(orderRef, summary);
    },
    onClose: function () {
      btn.disabled = false;
      err("Payment window closed. Your bag is still here.");
    },
  }).openIframe();
});

async function onPaid(orderRef, summary) {
  try {
    await updateDoc(orderRef, { status: "paid_unverified" });
  } catch (ex) {
    console.error(
      "Paid, but status update failed. Reconcile via the Paystack dashboard:",
      summary.ref,
      ex,
    );
  }
  try {
    sessionStorage.setItem("elvixe_last_order", JSON.stringify(summary));
  } catch {}
  E.cart.clear();
  location.href = "order.html";
}
