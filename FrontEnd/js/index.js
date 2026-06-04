const AUTH_KEYS = ["user_id", "full_name", "email"];

function setThemeUi(theme){
  const themeBtn = document.getElementById("themeBtn");
  if(themeBtn) themeBtn.textContent = theme === "dark" ? "Light" : "Dark";
}

function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  setThemeUi(theme);
}

function toggleTheme(){
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
}

function isLoggedIn(){
  return Boolean(localStorage.getItem("user_id"));
}

function updateAuthUi(){
  const loggedIn = isLoggedIn();
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const primaryCta = document.getElementById("primaryCta");

  if(loginLink) loginLink.style.display = "inline-flex";
  if(signupLink) signupLink.style.display = "inline-flex";
  if(primaryCta) primaryCta.textContent = loggedIn ? "Go to Login" : "Get Started";
}

function goPrimary(){
  window.location.href = isLoggedIn() ? "login page.html" : "SignUp.html";
}

function logout(){
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  updateAuthUi();
  window.location.href = "login page.html";
}

(function init(){
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
  updateAuthUi();

  const year = document.getElementById("year");
  if(year) year.textContent = new Date().getFullYear();
})();
