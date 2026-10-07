(function () {
  const E = (window.elvixe = window.elvixe || {});
  const KEY = "elvixe_cart_v1";
  const MAX_QTY = 10;

  E.formatPrice = (n) => "₦" + Number(n).toLocaleString("en-NG");

  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  const find = (id) => (E.products || []).find((p) => p.id === id);

  const load = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  };
  let items = load();
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable: cart lives for this page only */
    }
  };

  // Keep names/prices in step with the catalog whenever it is loaded on the page
  function hydrate() {
    if (!(E.products || []).length) return;
    items = items
      .filter((i) => find(i.id))
      .map((i) => {
        const p = find(i.id);
        return {
          ...i,
          name: p.name,
          category: p.category,
          price: p.price,
          image: p.image,
          tint: p.tint,
        };
      });
  }

  const count = () => items.reduce((n, i) => n + i.qty, 0);
  const subtotal = () => items.reduce((n, i) => n + i.qty * (i.price || 0), 0);

  function commit() {
    save();
    render();
    document.dispatchEvent(
      new CustomEvent("cart:change", {
        detail: { items, count: count(), subtotal: subtotal() },
      }),
    );
  }

  function add(id, qty = 1) {
    const p = find(id);
    const line = items.find((i) => i.id === id);
    if (!p && !line) return false;
    if (p && p.price == null) {
      console.warn(`"${id}" has no price yet, so it can't be added.`);
      return false;
    }
    if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
    else
      items.push({
        id,
        qty: Math.min(MAX_QTY, qty),
        name: p.name,
        category: p.category,
        price: p.price,
        image: p.image,
        tint: p.tint,
      });
    commit();
    return true;
  }
  function setQty(id, qty) {
    const line = items.find((i) => i.id === id);
    if (!line) return;
    line.qty = Math.min(MAX_QTY, Math.max(1, qty));
    commit();
  }
  function remove(id) {
    items = items.filter((i) => i.id !== id);
    commit();
  }
  function clear() {
    items = [];
    commit();
  }

  function render() {
    hydrate();
    const n = count();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.dataset.count = n;
    });

    const list = document.getElementById("cart-items");
    if (list) {
      list.innerHTML = items.length
        ? `<ul>${items
            .map(
              (i) => `
            <li class="citem">
              <a class="citem__img" href="product.html?id=${esc(i.id)}" style="--tint:${esc(i.tint || "#d4c9b8")}"><img src="${esc(i.image)}" alt=""></a>
              <div class="citem__info">
                <a class="citem__name" href="product.html?id=${esc(i.id)}">${esc(i.name)}</a>
                <span class="citem__cat">${esc(i.category)}</span>
                <div class="citem__row">
                  <div class="cqty">
                    <button type="button" data-qty-minus="${esc(i.id)}" aria-label="Decrease quantity of ${esc(i.name)}">–</button>
                    <output>${i.qty}</output>
                    <button type="button" data-qty-plus="${esc(i.id)}" aria-label="Increase quantity of ${esc(i.name)}">+</button>
                  </div>
                  <span class="citem__price">${E.formatPrice(i.qty * i.price)}</span>
                </div>
              </div>
              <button type="button" class="citem__rm" data-remove="${esc(i.id)}" aria-label="Remove ${esc(i.name)}">×</button>
            </li>`,
            )
            .join("")}</ul>`
        : '<p class="drawer__empty">Your bag is empty.</p>';
    }
    const sub = document.getElementById("cart-subtotal");
    if (sub) sub.textContent = E.formatPrice(subtotal());
    const checkout = document.querySelector(".drawer__foot .btn");
    if (checkout)
      checkout.setAttribute("aria-disabled", items.length ? "false" : "true");
  }

  // One document-level listener handles buttons that are rendered later
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-add]");
    if (a) {
      e.preventDefault();
      const qty = parseInt(a.dataset.qty || "1", 10) || 1;
      if (add(a.dataset.add, qty) && E.openCart) E.openCart();
      return;
    }
    const minus = e.target.closest("[data-qty-minus]");
    if (minus) {
      const l = items.find((i) => i.id === minus.dataset.qtyMinus);
      if (l) setQty(l.id, l.qty - 1);
      return;
    }
    const plus = e.target.closest("[data-qty-plus]");
    if (plus) {
      const l = items.find((i) => i.id === plus.dataset.qtyPlus);
      if (l) setQty(l.id, l.qty + 1);
      return;
    }
    const rm = e.target.closest("[data-remove]");
    if (rm) remove(rm.dataset.remove);
  });

  // Keep several open tabs in step
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      items = load();
      render();
    }
  });

  E.cart = {
    get: () => items.map((i) => ({ ...i })),
    add,
    setQty,
    remove,
    clear,
    count,
    subtotal,
  };
  render();
})();
