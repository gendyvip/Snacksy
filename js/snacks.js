const productsContainer = document.getElementById('products-container');
const loggedInShop = document.getElementById("snacks");
loggedInShop.classList.remove("guest")
const noResultsDiv = document.getElementById('no-results');
const minPriceSlider = document.getElementById('min-price');
const maxPriceSlider = document.getElementById('max-price');
const minPriceValue = document.getElementById('min-price-value');
const maxPriceValue = document.getElementById('max-price-value');
const resetFiltersBtn = document.getElementById('reset-filters');
const resetFiltersBtn2 = document.getElementById('reset-filters-btn');
const categoryFiltersContainer = document.getElementById('category-filters-container');
const loadingSpinner = document.getElementById('loading-spinner');


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

let products = [];
let maxProductPrice = 100;

document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();
    setupEventListeners();
});


async function fetchProducts() {
    try {
        loadingSpinner.style.display = 'flex';
        productsContainer.innerHTML = '';
        noResultsDiv.style.display = 'none';

        let apiSuccess = false;
        try {
            const response = await fetch('https://680fa67867c5abddd19621bf.mockapi.io/api/products');
            if (!response.ok) {
                throw new Error('API returned ' + response.status);
            }
            products = await response.json();
            apiSuccess = true;
        } catch (apiError) {
            console.log('API fetch failed, using fallback data', apiError);
            products = [
                {
                    "id": "38",
                    "name": "Savoy Coconut Cream 14 oz",
                    "category": "canned",
                    "price": 1.89,
                    "original_price": 24.99,
                    "discount": "32%",
                    "image": "https://img08.weeecdn.net/product/image/875/040/6E76EA7039B4DDB5.png!c1024x0.auto",
                    "rating": 4.9,
                    "review_count": 154,
                    "brand": "Tyrrell's",
                    "availabilityStatus": "In Stock"
                },
                {
                    "id": "39",
                    "name": "Organic Coconut Water",
                    "category": "drinks",
                    "price": 3.49,
                    "original_price": 4.99,
                    "discount": "30%",
                    "image": "https://via.placeholder.com/300x200?text=Coconut+Water",
                    "rating": 4.5,
                    "review_count": 89,
                    "brand": "Nature's Best",
                    "availabilityStatus": "In Stock"
                },
                {
                    "id": "40",
                    "name": "Dark Chocolate Bar",
                    "category": "chocolate",
                    "price": 2.99,
                    "original_price": 3.99,
                    "discount": "25%",
                    "image": "https://via.placeholder.com/300x200?text=Dark+Chocolate",
                    "rating": 4.7,
                    "review_count": 203,
                    "brand": "ChocoDelight",
                    "availabilityStatus": "In Stock"
                }
            ];
        }

        maxProductPrice = Math.max(10, ...products.map(p => p.price));
        maxProductPrice = Math.ceil(maxProductPrice);
        minPriceSlider.max = maxProductPrice;
        maxPriceSlider.max = maxProductPrice;
        maxPriceSlider.value = maxProductPrice;
        maxPriceValue.textContent = `$${maxProductPrice}`;

        const categories = [...new Set(products.map(p => p.category))];
        renderCategoryFilters(categories);
        renderProducts(products);

        if (!apiSuccess) {
            productsContainer.insertAdjacentHTML('afterbegin',
                '<div class="alert alert-warning">Using sample data as API is not available</div>');
        }

    } catch (error) {
        console.error('Error:', error);
        productsContainer.innerHTML = `
            <div class="alert alert-danger">
                Error loading products: ${error.message}
            </div>
        `;
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function renderCategoryFilters(categories) {
    categoryFiltersContainer.innerHTML = '';
    categories.forEach(category => {
        const categoryId = category.toLowerCase().replace(/\s+/g, '-');
        const div = document.createElement('div');
        div.className = 'form-check';
        div.innerHTML = `
            <input class="form-check-input category-filter" type="checkbox" value="${category}" id="${categoryId}">
            <label class="form-check-label" for="${categoryId}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
        `;
        categoryFiltersContainer.appendChild(div);
    });
}
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';

    if (!productsToRender || productsToRender.length === 0) {
        noResultsDiv.style.display = 'block';
        return;
    }
    noResultsDiv.style.display = 'none';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 col-sm-6 mb-4';
        productCard.innerHTML = `
            <div class="card product-card h-100">
                <span class="badge bg-danger discount-badge">${product.discount} OFF</span>
                <span class="badge bg-success category-badge">${product.category}</span>
                <a class="item-details" data-id="${product.id}" href="./product.html?id=${product.id}">
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name.slice(0, 40)}">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text mb-2">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        <span class="original-price">$${product.original_price.toFixed(2)}</span>
                    </p>
                    <p class="card-text text-muted small">
                        <i class="fas fa-star text-warning"></i> ${product.rating} (${product.review_count} reviews)<br>
                        Brand: ${product.brand}<br>
                        ${product.availabilityStatus}
                    </p>
                    <button data-id="${product.id}" class="add-to-cart w-100 ms-auto btn btn-sm btn-dark-green">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });

    setupAddToCartListeners();
}
function setupAddToCartListeners() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', async function() {
            const button = this;
            const originalHtml = button.innerHTML;
            const productId = button.getAttribute('data-id');
            button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
            button.classList.add("check-form-control");
            button.disabled = true;

            try {
                const productResponse = await fetch(`https://680fa67867c5abddd19621bf.mockapi.io/api/products/${productId}`);
                if (!productResponse.ok) throw new Error('Failed to fetch product');
                const productData = await productResponse.json();
                if (cartArr.some(item => item.id === productData.id)) {
                    button.innerHTML = `<i class="fa-solid fa-check"></i> Already Added`;
                    setTimeout(() => resetButton(button, originalHtml), 5000);
                    return;
                }
                localStorage.setItem(`Quantity of ${productId}`, 1);
                cartArr.push(productData);
                localStorage.setItem("cart", JSON.stringify(cartArr));
                updateCartCount();
                const updateResponse = await fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cart: cartArr }),
                });
                
                if (!updateResponse.ok) throw new Error('Failed to update cart');
                button.innerHTML = `<i class="fa-solid fa-check"></i> Added!`;
                setTimeout(() => resetButton(button, originalHtml), 5000);

            } catch (error) {
                console.error('Error:', error);
                button.innerHTML = `<i class="fa-solid fa-exclamation-circle"></i> Error`;
                setTimeout(() => resetButton(button, originalHtml), 2000);
            }
        });
    });
}

