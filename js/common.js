/* =========================================================
   VELOURA MOTORS — COMMON.JS
   Shared across every page: loader, navbar, menu, search,
   cursor glow, magnetic buttons, tilt, reveal, parallax,
   back-to-top, toast, counters, localStorage helpers.
========================================================= */

/* ---------------------------------------------------------
   LOCALSTORAGE — WISHLIST & CART (shared store, page-agnostic)
--------------------------------------------------------- */
const VeloraStore = (() => {
  const CART_KEY = "veloura_cart";
  const WISH_KEY = "veloura_wishlist";

  function read(key){ try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e){ return []; } }
  function write(key, data){ localStorage.setItem(key, JSON.stringify(data)); }

  function getCart(){ return read(CART_KEY); }
  function addToCart(id, qty = 1){
    const cart = getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, qty });
    write(CART_KEY, cart);
    return cart;
  }
  function removeFromCart(id){
    write(CART_KEY, getCart().filter(i => i.id !== id));
  }
  function updateCartQty(id, qty){
    let cart = getCart();
    if (qty <= 0){ cart = cart.filter(i => i.id !== id); }
    else {
      const item = cart.find(i => i.id === id);
      if (item) item.qty = qty;
    }
    write(CART_KEY, cart);
    return cart;
  }
  function clearCart(){ write(CART_KEY, []); }
  function cartCount(){ return getCart().reduce((s,i) => s + i.qty, 0); }
  function cartTotal(){
    return getCart().reduce((sum, i) => {
      const car = (typeof getCarById === "function") ? getCarById(i.id) : null;
      return car ? sum + car.price * i.qty : sum;
    }, 0);
  }

  function getWishlist(){ return read(WISH_KEY); }
  function toggleWishlist(id){
    let list = getWishlist();
    if (list.includes(id)) list = list.filter(i => i !== id);
    else list.push(id);
    write(WISH_KEY, list);
    return list;
  }
  function isWishlisted(id){ return getWishlist().includes(id); }

  const COMPARE_KEY = "veloura_compare";
  function getCompare(){ return read(COMPARE_KEY); }
  function toggleCompare(id){
    let list = getCompare();
    if (list.includes(id)) list = list.filter(i => i !== id);
    else if (list.length < 4) list.push(id);
    write(COMPARE_KEY, list);
    return list;
  }
  function removeFromCompare(id){
    write(COMPARE_KEY, getCompare().filter(i => i !== id));
  }
  function clearCompare(){ write(COMPARE_KEY, []); }

  return { getCart, addToCart, removeFromCart, updateCartQty, clearCart, cartCount, cartTotal, getWishlist, toggleWishlist, isWishlisted,
    getCompare, toggleCompare, removeFromCompare, clearCompare };
})();

/* ---------------------------------------------------------
   TOAST NOTIFICATIONS
--------------------------------------------------------- */
function showToast(message){
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 2600);
}

/* ---------------------------------------------------------
   BADGE UPDATES
--------------------------------------------------------- */
function updateBadges(){
  const cartEl = document.getElementById("cartCount");
  const wishEl = document.getElementById("wishCount");
  if (cartEl) cartEl.textContent = VeloraStore.cartCount();
  if (wishEl) wishEl.textContent = VeloraStore.getWishlist().length;
}

