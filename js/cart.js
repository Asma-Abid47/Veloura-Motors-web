/* =========================================================
   VELOURA MOTORS — CART.JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const cartTable = document.getElementById("cartTable");
  if (!cartTable) return;

  const TAX_RATE = 0.07;
  let promoDiscount = 0;

  function render(){
    const cart = VeloraStore.getCart();

    if (cart.length === 0){
      cartTable.innerHTML = `<div class="empty-state">Your cart is empty. <a href="inventory.html">Browse the inventory</a></div>`;
      document.getElementById("checkoutLink").style.pointerEvents = "none";
      document.getElementById("checkoutLink").style.opacity = "0.5";
    } else {
      document.getElementById("checkoutLink").style.pointerEvents = "auto";
      document.getElementById("checkoutLink").style.opacity = "1";
      cartTable.innerHTML = cart.map((item, i) => {
        const car = getCarById(item.id);
        if (!car) return "";
        return `
          <div class="cart-row">
            <div class="cart-row__img"><img src="${car.image}" alt="${car.brand} ${car.name}"></div>
            <div>
              <div class="cart-row__name">${car.brand} ${car.name}</div>
              <div class="cart-row__meta">${formatPrice(car.price)} each</div>
              <button class="cart-row__remove" data-id="${item.id}">Remove</button>
            </div>
            <div class="qty-stepper">
              <button class="qty-minus" data-id="${item.id}">&minus;</button>
              <span>${item.qty}</span>
              <button class="qty-plus" data-id="${item.id}">+</button>
            </div>
            <div class="cart-row__price">${formatPrice(car.price * item.qty)}</div>
          </div>
        `;
      }).join("");
    }

    bindRowEvents();
    updateTotals();
    updateBadges();
  }

  function bindRowEvents(){
    cartTable.querySelectorAll(".cart-row__remove").forEach(btn => {
      btn.addEventListener("click", () => {
        VeloraStore.removeFromCart(btn.dataset.id);
        showToast("Removed from cart");
        render();
      });
    });
    cartTable.querySelectorAll(".qty-minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = VeloraStore.getCart().find(i => i.id === btn.dataset.id);
        if (item) VeloraStore.updateCartQty(btn.dataset.id, item.qty - 1);
        render();
      });
    });
    cartTable.querySelectorAll(".qty-plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = VeloraStore.getCart().find(i => i.id === btn.dataset.id);
        if (item) VeloraStore.updateCartQty(btn.dataset.id, item.qty + 1);
        render();
      });
    });
  }

  function updateTotals(){
    const subtotal = VeloraStore.cartTotal();
    const discount = subtotal * promoDiscount;
    const taxed = (subtotal - discount) * TAX_RATE;
    const total = subtotal - discount + taxed;

    document.getElementById("summarySubtotal").textContent = "$" + subtotal.toLocaleString();
    document.getElementById("summaryTax").textContent = "$" + Math.round(taxed).toLocaleString();
    document.getElementById("summaryTotal").textContent = "$" + Math.round(total).toLocaleString();
    sessionStorage.setItem("veloura_order_total", Math.round(total));
  }

  document.getElementById("promoBtn").addEventListener("click", () => {
    const code = document.getElementById("promoInput").value.trim().toUpperCase();
    const msg = document.getElementById("promoMessage");
    if (code === "VELOURA10"){
      promoDiscount = 0.10;
      msg.textContent = "Promo applied — 10% off your order.";
    } else if (code === ""){
      msg.textContent = "Enter a promo code first.";
    } else {
      promoDiscount = 0;
      msg.textContent = "That code isn't valid. Try VELOURA10.";
    }
    updateTotals();
  });

  render();
});
