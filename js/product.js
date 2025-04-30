const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const bestSeller = document.getElementById("bestSeller")
const productNameHead = document.getElementById("productName")


function stockClass(stock) {
  if (stock < 20)
    return "text-danger"
  else
    return "text-success"
}
updateCart()
let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
let cartArr = [...cart];
let favorite = localStorage.getItem("favorite") ? JSON.parse(localStorage.getItem("favorite")) : [];
let favArr = [...favorite];

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

if (!id) {
  console.error('No product ID found in URL');
} else {
  fetch(`https://680fa67867c5abddd19621bf.mockapi.io/api/products/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((product) => {
      if (!product) {
        throw new Error('Product data is empty');
      }
      bestSeller.innerHTML = product.category
      let pNameHead = product.name
      productNameHead.innerHTML = pNameHead.slice(0, 20) + "...&nbspDetails"
      const productImage = document.getElementById("product-image");
      if (productImage && product.image) {
        productImage.src = product.image;
        productImage.alt = product.name || 'Product image';
      }

      const productName = document.getElementById("product-name");
      if (productName) productName.textContent = product.name || '';

      const brandCategory = document.getElementById("brand-category");
      if (brandCategory) {
        brandCategory.textContent = [product.brand, product.category]
          .filter(Boolean)
          .join(' • ') || '';
      }

      const ratingElement = document.getElementById("rating");
      if (ratingElement && product.rating) {
        const fullStars = '★'.repeat(Math.floor(product.rating));
        const emptyStars = '☆'.repeat(5 - Math.ceil(product.rating));
        ratingElement.textContent = fullStars + emptyStars;
      }

      const reviewCount = document.getElementById("review-count");
      if (reviewCount && product.review_count) {
        reviewCount.textContent = `(${product.review_count} ratings)`;
      }

      const priceElement = document.getElementById("price");
      if (priceElement && product.price) {
        priceElement.textContent = `$${product.price.toFixed(2)}`;
      }

      const originalPrice = document.getElementById("original-price");
      if (originalPrice && product.original_price) {
        originalPrice.textContent = `$${product.original_price.toFixed(2)}`;
        originalPrice.style.textDecoration = 'line-through';
        originalPrice.style.opacity = '0.7';
      }

      const discountElement = document.getElementById("discount");
      if (discountElement && product.discount) {
        discountElement.textContent = `${product.discount}% Off`;
      }

      const savingElement = document.getElementById("saving");
      if (savingElement && product.original_price && product.price) {
        const saving = product.original_price - product.price;
        savingElement.textContent = `Save $${saving.toFixed(2)}`;
      }
    })
    .catch((error) => {
      console.error('Error fetching product:', error);
      const errorElement = document.createElement('div');
      errorElement.className = 'alert alert-danger';
      errorElement.textContent = 'Failed to load product details. Please try again.';
      document.body.prepend(errorElement);
    });


  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) {
      console.error('No product ID found in URL');
      return;
    }

    const container = document.getElementById('related-products-container');

    fetch(`https://680fa67867c5abddd19621bf.mockapi.io/api/products/${id}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(product => {
        const currentCategory = product.category;
        return fetch('https://680fa67867c5abddd19621bf.mockapi.io/api/products/')
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(allProducts => {
            return allProducts.filter(p =>
              p.category === currentCategory &&
              String(p.id) !== String(id)
            );
          });
      })
      .then(relatedProducts => {
        if (relatedProducts.length === 0) {
          container.innerHTML = '<p class="text-muted">No related products found.</p>';
          return;
        }

        relatedProducts.forEach(prod => {
          const {
            id, name, brand, image,
            price, original_price, discount,
            availabilityStatus, review_count, stock
          } = prod;
          const hasDiscount = discount && discount !== '0%';

          const card = document.createElement('div');
          card.className = 'card me-3';
          card.style.minWidth = '16rem';

          card.innerHTML = `
              <div class="position-relative">
               <a class="item-details" data-id="${id}" href="./product.html?id=${id}">
                <img src="${image}" class="card-img-top product-image" alt="${(name).slice(0, 40)}">  
        </a>
                ${hasDiscount
              ? `<div class="badge bg-danger position-absolute top-0 start-0 m-2">
                       ${discount} OFF
                     </div>`
              : ''}
                <button class="btn btn-light rounded-circle position-absolute top-0 end-0 m-2">
                  <i class="fas fa-plus text-primary"></i>
                </button>
              </div>
              <div class="card-body p-2">
                <small class="text-uppercase text-muted">${brand}</small>
                <h6 class="card-title mt-1">${name}</h6>
                <p class="mb-1">
                  <span class="fw-bold text-danger h5 me-2">
                    $${price.toFixed(2)}
                  </span>
                  ${hasDiscount
              ? `<small class="text-muted text-decoration-line-through">
                         $${original_price.toFixed(2)}
                       </small>`
              : ''}
                </p>
                <span class="badge ${hasDiscount
              ? 'bg-danger text-white'
              : 'bg-warning text-dark'} mb-1">
                  ${hasDiscount ? 'HOT DEALS' : availabilityStatus}
                </span>
                <p class="text-muted small mb-0">
                  ${review_count}+ sold
                  <span class="${stockClass(stock)} ms-2">${stock} Left</span>
                </p>
              </div>
            `;
          container.appendChild(card);
        });
      })
      .catch(err => {
        console.error('Error loading related products:', err);
        container.innerHTML = '<p class="text-danger">Could not load related products.</p>';
      });

    updateCart()
    let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    let cartArr = [...cart];

    updateCartCount();
    logout.addEventListener("click", () => localStorage.clear());

    function updateCart() {
      fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`)
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("cart", JSON.stringify(data.cart));
          cart = data.cart;
          cartArr = [...cart];
          updateCartCount();
        })
        .catch((error) => console.log(error));
    }

    function updateCartCount() {
      countNo.innerText = cartArr.length;
    }

    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function () {
        this.classList.add("check-form-control");
        this.innerHTML = `<i class="px-5 fa-solid fa-spinner spin"></i>`;
        fetch(`https://680fa67867c5abddd19621bf.mockapi.io/api/products/${id}`)
          .then(res => res.json())
          .then(data => {
            if (cartArr.some(product => product.id === data.id)) {
              console.log(`Product ${id} Already Added`);
              setTimeout(() => {
                this.innerHTML = 'Already Added';
              }, 1000)
            } else {
              localStorage.setItem(`Quantity of ${JSON.stringify(Number(id))}`,1)
              console.log(`Added product ${id} to cart`);
              cartArr.push(data);
              localStorage.setItem("cart", JSON.stringify(cartArr));
              updateCartCount();

              fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart: cartArr }),
              });

              setTimeout(() => {
                this.innerHTML = `<i class="px-5 fa-solid fa-spinner spin"></i>`;
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
  });

}