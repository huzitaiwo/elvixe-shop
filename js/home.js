(function () {
  // TODO: prices (₦) — the reference cards don't show prices, so none are invented here
  const PRODUCTS = [
    {
      id: "velvet-cleanse",
      name: "Velvet Cleanse",
      category: "Cream cleanser",
      tag: "A considered first step",
      tint: "#8c5e36",
      image: "assets/images/products/velvet-cleanse.jpg",
      price: null,
    },
    {
      id: "daylight-serum",
      name: "Daylight Serum",
      category: "Vitamin C + niacinamide",
      tag: "Brighten, then breathe",
      tint: "#e2c4ad",
      image: "assets/images/products/daylight-serum.jpg",
      price: null,
    },
    {
      id: "sola-veil",
      name: "Sola Veil",
      category: "Daily skin shield",
      tag: "Weightless by design",
      tint: "#d4c9b8",
      image: "assets/images/products/sola-veil.jpg",
      price: null,
    },
    {
      id: "morrow-cream",
      name: "Morrow Cream",
      category: "Barrier support",
      tag: "For the hours ahead",
      tint: "#c19e73",
      image: "assets/images/products/morrow-cream.jpg",
      price: null,
    },
  ];
  const STEPS = [
    ["01", "Begin with a gentle cleanse", "Make space for a fresh start."],
    ["02", "Target what needs attention", "Choose one active, thoughtfully."],
    ["03", "Bring in brightening care", "Vitamin C in the morning light."],
    ["04", "Let your skin rest", "Nourish with botanical comfort."],
    ["05", "Seal in the softness", "Moisturise without heaviness."],
    ["06", "Come back tomorrow", "Consistency, not intensity."],
  ];
  const icon = (id) => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;

  // Carousel
  const track = document.getElementById("edit-track");
  track.innerHTML = PRODUCTS.map(
    (p) => `
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
        <button class="btn btn--dark" data-add="${p.id}">Build this step ${icon("arrow")}</button>
        <p class="pcard__cap">Learn how this step fits your skin.</p>
      </div>
    </article>`,
  ).join("");

  const prev = document.querySelector("[data-edit-prev]");
  const next = document.querySelector("[data-edit-next]");
  const step = () => (track.querySelector(".pcard")?.offsetWidth || 240) + 12;
  const sync = () => {
    prev.disabled = track.scrollLeft < 4;
    next.disabled =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  prev.addEventListener("click", () =>
    track.scrollBy({ left: -step(), behavior: "smooth" }),
  );
  next.addEventListener("click", () =>
    track.scrollBy({ left: step(), behavior: "smooth" }),
  );
  track.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  sync();

  // Routine steps
  const list = document.getElementById("routine-steps");
  list.innerHTML = STEPS.map(([n, t, s], i) => {
    const cls = [
      "rstep",
      i === 0 ? "rstep--hero" : "",
      i === 3 ? "rstep--wide is-active" : "",
    ]
      .join(" ")
      .trim();
    return `<li class="${cls}" tabindex="0">
      <span class="rstep__n">${n}</span><h3>${t}</h3><p>${s}</p>
      ${i === 0 ? '<span class="rstep__mark" aria-hidden="true">Ritual</span>' : ""}
      <span class="rstep__plus">${icon(i === 3 ? "dots" : "plus")}</span></li>`;
  }).join("");
  const items = [...list.children];
  const activate = (el) => {
    items.forEach((x) => x.classList.toggle("is-active", x === el));
  };
  items.forEach((el) => {
    el.addEventListener("click", () => activate(el));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(el);
      }
    });
  });
})();
