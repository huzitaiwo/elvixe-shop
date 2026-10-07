(function () {
  const grid = document.getElementById("shop-grid");
  const items = window.elvixe.products || [];
  grid.innerHTML = items.length
    ? items
        .map((p) => window.elvixe.productCard(p, { showPrice: true }))
        .join("")
    : '<p class="shop-grid__empty">New formulas are on their way.</p>';
})();
