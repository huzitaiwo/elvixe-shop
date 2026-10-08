window.elvixe.whenReady(function () {
  const E = window.elvixe;
  const todo = (t) => `<span class="todo">[TODO: ${t}]</span>`;
  const icon = (n) => `<svg aria-hidden="true"><use href="#i-${n}"/></svg>`;

  // Titles and subtitles are the six steps from the home page.
  // productId is MY suggested pairing, not from the reference: change or remove freely.
  const STEPS = [
    {
      n: "01",
      title: "Begin with a gentle cleanse",
      sub: "Make space for a fresh start.",
      productId: "velvet-cleanse",
    },
    {
      n: "02",
      title: "Target what needs attention",
      sub: "Choose one active, thoughtfully.",
      productId: null,
    },
    {
      n: "03",
      title: "Bring in brightening care",
      sub: "Vitamin C in the morning light.",
      productId: "daylight-serum",
    },
    {
      n: "04",
      title: "Let your skin rest",
      sub: "Nourish with botanical comfort.",
      productId: null,
    },
    {
      n: "05",
      title: "Seal in the softness",
      sub: "Moisturise without heaviness.",
      productId: "morrow-cream",
    },
    {
      n: "06",
      title: "Come back tomorrow",
      sub: "Consistency, not intensity.",
      productId: null,
    },
  ];

  const byId = Object.fromEntries((E.products || []).map((p) => [p.id, p]));

  document.getElementById("rlist").innerHTML = STEPS.map((s) => {
    const p = s.productId && byId[s.productId];
    const side = p
      ? `<div class="rprod">
           <span class="rprod__cat">${p.category}</span>
           <a class="rprod__name" href="product.html?id=${p.id}">${p.name}</a>
           <button class="btn btn--dark" data-add="${p.id}">Build this step ${icon("arrow")}</button>
         </div>`
      : `<div class="rprod rprod--none">${todo("product for this step")}</div>`;
    return `<li class="rrow">
      <span class="rrow__n">${s.n}</span>
      <div><h2>${s.title}</h2><p class="rrow__sub">${s.sub}</p><p class="rrow__more">${todo("short guidance for this step")}</p></div>
      ${side}
    </li>`;
  }).join("");
});
