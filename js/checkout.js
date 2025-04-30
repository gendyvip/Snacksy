document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    const cardDetails = document.getElementById("cardDetails");
    if (this.value === "visa") {
      cardDetails.style.display = "block";
    } else {
      cardDetails.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let logout = document.getElementById("logout")
  logout.addEventListener("click",()=>localStorage.clear())
  updateCart()
  let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  let cartArr = [...cart];
  let favorite = localStorage.getItem("favorite") ? JSON.parse(localStorage.getItem("favorite")) : [];
  let favArr = [...favorite];
  let favNo = document.getElementById("favNo");

  updateCartCount();
  logout.addEventListener("click", () => localStorage.clear());

  function updateCart() {
    fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("cart", JSON.stringify(data.cart));
        localStorage.setItem("favorite", JSON.stringify(data.favorite));
        cart = data.cart;
        favorite = data.favorite
        cartArr = [...cart];
        favArr = [...favorite]
        updateCartCount();
      })
      .catch((error) => console.log(error));
  }

  function updateCartCount() {
    countNo.innerText = cartArr.length;
    favNo.innerText = favArr.length
  }

  let products = JSON.parse(localStorage.getItem("cart")) || [];
  displayOrderItems(products);
  calculateTotals(products);
});

function displayOrderItems(products) {
  const container = document.getElementById("order-items-container");
  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML = '<div class="alert alert-secondary text-center">Your cart is empty</div>';
    return;
  }

  products.forEach((product) => {
    const itemElement = document.createElement("div");
    itemElement.className = "d-flex mb-3 pb-3 border-bottom";
    itemElement.innerHTML = `
                    <a class="item-details" data-id="${product.id}" href="./product.html?id=${product.id}">
      <img src="${product.image}" alt="${product.name}" class="rounded me-3" style="width: 70px; height: 70px; object-fit: cover;">
        </a>
      <div class="flex-grow-1">
        <h6 class="mb-1"><span class="text-success">${localStorage.getItem(`Quantity of ${product.id}`)}X</span> ${product.name}</h6>
        <div class="d-flex align-items-center">
          <span class="text-danger fw-bold">$${product.price.toFixed(2)}</span>
          <small class="text-muted text-decoration-line-through ms-2">$${product.original_price.toFixed(2)}</small>
          <span class="badge bg-danger ms-2">${product.discount}</span>
        </div>
        <small class="text-muted d-block">Brand: ${product.brand}</small>
      </div>
    `;

    container.appendChild(itemElement);
  });
}
function calculateTotals(products) {
  if (!products || products.length === 0) return;

  const subtotal = products.reduce(
    (sum, product) => sum + product.price,
    0
  );
  const shipping = 5;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  document.getElementById("subtotal").textContent = `$${localStorage.getItem("Subtotal")}`;
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
  let Total = `${Number(localStorage.getItem("Total")) + Number(tax.toFixed(2))}`
  document.getElementById("total").textContent = `$${Number(Total).toFixed(2)}`;
}

document.getElementById("checkoutForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!this.checkValidity()) {
    e.stopPropagation();
    this.classList.add("was-validated");
    return;
  }

  const orderModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
  orderModal.show();
  let btnClose = document.getElementById("btnClose")
  btnClose.addEventListener("click", () => {
      localStorage.setItem("cart",[])
      fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: [] }),
      });
      setTimeout(() => {
        location.href = "../pages/home.html"
      }, 500);
    })

});
