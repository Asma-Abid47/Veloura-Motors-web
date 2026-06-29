/* =========================================================
   VELOURA MOTORS — DETAILS.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const layout = document.getElementById("detailsLayout");
  if (!layout) return;

  const params = new URLSearchParams(window.location.search);
  const car = getCarById(params.get("id"));

  if (!car){
    layout.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Vehicle not found. <a href="inventory.html">Browse inventory</a></div>`;
    return;
  }

  document.getElementById("pageTitle").textContent = `${car.brand} ${car.name} — Veloura Motors`;
  document.getElementById("breadcrumbName").textContent = `${car.brand} ${car.name}`;

  /* ---------------------------------------------------------
     MAIN LAYOUT: GALLERY + INFO
  --------------------------------------------------------- */
  layout.innerHTML = `
    <div class="details-gallery reveal">
      <div class="details-gallery__main" id="mainImgWrap">
        <img id="mainImg" src="${car.gallery[0]}" alt="${car.brand} ${car.name}">
      </div>
      ${car.gallery.length > 1 ? `
      <div class="details-gallery__thumbs">
        ${car.gallery.map((img, i) => `<img src="${img}" data-i="${i}" class="${i === 0 ? 'active' : ''}" alt="${car.brand} ${car.name} view ${i+1}">`).join('')}
      </div>` : ''}
    </div>

    <div class="details-info reveal reveal-delay-1">
      <p class="details-info__brand">${car.brand}</p>
      <h1>${car.name}</h1>
      <div class="details-info__rating">★★★★★ <span>(${car.rating} · verified buyer rating)</span></div>
      <p class="details-info__price">${formatPrice(car.price)}</p>
      <p class="details-info__desc">${car.desc}</p>

      <div class="details-info__actions">
        <button class="btn btn--gold" id="addToCartBtn"><span>Add to Cart</span></button>
        <button class="btn btn--glass" id="bookTestDriveBtn"><span>Book Test Drive</span></button>
        <button class="icon-btn-outline ${VeloraStore.isWishlisted(car.id) ? 'active' : ''}" id="wishBtn" aria-label="Toggle wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-9.3-8.8C1.2 8 2.4 5 5.6 4.4 8 4 10 5 12 7c2-2 4-3 6.4-2.6C21.6 5 22.8 8 21.3 11.2 19 15.5 12 20 12 20z"/></svg>
        </button>
        <button class="icon-btn-outline ${VeloraStore.getCompare().includes(car.id) ? 'active' : ''}" id="compareBtn" aria-label="Add to compare">
          <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h12M3 18h6"/></svg>
        </button>
      </div>

      <div class="details-quickspecs">
        <div><strong>${car.hp}</strong><span>Horsepower</span></div>
        <div><strong>${car.accel}s</strong><span>0–60 MPH</span></div>
        <div><strong>${car.topSpeed}</strong><span>Top Speed (MPH)</span></div>
      </div>
    </div>
  `;

  /* gallery thumbnails */
  layout.querySelectorAll(".details-gallery__thumbs img").forEach(thumb => {
    thumb.addEventListener("click", () => {
      document.getElementById("mainImg").src = car.gallery[thumb.dataset.i];
      layout.querySelectorAll(".details-gallery__thumbs img").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  /* ---------------------------------------------------------
     FIX: force-reveal the gallery/info block we just injected.
     common.js's IntersectionObserver was set up at page load,
     before this HTML existed, so it never "sees" these nodes.
     Without this, .reveal keeps opacity:0 forever and the page
     looks blank even though the data rendered correctly.
  --------------------------------------------------------- */
  requestAnimationFrame(() => {
    layout.querySelectorAll(".reveal").forEach(el => el.classList.add("revealed"));
  });
  /* image zoom on click */
  const mainImgWrap = document.getElementById("mainImgWrap");
  mainImgWrap.addEventListener("click", () => mainImgWrap.classList.toggle("zoomed"));

  /* add to cart */
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    VeloraStore.addToCart(car.id, 1);
    updateBadges();
    showToast(`${car.brand} ${car.name} added to cart`);
  });

  /* wishlist */
  const wishBtn = document.getElementById("wishBtn");
  wishBtn.addEventListener("click", () => {
    VeloraStore.toggleWishlist(car.id);
    wishBtn.classList.toggle("active");
    updateBadges();
    showToast(wishBtn.classList.contains("active") ? "Added to wishlist" : "Removed from wishlist");
  });

  /* compare */
  const compareBtn = document.getElementById("compareBtn");
  compareBtn.addEventListener("click", () => {
    const list = VeloraStore.toggleCompare(car.id);
    compareBtn.classList.toggle("active", list.includes(car.id));
    showToast(list.includes(car.id) ? "Added to compare" : "Removed from compare (max 4)");
  });

  /* ---------------------------------------------------------
     TABS CONTENT
  --------------------------------------------------------- */
  document.getElementById("detailsTabsSection").style.display = "block";

  document.getElementById("tab-overview").innerHTML = `<p>${car.desc}</p><p style="margin-top:16px;">Every Veloura acquisition includes a full provenance check, paint-depth inspection, and a 90-point mechanical certification before delivery.</p>`;

  document.getElementById("tab-performance").innerHTML = `
    <table class="specs-table">
      <tr><td>Horsepower</td><td>${car.hp} HP</td></tr>
      <tr><td>0–60 MPH</td><td>${car.accel} seconds</td></tr>
      <tr><td>Top Speed</td><td>${car.topSpeed} MPH</td></tr>
      <tr><td>Drive Type</td><td>${car.drive}</td></tr>
      <tr><td>Transmission</td><td>${car.transmission}</td></tr>
    </table>`;

  document.getElementById("tab-engine").innerHTML = `
    <table class="specs-table">
      <tr><td>Fuel Type</td><td>${car.fuel}</td></tr>
      <tr><td>Model Year</td><td>${car.year}</td></tr>
      <tr><td>Category</td><td>${categoryTitle(car.category)}</td></tr>
    </table>`;

  document.getElementById("tab-interior").innerHTML = `<p>Hand-stitched upholstery, configurable ambient lighting, and a cabin acoustically tuned to isolate road and wind noise — finished to ${car.brand}'s own bespoke standard.</p><table class="specs-table" style="margin-top:18px;"><tr><td>Seats</td><td>${car.seats}</td></tr></table>`;

  document.getElementById("tab-exterior").innerHTML = `<p>Available in a curated palette of exterior finishes, with forged wheel options and an active aerodynamics package fitted as standard on this configuration.</p>`;

  document.getElementById("tab-technology").innerHTML = `<p>Digital cockpit, adaptive driver-assist suite, and over-the-air software updates keep this vehicle current long after delivery day.</p>`;

  document.getElementById("tab-safety").innerHTML = `<p>Reinforced safety cell, multi-stage airbag system, and predictive collision mitigation come standard across the Veloura catalogue.</p>`;

  document.getElementById("tab-reviews").innerHTML = REVIEWS.map(r => `
    <div style="margin-bottom:22px;">
      <div class="stars" style="color:var(--gold);margin-bottom:8px;">★★★★★</div>
      <p style="font-style:italic;color:#ddd;margin-bottom:8px;">"${r.text}"</p>
      <strong style="font-size:13px;">${r.name}</strong> <span style="color:var(--gray);font-size:12px;">— ${r.role}</span>
    </div>
  `).join("");

  /* finance calculator */
  if (car.price > 0){
    document.getElementById("tab-finance").innerHTML = `
      <div class="finance-calc">
        <div class="finance-calc__row"><span>Vehicle Price</span><strong>${formatPrice(car.price)}</strong></div>
        <label style="font-size:12px;color:var(--gray);">Down Payment: <span id="downPaymentVal">20%</span></label>
        <input type="range" id="downPaymentRange" min="0" max="80" value="20">
        <label style="font-size:12px;color:var(--gray);">Loan Term: <span id="termVal">60 months</span></label>
        <input type="range" id="termRange" min="24" max="84" step="12" value="60">
        <label style="font-size:12px;color:var(--gray);">APR: <span id="aprVal">6.5%</span></label>
        <input type="range" id="aprRange" min="3" max="12" step="0.1" value="6.5">
        <div class="finance-calc__result"><span>Estimated Monthly Payment</span><strong id="monthlyPayment">$0</strong></div>
      </div>`;

    const downRange = document.getElementById("downPaymentRange");
    const termRange = document.getElementById("termRange");
    const aprRange = document.getElementById("aprRange");
    function calcFinance(){
      const downPct = Number(downRange.value);
      const months = Number(termRange.value);
      const apr = Number(aprRange.value);
      document.getElementById("downPaymentVal").textContent = downPct + "%";
      document.getElementById("termVal").textContent = months + " months";
      document.getElementById("aprVal").textContent = apr + "%";
      const principal = car.price * (1 - downPct / 100);
      const monthlyRate = (apr / 100) / 12;
      const payment = monthlyRate === 0 ? principal / months :
        (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
      document.getElementById("monthlyPayment").textContent = "$" + Math.round(payment).toLocaleString();
    }
    [downRange, termRange, aprRange].forEach(el => el.addEventListener("input", calcFinance));
    calcFinance();
  } else {
    document.getElementById("tab-finance").innerHTML = `<p>This vehicle is available by private inquiry only. Contact our concierge team for pricing and financing options.</p>`;
  }

  /* tab switching */
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".details-tabs__panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  /* ---------------------------------------------------------
     RELATED CARS
  --------------------------------------------------------- */
  const related = getRelatedCars(car, 4);
  document.getElementById("relatedGrid").innerHTML = related.map(c => carCardHTML(c, { actions: true })).join("");
  bindCarCardEvents(document.getElementById("relatedGrid"));

  /* ---------------------------------------------------------
     TEST DRIVE MODAL
  --------------------------------------------------------- */
  const testDriveOverlay = document.getElementById("testDriveOverlay");
  const testDriveClose = document.getElementById("testDriveClose");
  const testDriveForm = document.getElementById("testDriveForm");
  const testDriveSuccess = document.getElementById("testDriveSuccess");
  document.getElementById("testDriveCarName").textContent = `Schedule a private test drive of the ${car.brand} ${car.name} at your nearest Veloura showroom.`;

  document.getElementById("bookTestDriveBtn").addEventListener("click", () => {
    testDriveOverlay.classList.add("open");
    testDriveForm.style.display = "block";
    testDriveSuccess.classList.remove("show");
  });
  testDriveClose.addEventListener("click", () => testDriveOverlay.classList.remove("open"));
  testDriveOverlay.addEventListener("click", (e) => { if (e.target === testDriveOverlay) testDriveOverlay.classList.remove("open"); });

  document.getElementById("testDriveFormEl").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.querySelector('input[type="text"]').value || "there";
    document.getElementById("testDriveConfirmText").textContent =
      `Thank you, ${name} — your test drive of the ${car.brand} ${car.name} is confirmed. A confirmation email is on its way.`;
    testDriveForm.style.display = "none";
    testDriveSuccess.classList.add("show");
  });
  document.getElementById("testDriveDone").addEventListener("click", () => testDriveOverlay.classList.remove("open"));
});
