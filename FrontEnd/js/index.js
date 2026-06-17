const AUTH_KEYS = ["user_id", "full_name", "email"];

if("scrollRestoration" in history){
  history.scrollRestoration = "manual";
}

function forceTopScroll(){
  window.scrollTo({ top:0, left:0, behavior:"auto" });
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
  const url = isLoggedIn() ? "login.html" : "SignUp.html";
  const primaryCta = document.getElementById("primaryCta");
  if(typeof window.playZoomToPage === "function" && primaryCta){
    window.playZoomToPage(url, primaryCta);
    return;
  }
  window.location.href = url;
}

function logout(){
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  updateAuthUi();
  window.location.href = "login.html";
}

function initSectionTitleAnimations(){
  const sectionHeads = document.querySelectorAll(".section-head-features, .section-head-modules");
  if(!sectionHeads.length) return;

  if(!("IntersectionObserver" in window)){
    sectionHeads.forEach((head) => head.classList.add("is-title-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add("is-title-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold:0.35,
    rootMargin:"0px 0px -5% 0px"
  });

  sectionHeads.forEach((head) => observer.observe(head));
}

function initScrollReveal(){
  const revealItems = document.querySelectorAll(
    ".reveal-fog, .reveal-fade, .reveal-module"
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
    // Only apply stagger to specific module reveals to avoid "fiddling" with feature cards
    if (item.classList.contains("reveal-module")) {
      item.style.transitionDelay = `${index * 120}ms`;
    }
    observer.observe(item);
  });
}

(function init(){
  forceTopScroll();

  updateAuthUi();
  initSectionTitleAnimations();
  initScrollReveal();

  function initContactReveal() {
  const head = document.querySelector(".reveal-contact-head");
  const cards = document.querySelectorAll(".contact-card");
  if (!head && !cards.length) return;

  if (!("IntersectionObserver" in window)) {
    if (head) head.classList.add("is-visible");
    cards.forEach(c => c.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px 0px 0px" });

  if (head) observer.observe(head);
  cards.forEach(c => observer.observe(c));
}

initContactReveal(); 

  // Handle Hero Cursor persistence: Wait for typing (4.2s) + 5 seconds then hide
  setTimeout(() => {
    const quote = document.querySelector('.typing-quote');
    if(quote) quote.classList.add('hide-cursors');
  }, 9200);

  const year = document.getElementById("year");
  if(year) year.textContent = new Date().getFullYear();

  requestAnimationFrame(forceTopScroll);
  window.addEventListener("load", forceTopScroll, { once:true });
  window.addEventListener("pageshow", forceTopScroll);
})();
