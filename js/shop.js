(function () {
  const grid = document.getElementById("shop-grid");
  const items = window.elvixe.products || [];
  grid.innerHTML = items.length
    ? items.map(window.elvixe.productCard).join("")
    : '<p class="shop-grid__empty">New formulas are on their way.</p>';
})();
