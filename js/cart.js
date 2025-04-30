let cartItems = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
const cartEmpty = document.getElementById("cartEmpty");
const cartItemsEl = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');

let logout = document.getElementById("logout")
logout.addEventListener("click",()=>localStorage.clear())

updateCart()
let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
let cartArr = [...cart];
let favorite = localStorage.getItem("favorite") ? JSON.parse(localStorage.getItem("favorite")) : [];
let favArr = [...favorite];

updateCartCount();
logout.addEventListener("click", () => localStorage.clear());

function updateCart() {
  fetch(`https://gendy.sersawy.com/api/api.php/users`)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("cart", JSON.stringify(data.localStorage.getItem("id").cart));
      localStorage.setItem("favorite", JSON.stringify(data.localStorage.getItem("id").favorite));
      cart = data.localStorage.getItem("id").cart;
      favorite = data.localStorage.getItem("id").favorite
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

function initCart() {
  renderCartItems();
  updateTotals();
}
function renderCartItems() {
  if (cartItems.length === 0) {
    cartEmpty.style.justifyContent = "center";
    cartEmpty.innerHTML = `
      <img src="../assets/images/4428b6a9-a098-4994-8beb-e37145dc20d7.png" class="me-3 mt-3 w-25" alt="empty-cart">
      <span class="lead fs-4 text-center mt-4">Cart is empty</span>
      <a href="../pages/snacks.html" class="btn btn-dark-green w-25 rounded-1 mt-3">Continue shopping</a>
      `
  } else {
    cartItemsEl.innerHTML = cartItems.map(item => `
      <tr data-id="${Number(item.id)}">
        <td>
          <div class="d-flex align-items-center">
                       <a class="item-details" data-id="${item.id}" href="./product.html?id=${item.id}">
            <img src="${item.image}" alt="${item.name}" class="product-img me-3" style="height: 100px; object-fit: contain;">
        </a>
            <div>
              <div class="product-title">${item.name}</div>
              <div class="stock-status">
                ${getStockStyle(item.availabilityStatus, item.stock)}
              </div>
            </div>
          </div>
        </td>
        <td class="align-middle price">$${item.price.toFixed(2)}</td>
        <td class="align-middle">
          <div class="input-group input-group-sm d-inline-flex" style="width: 120px;">
            <button class="btn btn-outline-dark decrease-quantity" type="button" data-id="${Number(item.id)}">-</button>
            <input dataset="${item.name}" type="number" class="form-control quantity-input" 
                   value=${localStorage.getItem(`Quantity of ${item.id}`)} min="1" max="${item.stock}" data-id="${Number(item.id)}">
            <button class="btn btn-outline-dark increase-quantity" type="button" data-id="${Number(item.id)}">+</button>
          </div>
        </td>
        <td class="align-middle subtotal">$${(item.price*localStorage.getItem(`Quantity of ${item.id}`)).toFixed(2)}</td>
        <td class="align-middle">
          <button class="btn btn-sm btn-outline-danger remove-item" data-id="${Number(item.id)}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
      `).join('');
    addEventListeners();
  }
}

function addEventListeners() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.remove-item')) {
      const id = parseInt(e.target.closest('.remove-item').dataset.id);
      const itemIndex = cartItems.findIndex(item => Number(item.id) === id);
      if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));
        fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: cartItems }),
        });
         cartArr = [...cartItems]; 
        updateCartCount();       
        renderCartItems();
        updateTotals();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('increase-quantity')) {
      {
        const input = e.target.closest('.input-group').querySelector('.quantity-input');
        if (input.value < Number(input.max)) {
          input.stepUp();
          localStorage.setItem(`Quantity of ${JSON.stringify(Number(input.dataset.id))}`, input.value)
          updateSubtotal(input);
          updateTotals();
        }
        else {
          const body = document.getElementsByTagName("body")[0]
          const qAlert = document.createElement("div")
          qAlert.setAttribute("class", "row justify-content-center align-items-center position-absolute alertPos")
          qAlert.innerHTML = `
            <div id="fadeOut" class="alert alert-danger alert-dismissible fade show" role="alert">
              <span>You can buy ${input.max} items only!</span>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          </div>`
          body.after(qAlert)
          setTimeout(() => {
            const fadeOut = document.getElementById("fadeOut")
            fadeOut.classList.remove("show")
          }, 3000)
        }
      }
    }
    else if (e.target.classList.contains('decrease-quantity')) {
      const input = e.target.closest('.input-group').querySelector('.quantity-input');
      const id = parseInt(e.target.dataset.id);
      const currentValue = parseInt(input.value);

      if (currentValue <= 1) {
        const itemIndex = cartItems.findIndex(item => Number(item.id) === id);
        if (itemIndex !== -1) {
          cartItems.splice(itemIndex, 1);
          localStorage.setItem("cart", JSON.stringify(cartItems));
          fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: cartItems }),
          });
          cartArr = [...cartItems]; 
          updateCartCount();    
          renderCartItems();
          updateTotals();
        }
      } else {
        input.value = currentValue - 1;
        localStorage.setItem(`Quantity of ${JSON.stringify(Number(input.dataset.id))}`, input.value)
        updateSubtotal(input);
        updateTotals();
      }
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('quantity-input')) {
      updateSubtotal(e.target);
      updateTotals();
    }
  });
}

function updateSubtotal(input) {
  if (!input) return;
  const row = input.closest('tr');
  const price = parseFloat(row.querySelector('.price').textContent.replace('$', ''));
  const quantity = parseInt(input.value);
  const subtotal = (price * quantity).toFixed(2);
  row.querySelector('.subtotal').textContent = `$${subtotal}`;
  return parseFloat(subtotal);
}

function updateTotals() {
  let subtotal = 0;
  document.querySelectorAll('#cart-items tr').forEach(row => {
    const itemSubtotal = parseFloat(row.querySelector('.subtotal').textContent.replace('$', ''));
    subtotal += itemSubtotal;
    localStorage.setItem("Subtotal", parseFloat(subtotal).toFixed(2))
  });

  const shippingElement = document.querySelector('input[name="shipping"]:checked');
  const shipping = shippingElement && shippingElement.id === 'free-shipping' ? 5 : 10;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${(subtotal + shipping).toFixed(2)}`;
  localStorage.setItem("Total", parseFloat(subtotal + shipping).toFixed(2))
}

const getStockStyle = (status, stock) => {
  if (status.toLowerCase() === 'in stock')
    return `<span class="in-stock">${status} (${stock} left)</span>`;
  else
    return `<span class="low-stock">${status} (${stock} left)</span>`;
}

document.querySelectorAll('input[name="shipping"]').forEach(radio => {
  radio.addEventListener('change', updateTotals);
});

document.addEventListener('DOMContentLoaded', initCart);




function showAlert() {
  const alert = document.getElementById('myAlert');
  alert.style.display = 'block';
  setTimeout(() => {
    alert.classList.add('show');
  }, 10);
}