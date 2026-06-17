// Shared navbar helpers for all post-login pages.
// Provides: goDashboard, logout, theme sync.

function goDashboard(){
  window.location.href = "dashboard.html";
}

function logout(){
  ["user_id","full_name","email"].forEach(function(key){
    localStorage.removeItem(key);
  });
  window.location.href = "login.html";
}

// Ensure navbar theme glyph stays in sync across pages that define
// their own setThemeUi (some pages use themeGlyph/themeHint like
// dashboard/pomodoro; others use a single #themeBtn like navbar.js).
function syncNavbarTheme(){
  const theme = document.documentElement.getAttribute("data-theme") || "light";
  const glyph = document.getElementById("themeGlyph");
  const hint = document.getElementById("themeHint");
  if(glyph) glyph.textContent = theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";
  if(hint) hint.textContent = theme === "dark" ? "Light" : "Dark";
}

(function(){
  const saved = localStorage.getItem("theme");
  if(saved){
    document.documentElement.setAttribute("data-theme", saved);
  }
  syncNavbarTheme();
})();
