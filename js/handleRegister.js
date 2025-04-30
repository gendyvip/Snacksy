document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const formControl = document.getElementsByClassName("form-control")
  const submit = document.getElementById("submit");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordStrengthBar = document.getElementById("passwordStrengthBar");
  const passwordStrengthText = document.getElementById("passwordStrengthText");
  const passwordStrengthTextContainer = document.getElementById("passwordStrengthTextContainer");
  const passwordStrengthBarContainer = document.getElementById("passwordStrengthBarContainer");
  const signUpSuccess = document.getElementById("signUpSuccess");
  const signUpFail = document.getElementById("signUpFail");


  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Show/hide password strength indicator

  passwordInput.addEventListener("input", function () {
    const password = this.value;

    if (password.length >= 1) {
      passwordStrengthBarContainer.style.display = "block";
      passwordStrengthTextContainer.style.display = "block";
    } else {
      passwordStrengthBarContainer.style.display = "none";
      passwordStrengthTextContainer.style.display = "none";
    }

    // Calculate strength
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    let width = 0;
    let color = "";
    let text = "";

    if (strength <= 2) {
      width = 33;
      color = "#dc3545";
      text = "Weak";
    } else if (strength <= 4) {
      width = 66;
      color = "#ffc107";
      text = "Medium";
    } else {
      width = 100;
      color = "#28a745";
      text = "Strong";
    }

    passwordStrengthBar.style.width = width + "%";
    passwordStrengthBar.style.backgroundColor = color;
    passwordStrengthText.textContent = text;
    passwordStrengthText.style.color = color;
  });

  // Real-time validation for inputs
  form.querySelectorAll(".form-control").forEach((input) => {
    input.addEventListener("input", function () {
      if (input.checkValidity()) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
      }
    });
  });

  // Confirm password validation
  confirmPasswordInput.addEventListener("input", validateConfirmPassword);
  passwordInput.addEventListener("input", validateConfirmPassword);

  function validateConfirmPassword() {
    if (
      confirmPasswordInput.value !== passwordInput.value ||
      !passwordInput.checkValidity()
    ) {
      confirmPasswordInput.classList.add("is-invalid");
      confirmPasswordInput.classList.remove("is-valid");
      confirmPasswordInput.setCustomValidity("Passwords do not match");
    } else {
      confirmPasswordInput.classList.remove("is-invalid");
      confirmPasswordInput.classList.add("is-valid");
      confirmPasswordInput.setCustomValidity("");
    }
  }

  emailInput.addEventListener("input", validateEmail);

  function validateEmail() {
    if (!emailPattern.test(emailInput.value)) {
      emailInput.setCustomValidity(
        "Please provide a valid email address (in email@domain.com format)."
      );
    } else {
      emailInput.setCustomValidity("");
    }
  }
  // Final form submission validation
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    signUpFail.style.display = "none"
    formControl[0].classList.add("check-form-control")
    formControl[1].classList.add("check-form-control")
    formControl[2].classList.add("check-form-control")
    formControl[3].classList.add("check-form-control")
    submit.classList.add("check-form-control")
    submit.innerHTML = `<i class="fa-solid fa-spinner spin"></i>`
    setTimeout(() => {
      form.classList.add("was-validated");
      validateConfirmPassword()
    }, 500)
    if (form.checkValidity()) {
      fetch("https://gendy.sersawy.com/api/api.php/users")
        .then((response) => response.json())
        .then((data) => {
          if (data.some((user) => user.email === emailInput.value)) {
            setTimeout(() => {
              formControl[0].classList.remove("check-form-control")
              formControl[1].classList.remove("check-form-control")
              formControl[2].classList.remove("check-form-control")
              formControl[3].classList.remove("check-form-control")
              submit.classList.remove("check-form-control")
              submit.innerHTML = `Sign up`
              signUpFail.style.display = "block"
              form.classList.remove("was-validated");
              form.reset();
              form.querySelectorAll(".form-control").forEach((input) => {
                input.classList.remove("is-valid");
                input.classList.remove("is-invalid");
              });
              passwordStrengthBarContainer.style.display = "none";
              passwordStrengthTextContainer.style.display = "none";
            }, 1000)

          } else {
            signUpFail.style.display = "none"
            signUpSuccess.style.display = "block"
              formControl[0].classList.remove("check-form-control")
              formControl[1].classList.remove("check-form-control")
              formControl[2].classList.remove("check-form-control")
              formControl[3].classList.remove("check-form-control")
              submit.classList.remove("check-form-control")
              submit.innerHTML = `Sign up`
              const formData = new FormData(form);
              const userData = Object.fromEntries(formData.entries());
              console.log(userData)
              fetch("https://gendy.sersawy.com/api/api.php/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...userData, "cart": [], "favorite": [] }),
              });
              setTimeout(()=>{
                location.href = "../pages/login.html";
              },1500)
          }
        });
    }
    else {
      setTimeout(() => {
        formControl[0].classList.remove("check-form-control")
        formControl[1].classList.remove("check-form-control")
        formControl[2].classList.remove("check-form-control")
        formControl[3].classList.remove("check-form-control")
        submit.classList.remove("check-form-control")
        submit.innerHTML = `Sign up`
      }, 500)
    }
  });
});
