/* =========================================================
   VELOURA MOTORS — SEARCH.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("searchGrid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const query = params.get("search") || params.get("q") || "";

  document.getElementById("searchHeading").textContent = query ? `Results for "${query}"` : "Search the Inventory";
  document.getElementById("searchSubheading").textContent = query
    ? "Showing vehicles matching your search across brand, model, and category."
    : "Use the search icon in the navigation to find a specific brand or model.";

  const state = VeloraFilters.defaultState();
  state.search = query;
  const results = VeloraFilters.apply(CARS, state);

  document.getElementById("resultCount").textContent = `${results.length} vehicle${results.length !== 1 ? "s" : ""} found`;

  if (results.length === 0){
    grid.innerHTML = `<div class="empty-state">No vehicles matched "${query}". <a href="inventory.html">Browse the full inventory</a></div>`;
  } else {
    grid.innerHTML = results.map(c => carCardHTML(c, { actions: true })).join("");
    bindCarCardEvents(grid);
  }
});
