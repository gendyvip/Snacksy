

document.addEventListener("DOMContentLoaded", function () {
  const cartEmpty = document.getElementById("cartEmpty");
  const cartItemsEl = document.getElementById('cart-items');
  let favorite = localStorage.getItem("favorite") ? JSON.parse(localStorage.getItem("favorite")) : [];
  let favoriteItems = favorite

  let logout = document.getElementById("logout")
  logout.addEventListener("click", () => localStorage.clear())
  updateCart()
  let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  let cartArr = [...cart];
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

  renderCartItems();

  function renderCartItems() {
    if (favoriteItems.length === 0) {
      cartEmpty.style.justifyContent = "center";
      cartEmpty.innerHTML = `
        <img src="../assets/images/261a11ad-e28c-42ab-a8b7-54d324857579.png" class="me-3 mt-2 w-25" alt="empty-cart">
        <span class="lead fs-4 text-center mt-4">You don't have any favorites yet.</span>
        <a href="../pages/home.html" class="btn btn-dark-green w-25 rounded-3 mt-3">Let's add!</a>
        `
    }
    else {
      cartItemsEl.innerHTML = `
          <div class="container-fluid">
              <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  ${favorite.map(item => `
                      <div class="col">
                          <div class="card h-100 shadow-sm">
                              <div class="position-relative">
                                    <a class="item-details" data-id="${item.id}" href="./product.html?id=${item.id}">
                          <img src="${item.image}" class="card-img-top p-3" alt="${item.name}" style="height: 200px; object-fit: contain;">
                          </a>
                                  <button class="favorite-btn btn btn-sm position-absolute top-0 end-0 m-2 remove-item" data-id="${Number(item.id)}">
                                      <i id="heart" class="text-danger fa-solid fa-heart"></i>
                                  </button>
                              </div>
                              <div class="card-body">
                                  <h5 class="card-title">${item.name}</h5>
                                  <div class="d-flex justify-content-between align-items-center mt-3">
                                      <span class="h5 text-success lead">$${item.price.toFixed(2)}</span>
                                      <button class="btn btn-dark-green  p-2 btn-sm add-to-cart" data-id="${Number(item.id)}">
                                          <i class="fas fa-cart-plus me-1"></i>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  `).join('')}
              </div>
          </div>
      `;
      addEventListeners();
    }
  }

  function addEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.remove-item')) {
        const id = parseInt(e.target.closest('.remove-item').dataset.id);
        const itemIndex = favoriteItems.findIndex(item => Number(item.id) === id);
        if (itemIndex !== -1) {
          favoriteItems.splice(itemIndex, 1);
          localStorage.setItem("favorite", JSON.stringify(favoriteItems));
          favorite = JSON.parse(localStorage.getItem("favorite"));
          favArr = [...favorite];
          //run 
          renderCartItems();
          updateCartCount();
          fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ favorite: favoriteItems }),
          })
        }
      }
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function () {
        this.innerHTML = `<i class="fa-solid fa-spinner spin"></i>`;
        this.classList.add("check-form-control")
        const productId = this.getAttribute('data-id');

        fetch(`https://680fa67867c5abddd19621bf.mockapi.io/api/products//${productId}`)
          .then(res => res.json())
          .then(data => {
            if (cartArr.some(product => product.id === data.id)) {
              setTimeout(() => {
                this.innerHTML = 'Already Added';
              }, 1000)
              this.classList
            } else {
              cartArr.push(data);
              localStorage.setItem("cart", JSON.stringify(cartArr));
              updateCartCount();

              fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart: cartArr }),
              });

              setTimeout(() => {
                this.innerHTML = `<i class="fa-solid fa-spinner spin"></i>`;
                this.classList.add("check-form-control")
              }, 500)
              setTimeout(() => {
                this.innerHTML = 'Added!'
              }, 1000)
            }

            setTimeout(() => {
              this.classList.remove("check-form-control");
              this.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add to Cart`;
            }, 5000);
          })
          .catch(error => console.log(error));
      });
    });
  }

})