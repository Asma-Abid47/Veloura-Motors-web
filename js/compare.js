/* =========================================================
   VELOURA MOTORS — COMPARE.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.getElementById("compareWrap");
  if (!wrap) return;

  function render(){
    const ids = VeloraStore.getCompare();
    const cars = ids.map(getCarById).filter(Boolean);

    if (cars.length === 0){
      wrap.innerHTML = `<div class="empty-state">No vehicles selected for comparison. <a href="inventory.html">Browse the inventory and tap "+ Compare" on any car</a></div>`;
      return;
    }

    const rows = [
      { label: "Price", get: c => formatPrice(c.price) },
      { label: "Horsepower", get: c => c.hp + " HP" },
      { label: "0–60 MPH", get: c => c.accel + "s" },
      { label: "Top Speed", get: c => c.topSpeed + " MPH" },
      { label: "Year", get: c => c.year },
      { label: "Transmission", get: c => c.transmission },
      { label: "Fuel Type", get: c => c.fuel },
      { label: "Drive Type", get: c => c.drive },
      { label: "Seats", get: c => c.seats },
      { label: "Category", get: c => categoryTitle(c.category) },
      { label: "Rating", get: c => "★ " + c.rating }
    ];

    wrap.innerHTML = `
      <table class="compare-table">
        <tr>
          <th></th>
          ${cars.map(c => `
            <td class="compare-car-head">
              <img src="${c.image}" alt="${c.brand} ${c.name}">
              <strong>${c.brand} ${c.name}</strong>
              <button class="compare-remove" data-id="${c.id}">Remove</button>
            </td>
          `).join("")}
        </tr>
        ${rows.map(row => `
          <tr>
            <th>${row.label}</th>
            ${cars.map(c => `<td>${row.get(c)}</td>`).join("")}
          </tr>
        `).join("")}
      </table>
    `;

    wrap.querySelectorAll(".compare-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        VeloraStore.removeFromCompare(btn.dataset.id);
        render();
      });
    });
  }

  render();
});
