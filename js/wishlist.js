/* =========================================================
   VELOURA MOTORS — WISHLIST.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("wishlistGrid");
  if (!grid) return;

  function render(){
    const ids = VeloraStore.getWishlist();
    const cars = ids.map(getCarById).filter(Boolean);

    if (cars.length === 0){
      grid.innerHTML = `<div class="empty-state">Your wishlist is empty. <a href="inventory.html">Browse the inventory</a></div>`;
      return;
    }

    grid.innerHTML = cars.map(c => carCardHTML(c, { actions: true })).join("");
    bindCarCardEvents(grid);

    grid.querySelectorAll(".car-card__wish").forEach(btn => {
      btn.addEventListener("click", () => setTimeout(render, 150));
    });
  }

  render();
});
