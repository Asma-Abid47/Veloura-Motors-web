/* =========================================================
   VELOURA MOTORS — CHECKOUT.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const checkoutLayout = document.getElementById("checkoutLayout");
  if (!checkoutLayout) return;

  const TAX_RATE = 0.07;
  const cart = VeloraStore.getCart();

  if (cart.length === 0){
    checkoutLayout.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Your cart is empty — add a vehicle before checking out. <a href="inventory.html">Browse inventory</a></div>`;
  } else {
    const itemsEl = document.getElementById("checkoutItems");
    itemsEl.innerHTML = cart.map(item => {
      const car = getCarById(item.id);
      if (!car) return "";
      return `<div class="summary-line"><span>${car.brand} ${car.name} × ${item.qty}</span><span>$${(car.price * item.qty).toLocaleString()}</span></div>`;
    }).join("");

    const subtotal = VeloraStore.cartTotal();
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    document.getElementById("coSubtotal").textContent = "$" + subtotal.toLocaleString();
    document.getElementById("coTax").textContent = "$" + Math.round(tax).toLocaleString();
    document.getElementById("coTotal").textContent = "$" + Math.round(total).toLocaleString();
  }

  /* payment method toggle */
  const cardFields = document.getElementById("cardFields");
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener("change", () => {
      cardFields.style.display = radio.value === "card" && radio.checked ? "grid" : "none";
    });
  });

  /* place order */
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm){
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (VeloraStore.getCart().length === 0) return;

      const name = checkoutForm.querySelector('input[type="text"]').value || "there";
      const orderNumber = "VM" + Math.floor(100000 + Math.random() * 900000);

      document.getElementById("orderConfirmText").textContent =
        `Thank you, ${name} — order #${orderNumber} has been placed. A confirmation email is on its way, and your concierge will reach out within 24 hours.`;

      VeloraStore.clearCart();
      updateBadges();

      document.querySelectorAll(".checkout-steps span")[2].classList.add("active");
      checkoutLayout.style.display = "none";
      document.getElementById("orderSuccess").style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
