const ZOOM_ENTER_KEY = "unifocus_auth_zoom";

function playZoomToPage(url, originEl){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    window.location.href = url;
    return;
  }

  const rect = originEl.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const maxDist = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const overlay = document.createElement("div");
  overlay.className = "page-zoom-overlay";
  overlay.style.setProperty("--zoom-x", `${x}px`);
  overlay.style.setProperty("--zoom-y", `${y}px`);
  overlay.style.setProperty("--zoom-r", `${maxDist + 24}px`);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add("is-expanding"));
  });

  window.setTimeout(() => {
    sessionStorage.setItem(ZOOM_ENTER_KEY, "1");
    window.location.href = url;
  }, 680);
}

window.playZoomToPage = playZoomToPage;

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
      playZoomToPage(href, loginLink);
    });
  }

  if(signupLink){
    signupLink.addEventListener("click", (event) => {
      if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = signupLink.getAttribute("href");
      if(!shouldZoomTo(href)) return;
      event.preventDefault();
      playZoomToPage(href, signupLink);
    });
  }
}

function initAuthPageEnter(){
  if(sessionStorage.getItem(ZOOM_ENTER_KEY) !== "1") return;
  sessionStorage.removeItem(ZOOM_ENTER_KEY);
  document.documentElement.classList.add("auth-zoom-enter");
  window.setTimeout(() => {
    document.documentElement.classList.remove("auth-zoom-enter");
  }, 900);
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", () => {
    bindAuthZoomLinks();
    initAuthPageEnter();
  });
}else{
  bindAuthZoomLinks();
  initAuthPageEnter();
}
