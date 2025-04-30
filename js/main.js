document.addEventListener("DOMContentLoaded", function () {
  const loggedIn = document.getElementById("home");
  const loggedInShop = document.getElementById("snacks");

  if (
    location.href === "https://gendyvip.github.io/Snacksy/pages/home.html" &&
    localStorage.length === 0
  ) {
    loggedIn.classList.add("guest");
    setTimeout(() => {
      localStorage.clear()
      location.href = "https://gendyvip.github.io/Snacksy/pages/login.html";
      sessionStorage.setItem("showLoginAlert", true);
    }, 1000);
  }
  else{
    sessionStorage.removeItem("showLoginAlert");
  }


  if (
    location.href === "https://gendyvip.github.io/Snacksy/pages/snacks.html" &&
    localStorage.length === 0
  ) {
    loggedInShop.classList.add("guest");
    setTimeout(() => {
     localStorage.clear()
      location.href = "https://gendyvip.github.io/Snacksy/pages/login.html";
      sessionStorage.setItem("showLoginAlert", true);
    }, 1000);
  }
  else{
    sessionStorage.removeItem("showLoginAlert");
  }


  if (
    location.href === "http://127.0.0.1:5500/pages/shop.html" &&
    localStorage.length === 0
  ) {
    loggedInShop.classList.add("guest");
    setTimeout(() => {
      location.href = "http://127.0.0.1:5500/pages/login.html";
      sessionStorage.setItem("showLoginAlert", true);
    }, 1000);
  }

  let paths = ["/about.html", "/cart.html", "/checkout.html", "/contact.html", "/home.html", "/favorite.html", "/login.html", "register.html", "settings.html", "shop.html"]
  if (!paths.some((path) => this.location.pathname !== `/pages${path}`))
    this.location.href = "/pages/notFound.html"

});