/* ---------------------------------------------------------
   VIDEO FALLBACK HELPER
   Attach to any wrapper containing a <video> + sibling fallback.
   Adds "video-failed" class to wrapperEl if playback/load fails.
--------------------------------------------------------- */
function attachVideoFallback(wrapperEl, videoEl){
  if (!wrapperEl || !videoEl) return;
  const fail = () => wrapperEl.classList.add("video-failed");
  videoEl.addEventListener("error", fail);
  const p = videoEl.play();
  if (p !== undefined) p.catch(fail);
  setTimeout(() => { if (videoEl.readyState === 0) fail(); }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     LOADING SCREEN
  --------------------------------------------------------- */
  const loader = document.getElementById("loader");
  const loaderProgress = document.getElementById("loaderProgress");
  if (loader){
    let progress = 0;
    const tick = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100){
        progress = 100;
        clearInterval(tick);
        if (loaderProgress) loaderProgress.style.width = "100%";
        setTimeout(() => loader.classList.add("hidden"), 350);
      } else if (loaderProgress){
        loaderProgress.style.width = progress + "%";
      }
    }, 140);
    /* hard fail-safe: never block the site for more than 2.5s */
    setTimeout(() => loader.classList.add("hidden"), 2500);
  }

  updateBadges();

  /* ---------------------------------------------------------
     ACTIVE NAV HIGHLIGHT (pages using data-nav attributes)
  --------------------------------------------------------- */
  const currentPage = (window.location.pathname.split("/").pop() || "index.html").replace(".html", "");
  document.querySelectorAll(".navbar__nav a[data-nav], .mobile-menu a[data-nav]").forEach(link => {
    if (link.dataset.nav === currentPage || (currentPage === "" && link.dataset.nav === "home")){
      link.classList.add("active");
    }
  });

  /* ---------------------------------------------------------
     NAVBAR SCROLL STATE
  --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("backToTop");
  const onScroll = () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop){
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------------------------------------------------
     HAMBURGER / MOBILE MENU
  --------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (hamburger && mobileMenu){
    hamburger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("is-active", open);
      hamburger.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("is-active");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------------------------------------------------
     SEARCH OVERLAY
  --------------------------------------------------------- */
  const searchToggle = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");
  if (searchToggle && searchOverlay){
    searchToggle.addEventListener("click", () => {
      searchOverlay.classList.add("open");
      setTimeout(() => searchInput && searchInput.focus(), 300);
    });
    searchClose.addEventListener("click", () => searchOverlay.classList.remove("open"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") searchOverlay.classList.remove("open");
    });
    if (searchInput){
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && searchInput.value.trim()){
          window.location.href = `search.html?search=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL (IntersectionObserver, mobile-tuned)
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(".reveal, .reveal-image");
  if (revealTargets.length){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------
     ANIMATED COUNTERS
  --------------------------------------------------------- */
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 70));
        const tick = () => {
          current += step;
          if (current >= target){ el.textContent = target + suffix; return; }
          el.textContent = current + suffix;
          requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counterObserver.observe(el);
  });

  /* ---------------------------------------------------------
     PERFORMANCE BARS
  --------------------------------------------------------- */
  document.querySelectorAll(".perf-bar__fill").forEach(bar => {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.style.width = entry.target.dataset.width + "%";
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    barObserver.observe(bar);
  });

  /* ---------------------------------------------------------
     MAGNETIC BUTTONS (desktop pointer only)
  --------------------------------------------------------- */
  if (window.matchMedia("(pointer:fine)").matches){
    document.querySelectorAll(".magnetic").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = "translate(0,0)"; });
    });

    /* ---------------------------------------------------------
       CARD TILT (desktop pointer only)
    --------------------------------------------------------- */
    document.addEventListener("mousemove", (e) => {
      const glow = document.getElementById("cursorGlow");
      if (glow){
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }
    });
  }

  function enableTilt(el){
    el.classList.add("tilt");
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = "perspective(800px) rotateY(0) rotateX(0)"; });
  }
  window.enableTilt = enableTilt;
  if (window.matchMedia("(pointer:fine)").matches){
    document.querySelectorAll(".car-card, .limited-card").forEach(enableTilt);
  }

  /* ---------------------------------------------------------
     PARALLAX (lightweight, scroll-driven)
  --------------------------------------------------------- */
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length){
    window.addEventListener("scroll", () => {
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset * -0.05}px)`;
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     NEWSLETTER FORM (shared across pages if present)
  --------------------------------------------------------- */
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm){
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletterEmail").value;
      const msg = document.getElementById("newsletterMessage");
      if (email && msg){
        msg.textContent = `Welcome to the inner circle, ${email}.`;
        showToast("Subscribed successfully");
        newsletterForm.reset();
      }
    });
  }
});
