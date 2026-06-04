
const API_BASE = (() => {
  const { protocol, hostname, port, origin } = window.location;
  if (port === "5050") return origin;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:5050`;
  }
  return origin;
})();
const VISUAL_STORAGE_KEY = "unifocus_visual_preferences_v1";
const DAILY_STATS_KEY = "unifocus_pomodoro_daily_stats";
const HISTORY_KEY = "unifocus_pomodoro_history";

function getUserId(){
  const id = localStorage.getItem("user_id");
  return id ? Number(id) : null;
}

function scopedStorageKey(baseKey){
  const userId = getUserId();
  return userId ? `${baseKey}_user_${userId}` : `${baseKey}_guest`;
}

function visualStorageKey(){
  return scopedStorageKey(VISUAL_STORAGE_KEY);
}

function todayKey(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function computeStreakToday(){
  try{
    const raw = localStorage.getItem(scopedStorageKey(HISTORY_KEY));
    const arr = raw ? JSON.parse(raw) : [];
    const t = todayKey();
    const todays = arr.filter(e => e && e.date === t);
    let streak = 0;
    for(let i = todays.length - 1; i >= 0; i--){
      const e = todays[i];
      if(e.kind === "completed") streak++;
      else break; // a partial breaks the "continuous completed sessions" streak
    }
    return streak;
  }catch(e){
    return 0;
  }
}

function loadLocalPomodoroStats(){
  try{
    const raw = localStorage.getItem(scopedStorageKey(DAILY_STATS_KEY));
    const data = raw ? JSON.parse(raw) : {};
    const t = data[todayKey()] || { minutes: 0, sessions: 0, breaks: 0 };
    const localMin = Number(t.minutes || 0);
    const localSessions = Number(t.sessions || 0);
    const sessionsEl = document.getElementById("sessionsToday");
    if(sessionsEl) sessionsEl.textContent = String(localSessions);
    const breaksEl = document.getElementById("breaksToday");
    if(breaksEl) breaksEl.textContent = String(Number(t.breaks || 0));
    const streakEl = document.getElementById("streakToday");
    if(streakEl) streakEl.textContent = String(computeStreakToday());
    return { localMin, localSessions };
  }catch(e){
    return { localMin: 0, localSessions: 0 };
  }
}

async function loadMinutesToday(){
  const userId = getUserId();
  const { localMin } = loadLocalPomodoroStats();
  const minutesEl = document.getElementById("minutesToday");
  if(minutesEl) minutesEl.textContent = String(localMin || 0);

  // If backend is available, override minutes with authoritative value.
  if(!userId) return;

  try{
    const res = await fetch(`${API_BASE}/api/pomodoro/today/${userId}`);
    const data = await res.json();
    const backendMinutes = Number(data.minutes_today ?? 0);
    if(minutesEl) minutesEl.textContent = String(Math.max(localMin || 0, backendMinutes));
    showToast("Dashboard stats synced");
  }catch(e){
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", loadMinutesToday);

function parseDateKey(k){
  const [y,m,d] = String(k).split("-").map(Number);
  if(!y||!m||!d) return null;
  return new Date(y, m-1, d);
}

function getRangeKeys(range){
  const raw = localStorage.getItem(scopedStorageKey(DAILY_STATS_KEY));
  let data = {};
  try{ data = raw ? JSON.parse(raw) : {}; }catch(e){ data = {}; }
  const now = new Date();
  const keys = Object.keys(data || {});

  if(range === "weekly"){
    const start = new Date(now);
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - 6);
    return keys.filter(k=>{
      const dt = parseDateKey(k);
      return dt && dt >= start && dt <= now;
    });
  }

  // monthly = last 30 days (simple + predictable)
  const start = new Date(now);
  start.setHours(0,0,0,0);
  start.setDate(start.getDate() - 29);
  return keys.filter(k=>{
    const dt = parseDateKey(k);
    return dt && dt >= start && dt <= now;
  });
}

function computeAggregates(range){
  const raw = localStorage.getItem(scopedStorageKey(DAILY_STATS_KEY));
  let data = {};
  try{ data = raw ? JSON.parse(raw) : {}; }catch(e){ data = {}; }

  const keys = getRangeKeys(range);
  let totalMinutes = 0;
  let totalSessions = 0;
  keys.forEach(k=>{
    const d = data[k] || {};
    totalMinutes += Number(d.minutes || 0);
    totalSessions += Number(d.sessions || 0);
  });
  const days = range === "weekly" ? 7 : 30;
  const totalHours = totalMinutes / 60;
  const avgHours = totalHours / days;
  return {
    totalHours: Math.round(totalHours * 10) / 10,
    totalSessions,
    avgHours: Math.round(avgHours * 10) / 10
  };
}

function setRange(range){
  const weeklyBtn = document.getElementById("weeklyBtn");
  const monthlyBtn = document.getElementById("monthlyBtn");
  const active = "rgba(34,197,94,0.92)";
  const inactiveBg = "rgba(255,255,255,0.40)";
  const inactiveBorder = "rgba(0,0,0,0.18)";

  if(range === "weekly"){
    weeklyBtn.style.background = active;
    weeklyBtn.style.color = "#07130b";
    weeklyBtn.style.borderColor = "rgba(34,197,94,0.6)";
    monthlyBtn.style.background = inactiveBg;
    monthlyBtn.style.color = "var(--text)";
    monthlyBtn.style.borderColor = inactiveBorder;
  } else {
    monthlyBtn.style.background = active;
    monthlyBtn.style.color = "#07130b";
    monthlyBtn.style.borderColor = "rgba(34,197,94,0.6)";
    weeklyBtn.style.background = inactiveBg;
    weeklyBtn.style.color = "var(--text)";
    weeklyBtn.style.borderColor = inactiveBorder;
  }

  const agg = computeAggregates(range);
  document.getElementById("totalHours").textContent = String(agg.totalHours);
  document.getElementById("totalSessions").textContent = String(agg.totalSessions);
  document.getElementById("avgHours").textContent = String(agg.avgHours);
  localStorage.setItem("unifocus_dashboard_range", range);
  showToast(`${range === "weekly" ? "Weekly" : "Monthly"} stats active`);
}

function getVisualPreferences(){
  try{
    const raw = localStorage.getItem(visualStorageKey());
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}

function applyBackgroundImage(){
  const prefs = getVisualPreferences();
  const backdrop = document.getElementById("dashboardBackdrop");
  const input = document.getElementById("dashboardBackgroundImage");
  const blurToggle = document.getElementById("dashboardImageBlurEnabled");
  const blurRange = document.getElementById("dashboardImageBlurAmount");
  const image = String(prefs.dashboardBackgroundImage || prefs.backgroundImage || "").trim();
  const blurEnabled = prefs.dashboardBlurEnabled !== false;
  const blurAmount = Number.isFinite(Number(prefs.dashboardBlurAmount)) ? Number(prefs.dashboardBlurAmount) : 4;
  if(input) input.value = image;
  if(blurToggle) blurToggle.checked = blurEnabled;
  if(blurRange) blurRange.value = String(blurAmount);
  if(!backdrop) return;
  if(image){
    backdrop.classList.add("has-image");
    backdrop.style.setProperty("--dashboard-image", `url("${image}")`);
  }else{
    backdrop.classList.remove("has-image");
    backdrop.style.removeProperty("--dashboard-image");
  }
  backdrop.style.setProperty("--dashboard-blur", `${blurEnabled ? blurAmount : 0}px`);
}

function saveBackgroundImage(){
  const input = document.getElementById("dashboardBackgroundImage");
  const blurToggle = document.getElementById("dashboardImageBlurEnabled");
  const blurRange = document.getElementById("dashboardImageBlurAmount");
  const prefs = getVisualPreferences();
  prefs.dashboardBackgroundImage = String(input?.value || "").trim().slice(0, 500);
  prefs.dashboardBlurEnabled = Boolean(blurToggle?.checked);
  prefs.dashboardBlurAmount = Math.max(0, Math.min(18, Number(blurRange?.value || 4)));
  localStorage.setItem(visualStorageKey(), JSON.stringify(prefs));
  applyBackgroundImage();
  showToast(prefs.dashboardBackgroundImage ? "Dashboard background image saved" : "Dashboard background image cleared");
}

function clearBackgroundImage(){
  const input = document.getElementById("dashboardBackgroundImage");
  if(input) input.value = "";
  saveBackgroundImage();
}

function showToast(msg){
  const el = document.getElementById("dashboardToast");
  if(!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 1600);
}

    function go(page){
      window.location.href=page;
    }

    function logout(){
      ["user_id","full_name","email"].forEach((key)=>localStorage.removeItem(key));
      window.location.href="login page.html";
    }

function toggleTheme(){
  const current=document.documentElement.getAttribute("data-theme");
  const next=current==="dark"?"light":"dark";
  document.documentElement.setAttribute("data-theme",next);
  localStorage.setItem("theme",next);
  setThemeUi(next);
}

function setThemeUi(theme){
  const glyph = document.getElementById("themeGlyph");
  const hint = document.getElementById("themeHint");
  if(glyph) glyph.textContent = theme === "dark" ? "light" : "dark";
  if(hint) hint.textContent = theme === "dark" ? "Light" : "Dark";
}

    (function(){
      const saved=localStorage.getItem("theme");
      if(saved){
        document.documentElement.setAttribute("data-theme",saved);
        setThemeUi(saved);
      }
      if(!saved) setThemeUi("light");
      const name=localStorage.getItem("full_name");
      const el=document.getElementById("userName");
      if(el&&name) el.textContent=", "+name.trim(); else if(el) el.textContent="";
      document.getElementById("year").textContent=new Date().getFullYear();
      const savedRange = localStorage.getItem("unifocus_dashboard_range") || "weekly";
      applyBackgroundImage();
      setRange(savedRange === "monthly" ? "monthly" : "weekly");
    })();
  

