(function () {
  // Add your stores here. Fields: name, city, address, phone (optional), url (optional). Example shape:
  // { name: "Store name", city: "City", address: "Street, area", phone: "+234 ...", url: "https://..." }
  const STOCKISTS = [];

  const root = document.getElementById("stockists");
  if (!STOCKISTS.length) {
    root.innerHTML =
      '<p class="todo">[TODO: stockists: send store names, cities and addresses and I’ll fill this list]</p>';
    return;
  }

  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  const byCity = STOCKISTS.reduce(
    (acc, s) => ((acc[s.city] = acc[s.city] || []).push(s), acc),
    {},
  );

  root.innerHTML = Object.keys(byCity)
    .sort()
    .map(
      (city) => `
    <div class="scity">
      <h2>${esc(city)}</h2>
      <div class="sgrid">
        ${byCity[city]
          .map(
            (s) => `
          <article class="sitem">
            <h3>${esc(s.name)}</h3>
            <span>${esc(s.address)}</span>
            ${s.phone ? `<span>${esc(s.phone)}</span>` : ""}
            ${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">Visit website</a>` : ""}
          </article>`,
          )
          .join("")}
      </div>
    </div>`,
    )
    .join("");
})();
