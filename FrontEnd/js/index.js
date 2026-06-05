const AUTH_KEYS = ["user_id", "full_name", "email"];

if("scrollRestoration" in history){
  history.scrollRestoration = "manual";
}

function forceTopScroll(){
  window.scrollTo({ top:0, left:0, behavior:"auto" });
}

function setThemeUi(theme){
  const themeBtn = document.getElementById("themeBtn");
  if(themeBtn){
    themeBtn.textContent = theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";
    themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
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

function initScrollReveal(){
  const revealItems = document.querySelectorAll(
    ".reveal-fog, .reveal-fade, .reveal-module, .reveal-module-head"
  );
  if(!revealItems.length) return;

  if(!("IntersectionObserver" in window)){
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold:0.04,
    rootMargin:"0px 0px 8% 0px"
  });

  revealItems.forEach((item, index) => {
    const stagger = item.classList.contains("reveal-module") ? index * 120 : index * 70;
    item.style.transitionDelay = `${stagger}ms`;
    observer.observe(item);
  });
}

(function init(){
  forceTopScroll();

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
  updateAuthUi();
  initScrollReveal();

  const year = document.getElementById("year");
  if(year) year.textContent = new Date().getFullYear();

  requestAnimationFrame(forceTopScroll);
  window.addEventListener("load", forceTopScroll, { once:true });
  window.addEventListener("pageshow", forceTopScroll);
})();
