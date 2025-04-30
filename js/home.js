document.addEventListener("DOMContentLoaded", function () {

  const loggedIn = document.getElementById("home");
  loggedIn.classList.remove("guest")
  const container = document.getElementById('products-container');
  let logout = document.getElementById("logout");
  let countNo = document.getElementById("countNo");
  let favNo = document.getElementById("favNo");
  let color, products;
  const scroll = document.querySelector('.scrollIcon');

  window.addEventListener('scroll', function () {
    if (window.scrollY < 500) 
      scroll.classList.add('hidden')
    else 
    {
      scroll.style.cursor="pointer"
      scroll.classList.remove('hidden');
    }
    
    
  })
  scroll.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })


  let cart = [];
  let cartArr = [...cart];
  let favorite = [];
  let favArr = [...favorite];

  logout.addEventListener("click", () => localStorage.clear());

  function updateCart() {
    return fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`)
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


  renderProducts()

  async function renderProducts() {
    await updateCart()
    fetch('https://680fa67867c5abddd19621bf.mockapi.io/api/products/')
      .then(res => res.json())
      .then(data => {
        products = data
        container.innerHTML = '';
        ;
        data.forEach(product => {
          if (product.stock <= 20)
            color = "red";
          else
            color = "green";
          const card = document.createElement('div');
          card.className = 'product-card';
          card.innerHTML = `
        <a class="item-details" data-id="${product.id}" href="./product.html?id=${product.id}">
        <img  src="${product.image}" alt="${(product.name).slice(0, 40)}" class="product-image">
        </a>
        <div class="product-info">
          <h3>${(product.name).slice(0, 40)}</h3>
          <div class="reviews d-flex justify-content-between"><span>⭐ ${product.rating}</span> <span style="color:${color}">(${product.stock} left)</span></div>
          <div class="price">$${product.price} <span class="discount">${product.discount} off</span></div>
          <div class="product-actions">
            <button class="add-to-cart" data-id="${product.id}"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
            <button  class="favorite-btn" data-id="${product.id}"><i class="${favClass(product.id)}"></i></button>
          </div>
        </div>
      `;
          container.appendChild(card);
        });

        setupButtonHandlers();

      })
      .catch(error => {
        const card = document.createElement('div');
        console.error(error);
        card.innerHTML = `<div class="alert alert-danger">Failed to fetch products</div>`
        container.appendChild(card);
      });
  }


  function favClass(id) {
    let favItems = JSON.parse(localStorage.getItem("favorite"))
    if (favItems.some((fav) => fav.id == id))
      return `text-danger fa-solid fa-heart`
    else
      return `fa-regular fa-heart`
  }

  function setupButtonHandlers() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        this.innerHTML = `<i class="text-danger fa-solid fa-heart"></i>`
        const productId = this.getAttribute('data-id');
        fetch(`https://680fa67867c5abddd19621bf.mockapi.io/api/products/${productId}`)
          .then(res => res.json())
          .then(data => {
            if (favArr.some((product) => product.id === data.id)) {
              const itemIndex = favArr.findIndex(item => Number(item.id) == data.id)
              console.log(itemIndex)
              if (itemIndex !== -1) {
                favArr.splice(itemIndex, 1);
                localStorage.setItem("favorite", JSON.stringify(favArr));
                updateCartCount();
                console.log(this.firstChild.setAttribute("class","fa-regular fa-heart"))
                fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ favorite: favArr }),
                });
              }
            } else {
              favArr.push(data);
              localStorage.setItem("favorite", JSON.stringify(favArr));
              updateCartCount();

              fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ favorite: favArr }),
              });
            }
          })
          .catch(error => console.log(error));
      });
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function () {
        this.innerHTML = `<i class="fa-solid fa-spinner spin"></i>`;
        this.classList.add("check-form-control")
        const productId = this.getAttribute('data-id');

        fetch(`https://680fa67867c5abddd19621bf.mockapi.io/api/products/${productId}`)
          .then(res => res.json())
          .then(data => {
            if (cartArr.some(product => product.id === data.id)) {
              setTimeout(() => {
                this.innerHTML = 'Already Added';
              }, 1000)
            } else {
              localStorage.setItem(`Quantity of ${JSON.stringify(Number(productId))}`, 1)
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

  document.querySelectorAll(".category-card img").forEach((category) => {
    category.addEventListener("click", () => {
      container.innerHTML = ''
      let categoryName = category.getAttribute("alt")
      let filteredProducts = products.filter((product) => product.category === categoryName.toLowerCase())
      console.log(filteredProducts)
      filteredProducts.forEach(product => {
        if (product.stock <= 20)
          color = "red";
        else
          color = "green";
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <a class="item-details" data-id="${product.id}" href="./product.html?id=${product.id}">
            <img  src="${product.image}" alt="${(product.name).slice(0, 40)}" class="product-image">
            </a>
            <div class="product-info">
              <h3>${(product.name).slice(0, 40)}</h3>
              <div class="reviews d-flex justify-content-between"><span>⭐ ${product.rating}</span> <span style="color:${color}">(${product.stock} left)</span></div>
              <div class="price">$${product.price} <span class="discount">${product.discount} off</span></div>
              <div class="product-actions">
                <button class="add-to-cart" data-id="${product.id}"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                <button class="favorite-btn" data-id="${product.id}"><i class="fa-regular fa-heart"></i></button>
              </div>
            </div>
          `;
        container.appendChild(card);
      });

      setupButtonHandlers();
    })
  })

});