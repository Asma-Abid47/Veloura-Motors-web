/* =========================================================
   VELOURA MOTORS — HOME.JS
   Homepage-only logic: car data, featured/arrivals/limited
   grids, categories, reviews slider, hero subtitle, video
   fallback wiring.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     HERO SUBTITLE TYPEWRITER
  --------------------------------------------------------- */
  const subtitleEl = document.getElementById("heroSubtitle");
  if (subtitleEl){
    const phrase = "Where automotive obsession meets uncompromising craft. Welcome to the showroom built for those who refuse the ordinary.";
    let i = 0;
    setTimeout(function type(){
      if (i <= phrase.length){
        subtitleEl.textContent = phrase.slice(0, i);
        i++;
        setTimeout(type, 14);
      }
    }, 700);
  }

  /* ---------------------------------------------------------
     HERO + ELECTRIC VIDEO FALLBACKS
  --------------------------------------------------------- */
  const heroMedia = document.querySelector(".hero__media");
  const heroVideo = document.getElementById("heroVideo");
  attachVideoFallback(heroMedia, heroVideo);

  const electricSection = document.getElementById("electric");
  const electricVideo = electricSection ? electricSection.querySelector(".electric__video") : null;
  if (electricSection && electricVideo){
    const fail = () => electricSection.classList.add("video-failed");
    electricVideo.addEventListener("error", fail);
    const p = electricVideo.play();
    if (p !== undefined) p.catch(fail);
    setTimeout(() => { if (electricVideo.readyState === 0) fail(); }, 3000);
  }

  /* ---------------------------------------------------------
     FEATURED COLLECTION
  --------------------------------------------------------- */
  const featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid){
    const featured = CARS.slice(0, 6);
    featuredGrid.innerHTML = featured.map(carCardHTML).join("");
    bindCarCardEvents(featuredGrid);
  }

  /* ---------------------------------------------------------
     CATEGORIES
  --------------------------------------------------------- */
  const categoriesGrid = document.getElementById("categoriesGrid");
  if (categoriesGrid){
    categoriesGrid.innerHTML = CATEGORIES.map((c, i) => `
      <a class="category-tile reveal reveal-delay-${(i % 4) + 1}" href="inventory.html?cat=${c.key}">
        <img src="${c.img}" alt="${c.title}" loading="lazy">
        <div class="category-tile__label">
          <h3>${c.title}</h3>
          <span>Browse Now →</span>
        </div>
      </a>
    `).join("");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){ entry.target.classList.add("revealed"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    categoriesGrid.querySelectorAll(".reveal").forEach(el => obs.observe(el));
  }

  /* ---------------------------------------------------------
     NEWEST ARRIVALS SLIDER
  --------------------------------------------------------- */
  const arrivalsTrack = document.getElementById("arrivalsTrack");
  if (arrivalsTrack){
    const arrivals = [...CARS].reverse().slice(0, 8);
    arrivalsTrack.innerHTML = arrivals.map(carCardHTML).join("");
    bindCarCardEvents(arrivalsTrack);

    const prevBtn = document.getElementById("arrivalsPrev");
    const nextBtn = document.getElementById("arrivalsNext");
    const scrollAmt = () => arrivalsTrack.clientWidth * 0.7;
    prevBtn.addEventListener("click", () => arrivalsTrack.scrollBy({ left: -scrollAmt(), behavior: "smooth" }));
    nextBtn.addEventListener("click", () => arrivalsTrack.scrollBy({ left: scrollAmt(), behavior: "smooth" }));
  }

  /* ---------------------------------------------------------
     LIMITED EDITIONS
  --------------------------------------------------------- */
  const limitedGrid = document.getElementById("limitedGrid");
  if (limitedGrid){
    const limited = CARS.filter(c => ["Limited Edition", "Collectors Edition", "Concept"].includes(c.tag)).slice(0, 3);
    const fallbackPool = CARS.slice(0, 3);
    const items = limited.length ? limited : fallbackPool;
    limitedGrid.innerHTML = items.map((c, i) => `
      <div class="limited-card reveal reveal-delay-${i + 1}">
        <img src="${c.image}" alt="${c.brand} ${c.name}" loading="lazy">
        <div class="limited-card__body">
          <span class="limited-card__edition">${c.tag}</span>
          <h3>${c.brand} ${c.name}</h3>
          <span>${formatPrice(c.price)} · ${c.hp} HP</span>
        </div>
      </div>
    `).join("");
    if (window.enableTilt && window.matchMedia("(pointer:fine)").matches){
      limitedGrid.querySelectorAll(".limited-card").forEach(window.enableTilt);
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){ entry.target.classList.add("revealed"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    limitedGrid.querySelectorAll(".reveal").forEach(el => obs.observe(el));
  }

  /* ---------------------------------------------------------
     REVIEWS SLIDER (auto-rotate + dots)
  --------------------------------------------------------- */
  const reviewsTrack = document.getElementById("reviewsTrack");
  const reviewsDots = document.getElementById("reviewsDots");
  if (reviewsTrack && reviewsDots){
    reviewsTrack.innerHTML = REVIEWS.map(r => `
      <div class="review-card">
        <div class="stars">★★★★★</div>
        <p>"${r.text}"</p>
        <div class="review-card__author">
          <img src="${r.avatar}" alt="${r.name}">
          <div style="text-align:left;">
            <strong>${r.name}</strong>
            <span>${r.role}</span>
          </div>
        </div>
      </div>
    `).join("");
    reviewsDots.innerHTML = REVIEWS.map((_, i) => `<button data-i="${i}" class="${i === 0 ? 'active' : ''}" aria-label="Review ${i+1}"></button>`).join("");

    let current = 0;
    function goTo(i){
      current = i;
      reviewsTrack.style.transform = `translateX(-${i * 100}%)`;
      reviewsDots.querySelectorAll("button").forEach((b, idx) => b.classList.toggle("active", idx === i));
    }
    reviewsDots.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => goTo(Number(b.dataset.i)));
    });
    setInterval(() => goTo((current + 1) % REVIEWS.length), 5500);
  }

});
