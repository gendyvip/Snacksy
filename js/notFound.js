updateCart()
let cart = localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
let cartArr = [...cart]; 
let favorite = localStorage.getItem("favorite")?JSON.parse(localStorage.getItem("favorite")):[];
let favArr = [...favorite]; 
let favNo = document.getElementById("favNo");

updateCartCount();
let logout = document.getElementById("logout")
logout.addEventListener("click",()=>localStorage.clear())
function updateCart() {
  fetch(`http://localhost:5001/users/${localStorage.getItem("id")}`)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("cart", JSON.stringify(data.cart));
      localStorage.setItem("favorite", JSON.stringify(data.favorite));
      cart = data.cart;
      favorite=data.favorite
      cartArr = [...cart];
      favArr=[...favorite]
      updateCartCount();
    })
    .catch((error) => console.log(error));
}

function updateCartCount() {
  countNo.innerText = cartArr.length;
  favNo.innerText = favArr.length
}