function resetButton(button, originalHtml) {
    button.innerHTML = originalHtml;
    button.classList.remove("check-form-control");
    button.disabled = false;
}

function filterProducts() {
    const selectedCategories = [];
    document.querySelectorAll('.category-filter:checked').forEach(filter => {
        if (filter.value !== 'all') {
            selectedCategories.push(filter.value);
        }
    });

 

    const showAllCategories = document.getElementById('all-categories').checked || selectedCategories.length === 0;
    const minPrice = parseFloat(minPriceSlider.value);
    const maxPrice = parseFloat(maxPriceSlider.value);

    let filteredProducts = products.filter(product => {
        const categoryMatch = showAllCategories || selectedCategories.includes(product.category);
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;

        return categoryMatch && priceMatch;
    });

    renderProducts(filteredProducts);
}

function setupEventListeners() {
    document.getElementById('all-categories').addEventListener('change', function () {
        if (this.checked) {
            document.querySelectorAll('.category-filter').forEach(f => {
                if (f.value !== 'all') f.checked = false;
            });
        }
        filterProducts();
    });

    categoryFiltersContainer.addEventListener('change', function (e) {
        if (e.target.classList.contains('category-filter')) {
            if (e.target.value !== 'all' && e.target.checked) {
                document.getElementById('all-categories').checked = false;
            }
            filterProducts();
        }
    });

    minPriceSlider.addEventListener('input', function () {
        minPriceValue.textContent = `$${this.value}`;
        if (parseFloat(this.value) > parseFloat(maxPriceSlider.value)) {
            maxPriceSlider.value = this.value;
            maxPriceValue.textContent = `$${this.value}`;
        }
        filterProducts();
    });

    maxPriceSlider.addEventListener('input', function () {
        maxPriceValue.textContent = `$${this.value}`;
        if (parseFloat(this.value) < parseFloat(minPriceSlider.value)) {
            minPriceSlider.value = this.value;
            minPriceValue.textContent = `$${this.value}`;
        }
        filterProducts();
    });

    resetFiltersBtn.addEventListener('click', resetFilters);
    resetFiltersBtn2.addEventListener('click', resetFilters);
}

function resetFilters() {
    document.getElementById('all-categories').checked = true;
    document.querySelectorAll('.category-filter').forEach(filter => {
        if (filter.value !== 'all') filter.checked = false;
    });

    minPriceSlider.value = 0;
    maxPriceSlider.value = maxProductPrice;
    minPriceValue.textContent = '$0';
    maxPriceValue.textContent = `$${maxProductPrice}`;

    filterProducts();
}
