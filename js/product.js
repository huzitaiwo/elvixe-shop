window.elvixe.whenReady(function () {
  const E = window.elvixe;
  const id = new URLSearchParams(location.search).get("id");
  const list = E.products || [];
  const p = list.find((x) => x.id === id);
  const root = document.getElementById("pdp");
  const todo = (label) => `<span class="todo">[TODO: ${label}]</span>`;
  const icon = (n) => `<svg aria-hidden="true"><use href="#i-${n}"/></svg>`;

  if (!p) {
    document.title = "Product not found — Elvixe";
    document.getElementById("crumb-name").textContent = "Not found";
    root.className = "pdp pdp--missing";
    root.innerHTML = `<div><h1>We couldn’t find that step.</h1><p>It may have moved, or the link is incomplete.</p>
      <a class="btn btn--dark" href="shop.html">Back to the edit ${icon("arrow")}</a></div>`;
    return;
  }

  document.title = `${p.name} — Elvixe`;
  document.querySelector('meta[name="description"]').content =
    `${p.name}: ${p.category}. ${p.tag}.`;
  document.getElementById("crumb-name").textContent = p.name;

  root.innerHTML = `
    <div class="pdp__img" style="--tint:${p.tint}">
      <img src="${p.image}" alt="${p.name}">
      <span class="pdp__badge">${icon("check")}In the edit</span>
      <span class="pdp__tag">${p.tag}</span>
    </div>
    <div class="pdp__info">
      <p class="eyebrow">${p.category}</p>
      <h1>${p.name}</h1>
      <p class="pdp__price">${p.price != null ? E.formatPrice(p.price) : todo("price in ₦")}${p.size ? `<span class="pdp__size">${p.size}</span>` : ""}</p>
      <div class="pdp__buy">
        <div class="qty">
          <button type="button" data-pq-minus aria-label="Decrease quantity">–</button>
          <output id="pq" aria-live="polite">1</output>
          <button type="button" data-pq-plus aria-label="Increase quantity">+</button>
        </div>
        <button class="btn btn--dark" id="pdp-add" data-add="${p.id}" data-qty="1">Build this step ${icon("arrow")}</button>
      </div>
      <p class="pdp__cap">Learn how this step fits your skin.</p>
      <div class="pdp__details">
        <details open><summary>Description</summary><p>${p.description || todo("description")}</p></details>
        <details><summary>How to use</summary><p>${p.howTo || todo("how to use")}</p></details>
        <details><summary>Ingredients</summary><p>${p.ingredients || todo("ingredients")}</p></details>
      </div>
    </div>`;

  // Quantity control. cart.js will read data-qty from the add button (default 1).
  let q = 1;
  const out = document.getElementById("pq");
  const add = document.getElementById("pdp-add");
  const set = (n) => {
    q = Math.min(10, Math.max(1, n));
    out.textContent = q;
    add.dataset.qty = q;
  };
  root.addEventListener("click", (e) => {
    if (e.target.closest("[data-pq-minus]")) set(q - 1);
    if (e.target.closest("[data-pq-plus]")) set(q + 1);
  });

  // More from the edit: catalog order, current product excluded
  const others = list.filter((x) => x.id !== p.id).slice(0, 3);
  if (others.length) {
    document.getElementById("more-grid").innerHTML = others
      .map(E.productCard)
      .join("");
    document.getElementById("more").hidden = false;
  }
});
