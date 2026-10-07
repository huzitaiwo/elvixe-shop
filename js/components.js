(function () {
  const LINKS = {
    primary: [
      ["Home", "index.html", "home"],
      ["Routines", "routines.html", "routines"],
      ["The edit", "shop.html", "shop"],
    ],
    secondary: [
      ["Our approach", "approach.html", "approach"],
      ["Contact", "contact.html", "contact"],
    ],
    mobile: [
      ["Home", "index.html", "home"],
      ["The edit", "shop.html", "shop"],
      ["Routines", "routines.html", "routines"],
      ["Our approach", "approach.html", "approach"],
      ["Journal", "journal.html", "journal"],
      ["Stockists", "stockists.html", "stockists"],
      ["Contact", "contact.html", "contact"],
      ["Account", "account.html", "account"],
    ],
  };
  const page = document.body.dataset.page;
  const link = ([label, href, key]) =>
    `<a href="${href}"${key === page ? ' aria-current="page"' : ""}>${label}</a>`;
  const li = (l) => `<li>${link(l)}</li>`;
  const icon = (id) => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;

  const SPRITE = `
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
    <symbol id="i-mark" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1l3.2 7.8L23 12l-7.8 3.2L12 23l-3.2-7.8L1 12l7.8-3.2z"/><circle cx="12" cy="12" r="2.6" fill="var(--mark-hole, #20140b)"/></symbol>
    <symbol id="i-bag" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M5 8h14l1 12H4L5 8zM9 8a3 3 0 016 0"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 8h16M4 16h16"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M6 6l12 12M18 6L6 18"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M7 17L17 7M8 7h9v9"/></symbol>
    <symbol id="i-arrow-right" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 12h16M14 6l6 6-6 6"/></symbol>
    <symbol id="i-chevron" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M6 9l6 6 6-6"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 5v14M5 12h14"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M5 12.5l4.5 4.5L19 7"/></symbol>
    <symbol id="i-dots" viewBox="0 0 24 24"><g fill="currentColor"><circle cx="8" cy="8" r="1.6"/><circle cx="16" cy="8" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="8" cy="16" r="1.6"/><circle cx="16" cy="16" r="1.6"/></g></symbol>
  </svg>`;

  const HEADER = `
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="logo" href="index.html" aria-label="Elvixe home">
        <svg class="logo__mark" style="--mark-hole:transparent" aria-hidden="true"><use href="#i-mark"/></svg>
        <span class="logo__word">Elvixe</span>
      </a>
      <nav class="nav nav--primary" aria-label="Primary">${LINKS.primary.map(link).join("")}</nav>
      <div class="header-actions">
        <nav class="nav" aria-label="Secondary">${LINKS.secondary.map(link).join("")}</nav>
        <button class="icon-btn" data-open="cart" aria-label="Open bag">
          ${icon("bag")}<span class="cart-count" data-cart-count data-count="0">0</span>
        </button>
        <button class="menu-toggle" data-open="menu" aria-label="Open menu" aria-expanded="false">${icon("menu")}</button>
      </div>
    </div>
  </header>

  <div class="mobile-nav" id="mobile-nav" aria-label="Menu">
    <div class="mobile-nav__top">
      <a class="logo" href="index.html"><svg class="logo__mark" style="--mark-hole:transparent" aria-hidden="true"><use href="#i-mark"/></svg><span class="logo__word">Elvixe</span></a>
      <button class="menu-toggle" style="display:inline-grid" data-close="menu" aria-label="Close menu">${icon("close")}</button>
    </div>
    <ul>${LINKS.mobile.map(li).join("")}</ul>
  </div>

  <div class="overlay" id="overlay" data-close="all"></div>
  <aside class="drawer" id="cart-drawer" aria-label="Your bag">
    <div class="drawer__head">
      <h2>Your bag</h2>
      <button class="icon-btn" data-close="cart" aria-label="Close bag">${icon("close")}</button>
    </div>
    <div class="drawer__body" id="cart-items"><p class="drawer__empty">Your bag is empty.</p></div>
    <div class="drawer__foot">
      <div class="drawer__row"><span>Subtotal</span><span id="cart-subtotal">₦0</span></div>
      <a class="btn btn--dark btn--block" href="checkout.html">Checkout ${icon("arrow")}</a>
      <a class="drawer__account" href="account.html">Sign in or view your account</a>
    </div>
  </aside>`;

  const FOOTER = `
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <a class="logo__mark-ring" href="index.html" aria-label="Elvixe home"><svg style="--mark-hole:transparent" aria-hidden="true"><use href="#i-mark"/></svg></a>
          <p class="site-footer__tag">Thoughtful skincare for the life your skin is already living.</p>
        </div>
        <div><h3>Explore</h3><ul>
          <li><a href="shop.html">The edit</a></li><li><a href="routines.html">Routines</a></li><li><a href="approach.html">Our approach</a></li>
        </ul></div>
        <div><h3>Find us</h3><ul>
          <li><a href="contact.html">Contact</a></li><li><a href="stockists.html">Stockists</a></li><li><a href="journal.html">Journal</a></li>
        </ul></div>
        <form class="newsletter" data-newsletter novalidate>
          <h3>Notes from Elvixe</h3>
          <p>Occasional, considered updates from the studio.</p>
          <div class="newsletter__field">
            <label class="visually-hidden" for="nl-email">Email address</label>
            <input id="nl-email" type="email" name="email" placeholder="Your email address" autocomplete="email" required>
            <button type="submit" aria-label="Subscribe">${icon("arrow-right")}</button>
          </div>
          <p class="newsletter__msg" role="status"></p>
        </form>
      </div>
      <div class="outline-word site-footer__word" aria-hidden="true">Elvixe</div>
      <div class="site-footer__bar">
        <span>© 2026 Elvixe. All rights reserved.</span>
        <nav class="site-footer__legal" aria-label="Legal">
          <a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="accessibility.html">Accessibility</a>
        </nav>
        <span class="lang">EN ${icon("chevron")}</span>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML("afterbegin", SPRITE);
  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.innerHTML = HEADER;
  if (f) f.innerHTML = FOOTER;
})();
