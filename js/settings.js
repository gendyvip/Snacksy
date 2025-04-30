let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let helloDear = document.getElementById("helloDear");
let deleteUser = document.getElementById("delete");
const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const updatePasswordBtn = document.getElementById("updatePassword");
const FailPasswordUpdate = document.getElementById("FailPasswordUpdate");
const successPasswordUpdate = document.getElementById("successPasswordUpdate");

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

helloDear.innerHTML = `${localStorage.getItem(
  "firstName"
)} ${localStorage.getItem("lastName")}`;
let saveSetting = document.getElementById("saveSetting");
firstName.value = localStorage.getItem("firstName");
lastName.value = localStorage.getItem("lastName");
email.value = localStorage.getItem("email");
let fetchedUser,
  updatedFirstName = firstName.value,
  updatedLastName = lastName.value,
  updatedEmail = email.value;
saveSetting.addEventListener("click", updateUser);
firstName.addEventListener("input", function (e) {
  updatedFirstName = e.target.value;
});
lastName.addEventListener("input", function (e) {
  updatedLastName = e.target.value;
});
email.addEventListener("input", function (e) {
  updatedEmail = e.target.value;
});
function updateUser() {
  email.classList.add("check-form-control");
  firstName.classList.add("check-form-control");
  lastName.classList.add("check-form-control");
  saveSetting.classList.add("check-form-control");
  saveSetting.innerHTML = `<i class="fa-solid fa-spinner spin"></i>`;
  setTimeout(() => {
    fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: updatedFirstName,
        lastName: updatedLastName,
        email: updatedEmail,
      }),
    }).then(() => {
      email.classList.remove("check-form-control");
      firstName.classList.remove("check-form-control");
      lastName.classList.remove("check-form-control");
      saveSetting.classList.remove("check-form-control");
      saveSetting.innerHTML = `Save Changes`;
      localStorage.setItem("firstName", updatedFirstName);
      localStorage.setItem("lastName", updatedLastName);
      localStorage.setItem("email", updatedEmail);
      helloDear.innerHTML = `${localStorage.getItem(
        "firstName"
      )} ${localStorage.getItem("lastName")}`;
    });

  }, 1000);
}

deleteUser.addEventListener("click", deleteAccount);
function deleteAccount() {
  deleteUser.classList.add("check-form-control");
  deleteUser.innerHTML = `<i class="fa-solid fa-spinner spin"></i>`;
  fetch(`https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`, {
    method: "DELETE",
  }).then(() => {
    location.href = "../pages/login.html";
  })
  localStorage.clear();
}

updatePasswordBtn.addEventListener("click", updatePassword);

async function updatePassword() {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    FailPasswordUpdate.style.display = "block";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    FailPasswordUpdate.childNodes[1].innerHTML = "Password isn't matched";
    FailPasswordUpdate.style.display = "block";
    return;
  }

  updatePasswordBtn.classList.add("check-form-control");
  updatePasswordBtn.innerHTML = `<i class="fa-solid fa-spinner spin"></i>`;

  try {
    const verifyResponse = await fetch(
      `https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`
    );
    const user = await verifyResponse.json();

    if (user.password !== currentPassword.value) {
      throw new Error("Current password is incorrect");

    }

    const updateResponse = await fetch(
      `https://gendy.sersawy.com/api/api.php/users?id=${localStorage.getItem("id")}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPassword.value,
          confirmPassword: newPassword.value,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Failed to update password");
    }

    successPasswordUpdate.style.display = "block"
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error) {
    FailPasswordUpdate.childNodes[1].innerHTML = error.message;
    FailPasswordUpdate.style.display = "block";
    console.error("Password update error:", error);
  } finally {
    updatePasswordBtn.classList.remove("check-form-control");
    updatePasswordBtn.innerHTML = "Update Password";
  }
}
