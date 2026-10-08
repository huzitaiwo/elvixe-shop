(function () {
  const E = (window.elvixe = window.elvixe || {});

  E.products = [
    {
      id: "velvet-cleanse",
      name: "Velvet Cleanse",
      category: "Cream cleanser",
      tag: "A considered first step",
      tint: "#8c5e36",
      image: "assets/images/products/velvet-cleanse.jpg",
      price: 12500,
    },
    {
      id: "daylight-serum",
      name: "Daylight Serum",
      category: "Vitamin C + niacinamide",
      tag: "Brighten, then breathe",
      tint: "#e2c4ad",
      image: "assets/images/products/daylight-serum.jpg",
      price: 22000,
    },
    {
      id: "sola-veil",
      name: "Sola Veil",
      category: "Daily skin shield",
      tag: "Weightless by design",
      tint: "#d4c9b8",
      image: "assets/images/products/sola-veil.jpg",
      price: 18500,
    },
    {
      id: "morrow-cream",
      name: "Morrow Cream",
      category: "Barrier support",
      tag: "For the hours ahead",
      tint: "#c19e73",
      image: "assets/images/products/morrow-cream.jpg",
      price: 24500,
    },
  ];

  // Set true by catalog.js once Firestore has answered (or failed, in which case the list above is used)
  E.ready = false;
  E.whenReady = (fn) =>
    E.ready
      ? fn()
      : document.addEventListener("catalog:ready", fn, { once: true });

  const icon = (id) => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;

  E.productCard = (p, opts) => `
    <article class="pcard">
      <a class="pcard__img" href="product.html?id=${p.id}" style="--tint:${p.tint}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="pcard__badge">${icon("check")}In the edit</span>
        <span class="pcard__side">Elvixe / Daily care</span>
        <span class="pcard__tag">${p.tag}</span>
      </a>
      <div class="pcard__body">
        <span class="pcard__cat">${p.category}</span>
        <h3 class="pcard__name">${p.name}</h3>
        ${opts && opts.showPrice === true && p.price != null ? `<span class="pcard__price">${E.formatPrice(p.price)}</span>` : ""}
        <button class="btn btn--dark" data-add="${p.id}">Build this step ${icon("arrow")}</button>
        <p class="pcard__cap">Learn how this step fits your skin.</p>
      </div>
    </article>`;
})();
