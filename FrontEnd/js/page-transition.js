function playDriftTransition(url, text) {
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    window.location.href = url;
    return;
  }

  // 1. Create a container for existing content to slide it out independently
  const container = document.createElement("div");
  container.className = "page-drift-container";
  
  // Move all current body children into the container
  while (document.body.firstChild) {
    container.appendChild(document.body.firstChild);
  }
  document.body.appendChild(container);

  // 2. Create and slide in the intermediate overlay
  const overlay = document.createElement("div");
  overlay.className = "drift-overlay";
  overlay.innerHTML = `<div class="drift-text">${text}</div>`;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    container.classList.add("is-drifting");
    overlay.classList.add("is-active");
  });

  // 3. Navigate while the overlay is visible to prevent the "blank" gap
  window.setTimeout(() => {
    window.location.href = url;
  }, 750);
}

// Compatibility layer for index.js
window.playZoomToPage = (url) => {
  const text = url.toLowerCase().includes("signup") ? "Heading to sign up page" : "Heading to login page";
  playDriftTransition(url, text);
};

// Entrance animation on page load for Login/SignUp
function handleEntryDrift() {
  const path = window.location.pathname.toLowerCase();
  const isAuthPage = path.includes("login") || path.includes("signup");
  
  if (isAuthPage) {
    const text = path.includes("signup") ? "Heading to sign up page" : "Heading to login page";
    
    // Create the overlay so it's visible immediately on load
    const overlay = document.createElement("div");
    overlay.className = "drift-overlay is-active";
    overlay.innerHTML = `<div class="drift-text">${text}</div>`;
    document.body.appendChild(overlay);

    // Animate the overlay OUT and the page content IN
    requestAnimationFrame(() => {
      overlay.classList.add("is-leaving");
    document.body.classList.add("page-drift-in");
    });
  }
}

function bindAuthZoomLinks(){
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");

  function shouldZoomTo(href){
    if(!href || href.startsWith("#")) return false;
    const targetPath = new URL(href, window.location.href).pathname;
    return targetPath !== window.location.pathname;
  }

  if(loginLink){
    loginLink.addEventListener("click", (event) => {
      if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = loginLink.getAttribute("href");
      if(!shouldZoomTo(href)) return;
      event.preventDefault();
      playDriftTransition(href, "Heading to login page");
    });
  }

  if(signupLink){
    signupLink.addEventListener("click", (event) => {
      if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = signupLink.getAttribute("href");
      if(!shouldZoomTo(href)) return;
      event.preventDefault();
      playDriftTransition(href, "Heading to sign up page");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleEntryDrift();
  bindAuthZoomLinks();
});
