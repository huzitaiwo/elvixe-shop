(function () {
  const $ = (id) => document.getElementById(id);
  const parts = {
    menu: () => [$("mobile-nav")],
    cart: () => [$("cart-drawer"), $("overlay")],
  };
  function setOpen(name, open) {
    (parts[name]?.() || []).forEach(
      (el) => el && el.classList.toggle("is-open", open),
    );
    if (name === "menu")
      document
        .querySelector('[data-open="menu"]')
        ?.setAttribute("aria-expanded", open);
    const anyOpen = document.querySelector(
      ".mobile-nav.is-open, .drawer.is-open",
    );
    document.body.classList.toggle("is-locked", !!anyOpen);
  }
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open]");
    if (opener) return setOpen(opener.dataset.open, true);
    const closer = e.target.closest("[data-close]");
    if (closer) {
      const t = closer.dataset.close;
      (t === "all" ? ["menu", "cart"] : [t]).forEach((n) => setOpen(n, false));
    }
    if (e.target.closest(".mobile-nav a")) setOpen("menu", false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") ["menu", "cart"].forEach((n) => setOpen(n, false));
  });
  window.elvixe = Object.assign(window.elvixe || {}, {
    openCart: () => setOpen("cart", true),
  });
})();
