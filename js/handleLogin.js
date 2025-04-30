document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const passwordInput = document.getElementById("password");
  const emailInput = document.getElementById("email");
  const loginFail = document.getElementById("loginFail");
  const loginSuccess = document.getElementById("loginSuccess");
  const submit = document.getElementById("submit");
  let loginFirst = document.getElementById("loginFirst")
  let successUser;


  if (sessionStorage.getItem('showLoginAlert')) {
    loginFirst.style.display = "block"
  }
  else {
    loginFirst.style.display = "none"
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    loginFail.style.display = "none"
    emailInput.classList.add("check-form-control")
    passwordInput.classList.add("check-form-control")
    submit.classList.add("check-form-control")
    submit.innerHTML = `<i class="fa-solid fa-spinner spin"></i>`
    if (form.checkValidity()) {
      fetch("https://gendy.sersawy.com/api/api.php/users/")
        .then((response) => response.json())
        .then((data) => {
          successUser = data.filter((user) => {
            return (
              emailInput.value === user.email &&
              passwordInput.value === user.password
            );
          });
          if (successUser.length !== 0) {
            localStorage.setItem("firstName", successUser[0].firstName);
            localStorage.setItem("lastName", successUser[0].lastName);
            localStorage.setItem("email", successUser[0].email);
            localStorage.setItem("id", successUser[0].id);
            localStorage.setItem("cart", successUser[0].cart);
            localStorage.setItem("favorite", successUser[0].favorite);
              sessionStorage.removeItem('showLoginAlert')
              loginFirst.style.display = "none"
              loginSuccess.style.display = "block"
              emailInput.classList.remove("check-form-control")
              passwordInput.classList.remove("check-form-control")
              submit.classList.remove("check-form-control")
              submit.innerHTML = `Login`
            setTimeout(() => location.replace("../pages/home.html"), 1000)

          } else {
            setTimeout(() => {
              loginFirst.style.display = "none"
              emailInput.classList.remove("check-form-control")
              passwordInput.classList.remove("check-form-control")
              submit.classList.remove("check-form-control")
              submit.innerHTML = `Login`
              loginFail.style.display = "block"
            }, 500);

          }
        }).catch(() => {
          loginFirst.innerHTML = "Can't connect to server"
          emailInput.classList.remove("check-form-control")
          passwordInput.classList.remove("check-form-control")
          submit.classList.remove("check-form-control")
          submit.innerHTML = `Login`
        })
    }
  });

});
