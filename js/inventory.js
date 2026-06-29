/* =========================================================
   VELOURA MOTORS — INVENTORY.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("inventoryGrid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const state = VeloraFilters.defaultState();
  let page = 1;
  const PER_PAGE = 9;
  let view = "grid";

  /* ---------------------------------------------------------
     SEED STATE FROM URL (?cat=, ?brand=, ?search=)
  --------------------------------------------------------- */
  const urlCat = params.get("cat");
  const urlBrand = params.get("brand");
  const urlSearch = params.get("search");
  if (urlCat) state.categories = [urlCat];
  if (urlBrand) state.brands = [urlBrand];
  if (urlSearch) state.search = urlSearch;

  /* ---------------------------------------------------------
     BANNER TEXT
  --------------------------------------------------------- */
  const bannerTitle = document.getElementById("bannerTitle");
  const bannerTagline = document.getElementById("bannerTagline");
  const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");
  if (urlCat){
    const title = categoryTitle(urlCat);
    bannerTitle.textContent = title;
    bannerTagline.textContent = `Browse every ${title.toLowerCase()} currently available at Veloura Motors.`;
    breadcrumbCurrent.textContent = title;
  } else if (urlSearch){
    bannerTitle.textContent = `Results for "${urlSearch}"`;
    bannerTagline.textContent = "Showing inventory matching your search.";
    breadcrumbCurrent.textContent = "Search Results";
  }

  /* ---------------------------------------------------------
     BUILD CATEGORY + BRAND CHECKBOXES
  --------------------------------------------------------- */
  const categoryFiltersEl = document.getElementById("categoryFilters");
  categoryFiltersEl.innerHTML = CATEGORIES.map(c => `
    <label><input type="checkbox" value="${c.key}" data-filter="categories" ${state.categories.includes(c.key) ? "checked" : ""}> ${c.title}</label>
  `).join("");

  const brandFiltersEl = document.getElementById("brandFilters");
  brandFiltersEl.innerHTML = BRANDS.map(b => `
    <label><input type="checkbox" value="${b}" data-filter="brands" ${state.brands.includes(b) ? "checked" : ""}> ${b}</label>
  `).join("");

  /* ---------------------------------------------------------
     READ STATE FROM ALL FILTER INPUTS
  --------------------------------------------------------- */
  function readState(){
    state.categories = [...document.querySelectorAll('[data-filter="categories"]:checked')].map(el => el.value);
    state.brands = [...document.querySelectorAll('[data-filter="brands"]:checked')].map(el => el.value);
    state.transmission = [...document.querySelectorAll('[data-filter="transmission"]:checked')].map(el => el.value);
    state.fuel = [...document.querySelectorAll('[data-filter="fuel"]:checked')].map(el => el.value);
    state.drive = [...document.querySelectorAll('[data-filter="drive"]:checked')].map(el => el.value);
    state.seats = [...document.querySelectorAll('[data-filter="seats"]:checked')].map(el => Number(el.value));
    state.priceMax = Number(priceFilter.value);
    state.yearMin = Number(yearFilter.value);
    state.hpMin = Number(hpFilter.value);
  }

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */
  function render(){
    readState();
    let results = VeloraFilters.apply(CARS, state);
    results = VeloraFilters.sort(results, sortSelect.value);

    const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
    if (page > totalPages) page = totalPages;
    const pageItems = VeloraFilters.paginate(results, page, PER_PAGE);

    document.getElementById("resultCount").textContent = `${results.length} vehicle${results.length !== 1 ? "s" : ""} found`;

    if (pageItems.length === 0){
      grid.innerHTML = `<div class="empty-state">No vehicles match your filters. <a href="inventory.html">Reset filters</a></div>`;
    } else {
      grid.innerHTML = pageItems.map(car => carCardHTML(car, { actions: true })).join("");
      bindCarCardEvents(grid);
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages){
    const pagination = document.getElementById("pagination");
    if (totalPages <= 1){ pagination.innerHTML = ""; return; }
    let html = "";
    for (let i = 1; i <= totalPages; i++){
      html += `<button data-page="${i}" class="${i === page ? "active" : ""}">${i}</button>`;
    }
    pagination.innerHTML = html;
    pagination.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        page = Number(btn.dataset.page);
        render();
        window.scrollTo({ top: 280, behavior: "smooth" });
      });
    });
  }

  /* ---------------------------------------------------------
     WIRE FILTER CONTROLS
  --------------------------------------------------------- */
  const priceFilter = document.getElementById("priceFilter");
  const yearFilter = document.getElementById("yearFilter");
  const hpFilter = document.getElementById("hpFilter");
  const priceVal = document.getElementById("priceVal");
  const yearVal = document.getElementById("yearVal");
  const hpVal = document.getElementById("hpVal");
  const sortSelect = document.getElementById("sortSelect");

  priceFilter.addEventListener("input", () => {
    priceVal.textContent = Number(priceFilter.value) >= 4000000 ? "$4,000,000+" : "$" + Number(priceFilter.value).toLocaleString();
    page = 1; render();
  });
  yearFilter.addEventListener("input", () => {
    yearVal.textContent = Number(yearFilter.value) <= 1960 ? "Any" : yearFilter.value;
    page = 1; render();
  });
  hpFilter.addEventListener("input", () => {
    hpVal.textContent = Number(hpFilter.value) === 0 ? "Any" : hpFilter.value + "+ HP";
    page = 1; render();
  });
  document.querySelectorAll('[data-filter]').forEach(input => {
    if (input.type === "checkbox"){
      input.addEventListener("change", () => { page = 1; render(); });
    }
  });
  sortSelect.addEventListener("change", () => { page = 1; render(); });

  document.getElementById("clearFilters").addEventListener("click", () => {
    document.querySelectorAll('[data-filter]').forEach(el => el.checked = false);
    priceFilter.value = 4000000; priceVal.textContent = "$4,000,000+";
    yearFilter.value = 1960; yearVal.textContent = "Any";
    hpFilter.value = 0; hpVal.textContent = "Any";
    page = 1;
    render();
  });

  /* ---------------------------------------------------------
     GRID / LIST VIEW TOGGLE
  --------------------------------------------------------- */
  const gridViewBtn = document.getElementById("gridViewBtn");
  const listViewBtn = document.getElementById("listViewBtn");
  gridViewBtn.addEventListener("click", () => {
    view = "grid"; grid.classList.remove("list-view");
    gridViewBtn.classList.add("active"); listViewBtn.classList.remove("active");
  });
  listViewBtn.addEventListener("click", () => {
    view = "list"; grid.classList.add("list-view");
    listViewBtn.classList.add("active"); gridViewBtn.classList.remove("active");
  });

  /* ---------------------------------------------------------
     MOBILE FILTERS TOGGLE
  --------------------------------------------------------- */
  const filtersToggle = document.getElementById("filtersToggle");
  const filtersPanel = document.getElementById("filtersPanel");
  if (filtersToggle){
    filtersToggle.addEventListener("click", () => filtersPanel.classList.toggle("open"));
  }

  render();
});
