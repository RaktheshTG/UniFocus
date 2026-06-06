function setThemeUi(theme){
  const themeBtn = document.getElementById("themeBtn");
  if(!themeBtn) return;
  themeBtn.textContent = theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";
  themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
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

(function initNavbarTheme(){
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
})();
