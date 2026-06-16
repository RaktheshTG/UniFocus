const TOTAL_SEGMENTS = 60;
const STORAGE_KEY = "unifocus_pomodoro_preferences_v2";
const VISUAL_STORAGE_KEY = "unifocus_visual_preferences_v1";
const SPOTIFY_CLIENT_ID = "";
const PINNED_PLAYLIST_LIMIT = 4;
const DAILY_STATS_KEY = "unifocus_pomodoro_daily_stats";
const HISTORY_KEY = "unifocus_pomodoro_history";
const CUSTOM_LOCAL_BACKGROUND_KEY = "unifocus_pomodoro_local_background_v1";

const backgroundPresets = [
  { id: "aurora", name: "Aurora Drift", css: "linear-gradient(125deg, rgba(255,255,255,0.04) 0 10%, transparent 10% 24%, rgba(255,255,255,0.03) 24% 28%, transparent 28% 100%), radial-gradient(circle at 12% 18%, rgba(124,242,200,0.26), transparent 24%), radial-gradient(circle at 82% 16%, rgba(160,107,255,0.3), transparent 28%), radial-gradient(circle at 52% 84%, rgba(99,179,255,0.22), transparent 30%), linear-gradient(145deg, #05101b 0%, #0f1c2d 40%, #17263b 100%)" },
  { id: "rain-window", name: "Rain Window", css: "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 14% 12%, rgba(208,240,255,0.2), transparent 20%), linear-gradient(180deg, rgba(8,17,29,0.78), rgba(10,19,28,0.2)), linear-gradient(135deg, #06131d 0%, #163046 52%, #214360 100%)" },
  { id: "hearth", name: "Hearth Glow", css: "radial-gradient(circle at 50% 92%, rgba(255,100,70,0.34), transparent 24%), radial-gradient(circle at 18% 24%, rgba(255,222,174,0.12), transparent 18%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2)), linear-gradient(145deg, #170c11 0%, #341719 42%, #5b261e 100%)" },
  { id: "cloud-loft", name: "Cloud Loft", css: "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.28), transparent 18%), radial-gradient(circle at 72% 24%, rgba(205,228,255,0.25), transparent 24%), radial-gradient(circle at 44% 60%, rgba(178,205,255,0.12), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0)), linear-gradient(145deg, #182338 0%, #304666 44%, #57769d 100%)" },
  { id: "midnight-ocean", name: "Midnight Ocean", css: "radial-gradient(circle at 20% 18%, rgba(116,226,255,0.18), transparent 22%), radial-gradient(circle at 80% 24%, rgba(58,123,213,0.22), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0)), linear-gradient(160deg, #020b18 0%, #0a2340 40%, #113a57 100%)" },
  { id: "solar-dust", name: "Solar Dust", css: "radial-gradient(circle at 14% 16%, rgba(255,215,128,0.22), transparent 18%), radial-gradient(circle at 72% 24%, rgba(255,119,61,0.16), transparent 22%), radial-gradient(circle at 44% 78%, rgba(255,249,217,0.12), transparent 20%), linear-gradient(140deg, #140912 0%, #3a1728 45%, #7b2a28 100%)" },
  { id: "neon-lagoon", name: "Neon Lagoon", css: "linear-gradient(120deg, rgba(255,255,255,0.04) 0 10%, transparent 10% 24%, rgba(255,255,255,0.03) 24% 30%, transparent 30% 100%), radial-gradient(circle at 16% 20%, rgba(38,244,208,0.22), transparent 22%), radial-gradient(circle at 82% 26%, rgba(44,125,255,0.22), transparent 26%), radial-gradient(circle at 52% 84%, rgba(131,85,255,0.24), transparent 28%), linear-gradient(145deg, #05131d 0%, #0d2940 40%, #1b4769 100%)" },
  { id: "lilac-dawn", name: "Lilac Dawn", css: "radial-gradient(circle at 18% 18%, rgba(255,250,255,0.34), transparent 18%), radial-gradient(circle at 72% 20%, rgba(244,205,255,0.28), transparent 24%), radial-gradient(circle at 48% 70%, rgba(255,205,180,0.18), transparent 28%), linear-gradient(150deg, #271939 0%, #5b4f92 46%, #f2a67e 100%)" },
  { id: "thread-of-longing", name: "Thread of Longing", css: "linear-gradient(180deg, rgba(214,242,255,0.02), rgba(3,8,24,0.05)), url(\"assets/yourname2.png\") center 44% / cover no-repeat" },
  { id: "custom", name: "Custom +", css: "radial-gradient(circle at 24% 20%, rgba(124,242,200,0.24), transparent 26%), radial-gradient(circle at 78% 70%, rgba(160,107,255,0.3), transparent 30%), linear-gradient(145deg, #091421, #1b2740)", custom: true }
];

const ringColorPresets = [
  { id: "mint", name: "Liquid Mint", colors: ["#7cf2c8"] },
  { id: "ocean", name: "Ocean Blue", colors: ["#62cfff"] },
  { id: "violet", name: "Soft Violet", colors: ["#b48cff"] },
  { id: "rose", name: "Rose Quartz", colors: ["#ff8fb8"] },
  { id: "amber", name: "Warm Amber", colors: ["#ffd074"] },
  { id: "gradient", name: "Aurora Gradient", colors: ["#6fffd2", "#65c7ff", "#b58cff", "#ff8fc6"], gradient: true },
  { id: "sunset-gradient", name: "Sunset Glow", colors: ["#ff5e62", "#ff9966", "#ffcc00"], gradient: true },
  { id: "cosmic-gradient", name: "Cosmic Neon", colors: ["#00f2fe", "#4facfe", "#b58cff", "#ff8fc6"], gradient: true },
  { id: "custom", name: "Custom", colors: ["#7cf2c8"], custom: true }
];

const ambiencePresets = [
  { id: "stars", name: "Stars" },
  { id: "rain", name: "Rain" },
  { id: "fireplace", name: "Fireplace" },
  { id: "fireflies", name: "Fireflies" },
  { id: "comets", name: "Comets" },
  { id: "mist", name: "Mist" },
  { id: "storm", name: "Storm" },
  { id: "aurora-night", name: "Aurora Night" },
  { id: "calm", name: "Still" }
];

const spotifyPlaylists = [
  { id: "37i9dQZF1DX8Uebhn9wzrS", name: "chill lofi study beats", note: "Soft lofi focus" },
  { id: "37i9dQZF1DWZeKCadgRdKQ", name: "Deep Focus", note: "Minimal + productive" },
  { id: "37i9dQZF1DX4sWSpwq3LiO", name: "Peaceful Piano", note: "Quiet instrumental" }
];

let preferences = {
  focusMinutes: 25,
  breakMinutes: 5,
  soundPreset: "glass",
  soundVolume: 70,
  background: "aurora",
  ambience: "stars",
  ringColor: "mint",
  customRingColor: "#7cf2c8",
  sessionName: "Focus Sprint",
  desktopAlerts: false,
  autoStartBreak: true,
  spotifyEmailMode: "current",
  spotifyAltEmail: "",
  spotifyPlaylistId: spotifyPlaylists[0].id,
  pinnedSpotifyPlaylists: [],
  favoriteBackgrounds: [],
  favoriteAmbiences: []
};

let focusMinutesSetting = 25;
let breakMinutesSetting = 5;
let minutes = 25;
let seconds = 0;
let timer = null;
let timerEndsAt = null;
let mode = "FOCUS";
let focusStartRemainingSec = null;
let breakStartRemainingSec = null;
let audioCtx = null;
let starInterval = null;
let rainInterval = null;
let emberInterval = null;
let mistInterval = null;
let fireflyInterval = null;
let cometInterval = null;
let focusModeInactivityTimer = null;
let focusModeEnabled = false;
let focusModeSuppressMouseUntil = 0;
let countedPartialMinutes = 0;

const visualPreferences = { backgroundImage: "" };

const ring = document.getElementById("ring");
const timeEl = document.getElementById("time");
const modeLabel = document.getElementById("modeLabel");
const timerMetaEl = document.getElementById("timerMeta");
const focusInput = document.getElementById("focusMinutes");
const breakInput = document.getElementById("breakMinutes");
const sessionNameInput = document.getElementById("sessionName");
const autoStartBreakInput = document.getElementById("autoStartBreak");
const desktopAlertsInput = document.getElementById("desktopAlerts");
const soundPresetEl = document.getElementById("soundPreset");
const soundVolumeEl = document.getElementById("soundVolume");
const statusPillEl = document.getElementById("statusPill");
const sessionTitleEl = document.getElementById("sessionTitle");
const toastEl = document.getElementById("toast");
const modalEl = document.getElementById("modal");
const modalTitleEl = document.getElementById("modalTitle");
const modalSubEl = document.getElementById("modalSub");
const modalBodyEl = document.getElementById("modalBody");
const backdropEl = document.getElementById("backdrop");
const starsEl = document.getElementById("stars");
const rainEl = document.getElementById("rain");
const embersEl = document.getElementById("embers");
const mistEl = document.getElementById("mist");
const firefliesEl = document.getElementById("fireflies");
const cometsEl = document.getElementById("comets");
const auroraEl = document.getElementById("aurora");
const lightningEl = document.getElementById("lightning");
const hearthEl = document.getElementById("hearth");
const backgroundPresetEl = document.getElementById("backgroundPresets");
const ambiencePresetEl = document.getElementById("ambiencePresets");
const activeSoundLabelEl = document.getElementById("activeSoundLabel");
const activeBackdropLabelEl = document.getElementById("activeBackdropLabel");
const activeAmbienceLabelEl = document.getElementById("activeAmbienceLabel");
const currentEmailDisplayEl = document.getElementById("currentEmailDisplay");
const spotifyAltEmailEl = document.getElementById("spotifyAltEmail");
const spotifyStatusEl = document.getElementById("spotifyConnectionStatus");
const playlistButtonsEl = document.getElementById("playlistButtons");
const spotifyEmbedEl = document.getElementById("spotifyEmbed");
const spotifyCustomPlaylistEl = document.getElementById("spotifyCustomPlaylist");
const spotifyNowPlayingEl = document.getElementById("spotifyNowPlaying");
const spotifyNowPlayingMetaEl = document.getElementById("spotifyNowPlayingMeta");
const focusModeShellEl = document.getElementById("focusModeShell");
const focusModeTimeEl = document.getElementById("focusModeTime");
const focusModeLabelEl = document.getElementById("focusModeLabel");
const focusModeSessionNameEl = document.getElementById("focusModeSessionName");
const focusModeRingEl = document.getElementById("focusModeRing");
const focusModeSoundPresetEl = document.getElementById("focusModeSoundPreset");
const focusModeBackgroundEl = document.getElementById("focusModeBackground");
const focusModeAmbienceEl = document.getElementById("focusModeAmbience");
const focusModeRingColorEl = document.getElementById("focusModeRingColor");
const ringColorPresetEl = document.getElementById("ringColorPresets");
const ringCustomColorEl = document.getElementById("ringCustomColor");
const backgroundImageUrlEl = document.getElementById("backgroundImageUrl");
const backgroundImageSyncEl = document.getElementById("backgroundImageSync");
const backgroundBlurEnabledEl = document.getElementById("backgroundBlurEnabled");
const backgroundBlurAmountEl = document.getElementById("backgroundBlurAmount");
const segments = [];
const focusModeSegments = [];

const soundPresets = {
  glass: { label: "Glass Bell", play(volume){ const ctx = getAudioContext(); const now = ctx.currentTime; tone(ctx, "sine", 880, 0.32 * volume, now, 0.55); tone(ctx, "triangle", 1320, 0.18 * volume, now + 0.03, 0.44); } },
  dawn: { label: "Dawn Chime", play(volume){ const ctx = getAudioContext(); const now = ctx.currentTime; [523.25, 659.25, 783.99].forEach((freq, index) => tone(ctx, "sine", freq, (0.22 - index * 0.03) * volume, now + index * 0.1, 0.7)); } },
  orbit: { label: "Orbit Synth", play(volume){ const ctx = getAudioContext(); const now = ctx.currentTime; sweep(ctx, 440, 660, 0.2 * volume, now, 0.45, "triangle"); sweep(ctx, 660, 880, 0.14 * volume, now + 0.1, 0.38, "sawtooth"); } },
  soft: { label: "Soft Marimba", play(volume){ const ctx = getAudioContext(); const now = ctx.currentTime; [659.25, 523.25, 784].forEach((freq, index) => pluck(ctx, freq, (0.22 - index * 0.04) * volume, now + index * 0.12)); } },
  bloom: { label: "Bloom Pulse", play(volume){ const ctx = getAudioContext(); const now = ctx.currentTime; [392, 523.25, 659.25, 880].forEach((freq, index) => tone(ctx, "sine", freq, (0.18 - index * 0.02) * volume, now + index * 0.08, 0.48)); } },
  ember: { label: "Ember Gong", play(volume){ const ctx = getAudioContext(); const now = ctx.currentTime; tone(ctx, "triangle", 220, 0.25 * volume, now, 1.2); tone(ctx, "sine", 330, 0.18 * volume, now + 0.05, 0.95); tone(ctx, "sine", 440, 0.12 * volume, now + 0.12, 0.72); } }
};

for(let i = 0; i < TOTAL_SEGMENTS; i++){
  const seg = document.createElement("div");
  seg.className = "segment";
  seg.style.transform = `rotate(${i * 6}deg)`;
  ring.appendChild(seg);
  segments.push(seg);

  const focusSeg = document.createElement("div");
  focusSeg.className = "focus-ridge";
  focusSeg.style.transform = `rotate(${i * 6}deg)`;
  if(focusModeRingEl) focusModeRingEl.appendChild(focusSeg);
  focusModeSegments.push(focusSeg);
}

function clampInt(value, min, max, fallback){
  const n = Number(value);
  if(!Number.isFinite(n)) return fallback;
  const i = Math.round(n);
  return Math.max(min, Math.min(max, i));
}

function getAudioContext(){
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function tone(ctx, type, frequency, volume, start, duration){
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function sweep(ctx, from, to, volume, start, duration, type){
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.04);
}

function pluck(ctx, frequency, volume, start){
  tone(ctx, "triangle", frequency, volume, start, 0.32);
  tone(ctx, "sine", frequency * 2, volume * 0.4, start, 0.22);
}

async function loadPreferences(){
  try{
    const legacyRaw = localStorage.getItem(STORAGE_KEY);
    const legacy = legacyRaw ? JSON.parse(legacyRaw) : {};
    const cached = UserSync.readLocal(STORAGE_KEY, legacy);
    const saved = await UserSync.load("pomodoro", STORAGE_KEY, cached);
    preferences = { ...preferences, ...saved };
  }catch(e){
    preferences = { ...preferences };
  }

  preferences.focusMinutes = clampInt(preferences.focusMinutes, 5, 180, 25);
  preferences.breakMinutes = clampInt(preferences.breakMinutes, 1, 60, 5);
  preferences.soundVolume = clampInt(preferences.soundVolume, 0, 100, 70);
  preferences.soundPreset = soundPresets[preferences.soundPreset] ? preferences.soundPreset : "glass";
  preferences.background = backgroundPresets.some((item) => item.id === preferences.background) ? preferences.background : "aurora";
  preferences.ambience = ambiencePresets.some((item) => item.id === preferences.ambience) ? preferences.ambience : "stars";
  preferences.ringColor = ringColorPresets.some((item) => item.id === preferences.ringColor) ? preferences.ringColor : "mint";
  preferences.customRingColor = /^#[0-9a-f]{6}$/i.test(preferences.customRingColor) ? preferences.customRingColor : "#7cf2c8";
  preferences.sessionName = String(preferences.sessionName || "Focus Sprint").slice(0, 40).trim() || "Focus Sprint";
  preferences.spotifyEmailMode = preferences.spotifyEmailMode === "new" ? "new" : "current";
  preferences.spotifyAltEmail = String(preferences.spotifyAltEmail || "").slice(0, 120);
  preferences.spotifyPlaylistId = spotifyPlaylists.some((item) => item.id === preferences.spotifyPlaylistId) ? preferences.spotifyPlaylistId : spotifyPlaylists[0].id;
  preferences.pinnedSpotifyPlaylists = Array.isArray(preferences.pinnedSpotifyPlaylists)
    ? preferences.pinnedSpotifyPlaylists.slice(0, PINNED_PLAYLIST_LIMIT).filter((item) => item && item.id && item.name)
    : [];
  preferences.favoriteBackgrounds = Array.isArray(preferences.favoriteBackgrounds)
    ? preferences.favoriteBackgrounds.filter((id) => backgroundPresets.some((item) => item.id === id))
    : [];
  preferences.favoriteAmbiences = Array.isArray(preferences.favoriteAmbiences)
    ? preferences.favoriteAmbiences.filter((id) => ambiencePresets.some((item) => item.id === id))
    : [];
  focusMinutesSetting = preferences.focusMinutes;
  breakMinutesSetting = preferences.breakMinutes;
}

function savePreferences(){
  UserSync.save("pomodoro", STORAGE_KEY, preferences);
}

async function loadVisualPreferences(){
  try{
    const saved = await UserSync.load(
      "visual",
      VISUAL_STORAGE_KEY,
      UserSync.readLocal(VISUAL_STORAGE_KEY, {})
    );
    visualPreferences.dashboardBackgroundImage = String(saved.dashboardBackgroundImage || saved.backgroundImage || "").trim().slice(0, 500);
    visualPreferences.pomodoroBackgroundImage = String(saved.pomodoroBackgroundImage || "").trim().slice(0, 500);
    visualPreferences.pomodoroSyncWithDashboard = saved.pomodoroSyncWithDashboard !== false;
    visualPreferences.dashboardBlurEnabled = saved.dashboardBlurEnabled !== false;
    visualPreferences.dashboardBlurAmount = Number.isFinite(Number(saved.dashboardBlurAmount)) ? Number(saved.dashboardBlurAmount) : 4;
    visualPreferences.pomodoroBlurEnabled = saved.pomodoroBlurEnabled !== false;
    visualPreferences.pomodoroBlurAmount = Number.isFinite(Number(saved.pomodoroBlurAmount)) ? Number(saved.pomodoroBlurAmount) : 4;
  }catch(e){
    visualPreferences.dashboardBackgroundImage = "";
    visualPreferences.pomodoroBackgroundImage = "";
    visualPreferences.pomodoroSyncWithDashboard = true;
    visualPreferences.dashboardBlurEnabled = true;
    visualPreferences.dashboardBlurAmount = 4;
    visualPreferences.pomodoroBlurEnabled = true;
    visualPreferences.pomodoroBlurAmount = 4;
  }
}

function saveVisualPreferences(){
  UserSync.save("visual", VISUAL_STORAGE_KEY, visualPreferences);
}

function getLocalBackgroundStorageKey(){
  return UserSync.scopedKey(CUSTOM_LOCAL_BACKGROUND_KEY);
}

function getLocalBackgroundImage(){
  return localStorage.getItem(getLocalBackgroundStorageKey()) || "";
}

function setLocalBackgroundImage(value){
  const key = getLocalBackgroundStorageKey();
  if(value) localStorage.setItem(key, value);
  else localStorage.removeItem(key);
}

function syncBackgroundImageControls(){
  const syncEnabled = visualPreferences.pomodoroSyncWithDashboard !== false;
  const selectedImage = syncEnabled
    ? visualPreferences.dashboardBackgroundImage
    : visualPreferences.pomodoroBackgroundImage;
  backgroundImageSyncEl.checked = syncEnabled;
  backgroundImageUrlEl.value = selectedImage === "__local__" ? "" : selectedImage;
  backgroundImageUrlEl.placeholder = selectedImage === "__local__"
    ? "Local device image selected"
    : "Paste image URL";
  backgroundImageUrlEl.disabled = syncEnabled;
  backgroundBlurEnabledEl.checked = syncEnabled
    ? visualPreferences.dashboardBlurEnabled !== false
    : visualPreferences.pomodoroBlurEnabled !== false;
  backgroundBlurAmountEl.value = String(syncEnabled
    ? Number(visualPreferences.dashboardBlurAmount ?? 4)
    : Number(visualPreferences.pomodoroBlurAmount ?? 4));
  backgroundBlurEnabledEl.disabled = syncEnabled;
  backgroundBlurAmountEl.disabled = syncEnabled;
}

function saveBackgroundImage(){
  visualPreferences.pomodoroSyncWithDashboard = backgroundImageSyncEl.checked;
  if(!visualPreferences.pomodoroSyncWithDashboard){
    visualPreferences.pomodoroBackgroundImage = String(backgroundImageUrlEl.value || "").trim().slice(0, 500);
    visualPreferences.pomodoroBlurEnabled = Boolean(backgroundBlurEnabledEl.checked);
    visualPreferences.pomodoroBlurAmount = Math.max(0, Math.min(18, Number(backgroundBlurAmountEl.value || 4)));
  }
  saveVisualPreferences();
  syncBackgroundImageControls();
  applyAppearance();

  if(visualPreferences.pomodoroSyncWithDashboard){
    showToast("Pomodoro synced with dashboard background");
    return;
  }
  showToast(visualPreferences.pomodoroBackgroundImage ? "Pomodoro background image saved" : "Pomodoro background image cleared");
}

function clearBackgroundImage(){
  backgroundImageSyncEl.checked = false;
  backgroundImageUrlEl.value = "";
  backgroundBlurEnabledEl.checked = true;
  backgroundBlurAmountEl.value = "4";
  visualPreferences.pomodoroSyncWithDashboard = false;
  visualPreferences.pomodoroBackgroundImage = "";
  visualPreferences.pomodoroBlurEnabled = true;
  visualPreferences.pomodoroBlurAmount = 4;
  saveVisualPreferences();
  syncBackgroundImageControls();
  applyAppearance();
  showToast("Pomodoro background image cleared");
}

function populateSoundPresets(){
  soundPresetEl.innerHTML = "";
  focusModeSoundPresetEl.innerHTML = "";
  Object.entries(soundPresets).forEach(([value, meta]) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = meta.label;
    soundPresetEl.appendChild(opt);
    const compactOpt = opt.cloneNode(true);
    focusModeSoundPresetEl.appendChild(compactOpt);
  });
}

function populateCompactSelectors(){
  focusModeBackgroundEl.innerHTML = "";
  backgroundPresets.forEach((preset) => {
    const opt = document.createElement("option");
    opt.value = preset.id;
    opt.textContent = `${preferences.favoriteBackgrounds.includes(preset.id) ? "★ " : ""}${preset.name}`;
    focusModeBackgroundEl.appendChild(opt);
  });

  focusModeAmbienceEl.innerHTML = "";
  ambiencePresets.forEach((preset) => {
    const opt = document.createElement("option");
    opt.value = preset.id;
    opt.textContent = `${preferences.favoriteAmbiences.includes(preset.id) ? "★ " : ""}${preset.name}`;
    focusModeAmbienceEl.appendChild(opt);
  });

  focusModeRingColorEl.innerHTML = "";
  ringColorPresets.forEach((preset) => {
    const opt = document.createElement("option");
    opt.value = preset.id;
    opt.textContent = preset.name;
    focusModeRingColorEl.appendChild(opt);
  });
}

function isFavoritePreset(kind, id){
  const key = kind === "background" ? "favoriteBackgrounds" : "favoriteAmbiences";
  return preferences[key].includes(id);
}

function toggleFavoritePreset(kind, id){
  const key = kind === "background" ? "favoriteBackgrounds" : "favoriteAmbiences";
  const current = new Set(preferences[key]);
  if(current.has(id)) current.delete(id);
  else current.add(id);
  preferences[key] = [...current];
  savePreferences();
  populateCompactSelectors();
  renderBackgroundPresets();
  renderAmbiencePresets();
  showToast(`${kind === "background" ? "Backdrop" : "Ambience"} ${current.has(id) ? "favorited" : "unfavorited"}`);
}

function sortPresetsWithFavorites(list, kind){
  return [...list].sort((a, b) => {
    const favA = isFavoritePreset(kind, a.id) ? 1 : 0;
    const favB = isFavoritePreset(kind, b.id) ? 1 : 0;
    if(favA !== favB) return favB - favA;
    return 0;
  });
}

function buildPresetButton({ preset, kind, backgroundStyle, active, onSelect }){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "preset-btn";
  btn.style.background = backgroundStyle;
  
  if(preset.custom){
    btn.classList.add("custom-backdrop-btn");
    const customImage = visualPreferences.pomodoroBackgroundImage === "__local__"
      ? getLocalBackgroundImage()
      : visualPreferences.pomodoroBackgroundImage;
    if(customImage){
      btn.style.backgroundImage = `linear-gradient(180deg, rgba(4,9,17,0.04), rgba(4,9,17,0.54)), url("${customImage}")`;
      btn.style.backgroundSize = "cover";
      btn.style.backgroundPosition = "center";
    }
  }

  if(active) btn.classList.add("active");
  if(isFavoritePreset(kind, preset.id)) btn.classList.add("favorite");

  const favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.className = `preset-fav ${isFavoritePreset(kind, preset.id) ? "active" : ""}`;
  favBtn.setAttribute("aria-label", isFavoritePreset(kind, preset.id) ? "Remove favorite" : "Add favorite");
  favBtn.innerHTML = "&#9733;";
  favBtn.onclick = (event) => {
    event.stopPropagation();
    toggleFavoritePreset(kind, preset.id);
  };

  const copy = document.createElement("div");
  copy.className = "preset-copy";

  const title = document.createElement("strong");
  title.textContent = preset.name;

  const meta = document.createElement("span");
  meta.textContent = active ? "Selected" : isFavoritePreset(kind, preset.id) ? "Favorite" : "Choose";

  copy.appendChild(title);
  copy.appendChild(meta);

  btn.appendChild(favBtn);
  btn.appendChild(copy);
  
  if(preset.custom){
    const plusIcon = document.createElement("span");
    plusIcon.className = "custom-backdrop-plus-small";
    plusIcon.innerHTML = "&#9998;"; // pencil edit icon
    plusIcon.title = "Configure image";
    btn.appendChild(plusIcon);
  }

  btn.onclick = onSelect;
  return btn;
}

function buildAmbiencePreview(id){
  if(id === "rain") return "linear-gradient(135deg, #15283c 0%, #2f5873 100%)";
  if(id === "fireplace") return "linear-gradient(135deg, #2c1516 0%, #6d3d2b 100%)";
  if(id === "fireflies") return "linear-gradient(135deg, #102019 0%, #29422f 100%)";
  if(id === "comets") return "linear-gradient(135deg, #10172b 0%, #314878 100%)";
  if(id === "mist") return "linear-gradient(135deg, #1f2d42 0%, #5f7698 100%)";
  if(id === "storm") return "linear-gradient(135deg, #111827 0%, #2f4966 100%)";
  if(id === "aurora-night") return "linear-gradient(135deg, #071119 0%, #15314a 48%, #284a6f 100%)";
  if(id === "calm") return "linear-gradient(135deg, #26324a 0%, #42597b 100%)";
  return "linear-gradient(135deg, #10172b 0%, #2b3751 100%)";
}

function renderBackgroundPresets(){
  backgroundPresetEl.innerHTML = "";
  sortPresetsWithFavorites(backgroundPresets, "background").forEach((preset) => {
    const btn = buildPresetButton({
      preset,
      kind: "background",
      backgroundStyle: preset.css,
      active: preset.id === preferences.background,
      onSelect: () => {
        if(preset.custom){
          const customImage = visualPreferences.pomodoroBackgroundImage === "__local__"
            ? getLocalBackgroundImage()
            : visualPreferences.pomodoroBackgroundImage;
          if(preferences.background === "custom" || !customImage){
            openCustomBackdropModal();
          }else{
            preferences.background = "custom";
            applyAppearance();
            populateCompactSelectors();
            renderBackgroundPresets();
            savePreferences();
          }
        }else{
          preferences.background = preset.id;
          applyAppearance();
          populateCompactSelectors();
          renderBackgroundPresets();
          savePreferences();
        }
      }
    });
    backgroundPresetEl.appendChild(btn);
  });
}

function renderRingColorPresets(){
  ringColorPresetEl.innerHTML = "";
  ringColorPresets.forEach((preset) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `ring-color-btn ${preferences.ringColor === preset.id ? "active" : ""}`;
    const swatch = document.createElement("span");
    swatch.className = "ring-color-swatch";
    const colors = preset.custom ? [preferences.customRingColor] : preset.colors;
    swatch.style.background = colors.length > 1
      ? `linear-gradient(135deg, ${colors.join(", ")})`
      : colors[0];
    const name = document.createElement("span");
    name.textContent = preset.name;
    btn.appendChild(swatch);
    btn.appendChild(name);
    btn.onclick = () => {
      preferences.ringColor = preset.id;
      ringCustomColorEl.value = preferences.customRingColor;
      applyRingAppearance();
      renderRingColorPresets();
      focusModeRingColorEl.value = preferences.ringColor;
      savePreferences();
    };
    ringColorPresetEl.appendChild(btn);
  });
}

function renderAmbiencePresets(){
  ambiencePresetEl.innerHTML = "";
  sortPresetsWithFavorites(ambiencePresets, "ambience").forEach((preset) => {
    const btn = buildPresetButton({
      preset,
      kind: "ambience",
      backgroundStyle: buildAmbiencePreview(preset.id),
      active: preset.id === preferences.ambience,
      onSelect: () => {
      preferences.ambience = preset.id;
      applyAmbience();
      populateCompactSelectors();
      renderAmbiencePresets();
      savePreferences();
      }
    });
    ambiencePresetEl.appendChild(btn);
  });
}

function renderSpotifyPlaylists(){
  playlistButtonsEl.innerHTML = "";
  const allPlaylists = [...spotifyPlaylists, ...preferences.pinnedSpotifyPlaylists];
  allPlaylists.forEach((playlist) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "playlist-btn";
    btn.textContent = playlist.name;
    if(preferences.spotifyPlaylistId === playlist.id) btn.classList.add("active");
    btn.onclick = () => {
      preferences.spotifyPlaylistId = playlist.id;
      spotifyEmbedEl.src = `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`;
      renderSpotifyPlaylists();
      savePreferences();
    };
    playlistButtonsEl.appendChild(btn);
  });
  spotifyEmbedEl.src = `https://open.spotify.com/embed/playlist/${preferences.spotifyPlaylistId}?utm_source=generator`;
  updateSpotifyNowPlaying();
}

function updateSpotifyNowPlaying(){
  const activePlaylist = [...spotifyPlaylists, ...preferences.pinnedSpotifyPlaylists].find((item) => item.id === preferences.spotifyPlaylistId);
  spotifyNowPlayingEl.textContent = activePlaylist ? activePlaylist.name : "Spotify playlist selected";
  spotifyNowPlayingMetaEl.textContent = activePlaylist?.note ? activePlaylist.note : "Spotify embed active in this panel";
}

function getPlaylistIdFromInput(raw){
  const input = String(raw || "").trim();
  if(!input) return null;
  const match = input.match(/playlist\/([a-zA-Z0-9]+)|^([a-zA-Z0-9]{18,})$/);
  return match ? (match[1] || match[2]) : null;
}

function pinSpotifyPlaylist(){
  const playlistId = getPlaylistIdFromInput(spotifyCustomPlaylistEl.value);
  if(!playlistId){
    showToast("Paste a valid Spotify playlist link or ID");
    return;
  }

  const alreadyPinned = preferences.pinnedSpotifyPlaylists.some((item) => item.id === playlistId);
  if(alreadyPinned || spotifyPlaylists.some((item) => item.id === playlistId)){
    showToast("Playlist is already available");
    return;
  }

  if(preferences.pinnedSpotifyPlaylists.length >= PINNED_PLAYLIST_LIMIT){
    preferences.pinnedSpotifyPlaylists.shift();
  }

  preferences.pinnedSpotifyPlaylists.push({
    id: playlistId,
    name: `Pinned playlist ${preferences.pinnedSpotifyPlaylists.length + 1}`,
    note: "Pinned from your Spotify link"
  });
  preferences.spotifyPlaylistId = playlistId;
  spotifyCustomPlaylistEl.value = "";
  savePreferences();
  renderSpotifyPlaylists();
  showToast("Spotify playlist pinned");
}

function openSpotifyPlayer(){
  const playlistId = preferences.spotifyPlaylistId || spotifyPlaylists[0].id;
  window.open(`https://open.spotify.com/playlist/${playlistId}`, "_blank", "noopener");
}

function updateSpotifyEmailDisplay(){
  const currentEmail = localStorage.getItem("email") || "";
  currentEmailDisplayEl.textContent = currentEmail || "No login mail found";
  const selectedEmail = preferences.spotifyEmailMode === "new" ? (preferences.spotifyAltEmail || "Waiting for alternate mail") : (currentEmail || "No login mail available");
  spotifyStatusEl.textContent = `Selected Spotify account mail: ${selectedEmail}. UI is ready now; add Spotify OAuth credentials later to complete live account linking.`;
}

function syncFormWithPreferences(){
  focusInput.value = String(preferences.focusMinutes);
  breakInput.value = String(preferences.breakMinutes);
  sessionNameInput.value = preferences.sessionName;
  autoStartBreakInput.checked = Boolean(preferences.autoStartBreak);
  desktopAlertsInput.checked = Boolean(preferences.desktopAlerts);
  soundPresetEl.value = preferences.soundPreset;
  soundVolumeEl.value = String(preferences.soundVolume);
  document.querySelectorAll('input[name="spotifyEmailMode"]').forEach((input) => {
    input.checked = input.value === preferences.spotifyEmailMode;
  });
  spotifyAltEmailEl.value = preferences.spotifyAltEmail;
  spotifyAltEmailEl.disabled = preferences.spotifyEmailMode !== "new";
  focusModeSoundPresetEl.value = preferences.soundPreset;
  focusModeBackgroundEl.value = preferences.background;
  focusModeAmbienceEl.value = preferences.ambience;
  focusModeRingColorEl.value = preferences.ringColor;
  ringCustomColorEl.value = preferences.customRingColor;
  syncBackgroundImageControls();
  updateSpotifyEmailDisplay();
}

function applyAppearance(){
  const activeBackground = backgroundPresets.find((item) => item.id === preferences.background) || backgroundPresets[0];
  backdropEl.style.background = "";
  
  let imageUrl = "";
  if(activeBackground.id === "custom"){
    imageUrl = visualPreferences.pomodoroSyncWithDashboard !== false
      ? visualPreferences.dashboardBackgroundImage
      : visualPreferences.pomodoroBackgroundImage;
    if(imageUrl === "__local__") imageUrl = getLocalBackgroundImage();
  }
  
  const blurEnabled = visualPreferences.pomodoroSyncWithDashboard !== false
    ? visualPreferences.dashboardBlurEnabled !== false
    : visualPreferences.pomodoroBlurEnabled !== false;
  const blurAmount = visualPreferences.pomodoroSyncWithDashboard !== false
    ? Number(visualPreferences.dashboardBlurAmount ?? 4)
    : Number(visualPreferences.pomodoroBlurAmount ?? 4);

  if(imageUrl){
    backdropEl.classList.add("has-image");
    backdropEl.style.setProperty("--custom-bg-image", `url("${imageUrl}")`);
    backdropEl.style.backgroundImage = `var(--custom-bg-image), ${activeBackground.css}`;
    backdropEl.style.backgroundSize = "cover";
    backdropEl.style.backgroundPosition = "center";
  }else{
    backdropEl.classList.remove("has-image");
    backdropEl.style.removeProperty("--custom-bg-image");
    backdropEl.style.backgroundImage = "";
    backdropEl.style.background = activeBackground.css;
  }
  backdropEl.setAttribute("data-scene", activeBackground.id);
  backdropEl.style.setProperty("--custom-bg-blur", `${blurEnabled ? blurAmount : 0}px`);
  activeBackdropLabelEl.textContent = activeBackground.name;
  sessionTitleEl.textContent = preferences.sessionName;
  focusModeSessionNameEl.textContent = preferences.sessionName;
  focusModeBackgroundEl.value = preferences.background;
}

function hexToRgba(hex, alpha){
  const value = String(hex || "").replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((part) => part + part).join("")
    : value;
  const number = Number.parseInt(normalized, 16);
  if(!Number.isFinite(number)) return `rgba(124,242,200,${alpha})`;
  return `rgba(${(number >> 16) & 255},${(number >> 8) & 255},${number & 255},${alpha})`;
}

function getGradientBeadColor(index, stops = ["#6fffd2", "#65c7ff", "#b58cff", "#ff8fc6"]){
  const position = (index / (TOTAL_SEGMENTS - 1)) * (stops.length - 1);
  const startIndex = Math.floor(position);
  const endIndex = Math.min(stops.length - 1, startIndex + 1);
  const mix = position - startIndex;
  const toRgb = (hex) => [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16)
  ];
  const start = toRgb(stops[startIndex]);
  const end = toRgb(stops[endIndex]);
  const rgb = start.map((value, channel) => Math.round(value + ((end[channel] - value) * mix)));
  return `rgb(${rgb.join(",")})`;
}

function applyRingAppearance(){
  const preset = ringColorPresets.find((item) => item.id === preferences.ringColor) || ringColorPresets[0];
  [...segments, ...focusModeSegments].forEach((segment, index) => {
    const beadIndex = index % TOTAL_SEGMENTS;
    const color = preset.gradient
      ? getGradientBeadColor(beadIndex, preset.colors)
      : preset.custom ? preferences.customRingColor : preset.colors[0];
    const glowColor = preset.gradient
      ? color.replace("rgb", "rgba").replace(")", ",0.58)")
      : hexToRgba(color, 0.58);
    segment.style.setProperty("--bead-color", color);
    segment.style.setProperty("--bead-glow", glowColor);
  });
}

function clearAmbientIntervals(){
  clearInterval(starInterval);
  clearInterval(rainInterval);
  clearInterval(emberInterval);
  clearInterval(mistInterval);
  clearInterval(fireflyInterval);
  clearInterval(cometInterval);
  starInterval = null;
  rainInterval = null;
  emberInterval = null;
  mistInterval = null;
  fireflyInterval = null;
  cometInterval = null;
  starsEl.innerHTML = "";
  rainEl.innerHTML = "";
  embersEl.innerHTML = "";
  mistEl.innerHTML = "";
  firefliesEl.innerHTML = "";
  cometsEl.innerHTML = "";
}

function spawnStar(){
  const s = document.createElement("div");
  s.className = "star";
  const size = Math.random() * 3 + 2;
  s.style.width = `${size}px`;
  s.style.height = `${size}px`;
  s.style.left = `${Math.random() * 100}vw`;
  s.style.animationDuration = `${Math.random() * 5 + 6}s`;
  s.style.boxShadow = `0 0 ${Math.random() * 12 + 6}px rgba(255,255,255,0.6)`;
  starsEl.appendChild(s);
  s.addEventListener("animationend", () => s.remove());
}

function spawnRaindrop(){
  const drop = document.createElement("div");
  drop.className = "raindrop";
  drop.style.left = `${Math.random() * 100}vw`;
  drop.style.height = `${Math.random() * 80 + 60}px`;
  drop.style.animationDuration = `${Math.random() * 0.5 + 0.9}s`;
  rainEl.appendChild(drop);
  drop.addEventListener("animationend", () => drop.remove());
}

function spawnEmber(){
  const ember = document.createElement("div");
  ember.className = "ember";
  ember.style.left = `${Math.random() * 100}%`;
  ember.style.width = `${Math.random() * 5 + 3}px`;
  ember.style.height = ember.style.width;
  ember.style.animationDuration = `${Math.random() * 1.2 + 2.2}s`;
  ember.style.setProperty("--ember-x", `${(Math.random() - 0.5) * 120}px`);
  embersEl.appendChild(ember);
  ember.addEventListener("animationend", () => ember.remove());
}

function spawnMistOrb(){
  const orb = document.createElement("div");
  orb.className = "mist-orb";
  orb.style.left = `${Math.random() * 22 - 12}vw`;
  orb.style.top = `${Math.random() * 65}%`;
  orb.style.animationDuration = `${Math.random() * 12 + 14}s`;
  mistEl.appendChild(orb);
  orb.addEventListener("animationend", () => orb.remove());
}

function spawnFirefly(){
  const fly = document.createElement("div");
  fly.className = "firefly";
  const size = Math.random() * 7 + 5;
  fly.style.width = `${size}px`;
  fly.style.height = `${size}px`;
  fly.style.left = `${Math.random() * 100}%`;
  fly.style.top = `${Math.random() * 85 + 10}%`;
  fly.style.animationDuration = `${Math.random() * 4 + 4.8}s`;
  fly.style.setProperty("--firefly-x", `${(Math.random() - 0.5) * 140}px`);
  firefliesEl.appendChild(fly);
  fly.addEventListener("animationend", () => fly.remove());
}

function spawnComet(){
  const palettes = [
    {
      glow: "rgba(160,214,255,0.62)",
      mid: "rgba(137,214,255,0.9)",
      core: "rgba(240,250,255,1)"
    },
    {
      glow: "rgba(148,255,220,0.62)",
      mid: "rgba(112,255,205,0.92)",
      core: "rgba(232,255,244,1)"
    },
    {
      glow: "rgba(255,177,245,0.62)",
      mid: "rgba(255,132,228,0.9)",
      core: "rgba(255,238,251,1)"
    },
    {
      glow: "rgba(255,205,137,0.62)",
      mid: "rgba(255,168,88,0.92)",
      core: "rgba(255,244,223,1)"
    },
    {
      glow: "rgba(186,164,255,0.64)",
      mid: "rgba(156,136,255,0.92)",
      core: "rgba(242,238,255,1)"
    }
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  const comet = document.createElement("div");
  comet.className = "comet";
  comet.style.left = `${Math.random() * 70 + 30}%`;
  comet.style.top = `${Math.random() * 56}%`;
  comet.style.width = `${Math.random() * 180 + 120}px`;
  comet.style.height = `${Math.random() * 3.4 + 2.6}px`;
  comet.style.animationDuration = `${Math.random() * 0.5 + 0.7}s`;
  comet.style.setProperty("--comet-rot", `${-(Math.random() * 16 + 10)}deg`);
  comet.style.setProperty("--comet-glow", palette.glow);
  comet.style.setProperty("--comet-mid", palette.mid);
  comet.style.setProperty("--comet-core", palette.core);
  cometsEl.appendChild(comet);
  comet.addEventListener("animationend", () => comet.remove());
}

function startStars(count = 12, intervalMs = 120){
  for(let i = 0; i < count; i++) spawnStar();
  starInterval = setInterval(spawnStar, intervalMs);
}
function startRain(count = 12, intervalMs = 55){
  for(let i = 0; i < count; i++) spawnRaindrop();
  rainInterval = setInterval(spawnRaindrop, intervalMs);
}
function startEmbers(){ for(let i = 0; i < 10; i++) spawnEmber(); emberInterval = setInterval(spawnEmber, 45); }
function startMist(count = 3, intervalMs = 2600){
  for(let i = 0; i < count; i++) spawnMistOrb();
  mistInterval = setInterval(spawnMistOrb, intervalMs);
}
function startFireflies(){ for(let i = 0; i < 10; i++) spawnFirefly(); fireflyInterval = setInterval(spawnFirefly, 180); }
function startComets(initial = 1, intervalMs = 3000){
  for(let i = 0; i < initial; i++) spawnComet();
  cometInterval = setInterval(spawnComet, intervalMs);
}

function applyAmbience(){
  clearAmbientIntervals();
  starsEl.classList.remove("active");
  rainEl.classList.remove("active");
  embersEl.classList.remove("active");
  mistEl.classList.remove("active");
  firefliesEl.classList.remove("active");
  cometsEl.classList.remove("active");
  auroraEl.classList.remove("active");
  lightningEl.classList.remove("active");
  hearthEl.classList.remove("active");
  rainEl.classList.remove("intense");
  mistEl.classList.remove("dense");

  if(preferences.ambience === "stars"){
    starsEl.classList.add("active");
    startStars(18, 180);
  }else if(preferences.ambience === "rain"){
    rainEl.classList.add("active");
    startRain(10, 70);
  }else if(preferences.ambience === "fireplace"){
    embersEl.classList.add("active");
    mistEl.classList.add("active");
    hearthEl.classList.add("active");
    startEmbers();
    startMist(2, 3200);
  }else if(preferences.ambience === "fireflies"){
    firefliesEl.classList.add("active");
    startFireflies();
  }else if(preferences.ambience === "comets"){
    cometsEl.classList.add("active");
    startComets(20, 70);
  }else if(preferences.ambience === "mist"){
    mistEl.classList.add("active");
    mistEl.classList.add("dense");
    startMist(5, 1700);
  }else if(preferences.ambience === "storm"){
    rainEl.classList.add("active");
    mistEl.classList.add("active");
    lightningEl.classList.add("active");
    rainEl.classList.add("intense");
    mistEl.classList.add("dense");
    startRain(18, 16);
    startMist(4, 1400);
  }else if(preferences.ambience === "aurora-night"){
    auroraEl.classList.add("active");
    starsEl.classList.add("active");
    startStars(14, 180);
  }else if(preferences.ambience === "calm"){
    // intentional stillness: no animated overlays
  }

  activeAmbienceLabelEl.textContent = ambiencePresets.find((item) => item.id === preferences.ambience)?.name || "Stars";
  focusModeAmbienceEl.value = preferences.ambience;
}

function applySoundUI(){
  activeSoundLabelEl.textContent = soundPresets[preferences.soundPreset].label;
  focusModeSoundPresetEl.value = preferences.soundPreset;
}

function playSelectedSound(){
  try{
    soundPresets[preferences.soundPreset].play(preferences.soundVolume / 100);
  }catch(e){
    console.error("Audio failed", e);
  }
}

function previewSound(){
  playSelectedSound();
  showToast("Previewing timer sound");
}

function remainingSec(){
  return (minutes * 60) + seconds;
}

function syncTimerFromClock(){
  if(!timer || timerEndsAt === null) return remainingSec();
  const secondsLeft = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));
  minutes = Math.floor(secondsLeft / 60);
  seconds = secondsLeft % 60;
  return secondsLeft;
}

function roundStudyMinutes(value){
  return Math.round(Math.max(0, value) * 10) / 10;
}

function getElapsedFocusMinutes(){
  if(mode !== "FOCUS" || focusStartRemainingSec === null) return 0;
  const elapsedSec = Math.max(0, focusStartRemainingSec - remainingSec());
  return elapsedSec / 60;
}

function getUncountedPartialMinutes(){
  return roundStudyMinutes(getElapsedFocusMinutes() - countedPartialMinutes);
}

function formatStudyMinutes(value){
  const rounded = roundStudyMinutes(value);
  if(rounded > 0 && rounded < 1){
    return `${Math.max(1, Math.round(rounded * 60))} second(s)`;
  }
  if(Number.isInteger(rounded)) return `${rounded} minute(s)`;
  return `${rounded.toFixed(1)} minute(s)`;
}

function formatHm(minutesTotal){
  const hours = Math.floor(minutesTotal / 60);
  const mins = minutesTotal % 60;
  if(hours <= 0) return `${mins} min`;
  return `${hours}h ${mins}m`;
}

function updateTimerMeta(){
  const nextMinutes = mode === "FOCUS" ? breakMinutesSetting : focusMinutesSetting;
  const nextLabel = mode === "FOCUS" ? "break" : "focus";
  timerMetaEl.textContent = `Next ${nextLabel}: ${formatHm(nextMinutes)}`;
}

function updateStatusPill(state){
  statusPillEl.textContent = state;
}

function updateDisplay(){
  timeEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  focusModeTimeEl.textContent = timeEl.textContent;
  focusModeLabelEl.textContent = mode;
  const activeCount = (60 - seconds) % TOTAL_SEGMENTS;
  segments.forEach((seg, index) => {
    seg.classList.toggle("active", index < activeCount);
  });
  focusModeSegments.forEach((seg, index) => {
    seg.classList.toggle("active", index < activeCount);
  });
  updateTimerMeta();
}

function setMode(nextMode){
  mode = nextMode;
  modeLabel.textContent = nextMode;
  updateTimerMeta();
}

function notifyTimerEnd(title, body){
  if(preferences.desktopAlerts && "Notification" in window && Notification.permission === "granted"){
    new Notification(title, { body });
  }
  showToast(`${title} - ${body}`);
}

function enterFullscreenIfPossible(){
  const target = document.documentElement;
  if(document.fullscreenElement || !target.requestFullscreen) return;
  target.requestFullscreen().catch(() => {});
}

function enterFocusMode(minimal){
  if(!focusModeEnabled) return;
  if(minimal){
    syncTimerFromClock();
    updateDisplay();
  }
  document.body.classList.toggle("focus-minimal", Boolean(minimal));
  document.body.classList.toggle("focus-normal", !minimal);
  focusModeShellEl.setAttribute("aria-hidden", minimal ? "false" : "true");
}

function resetFocusModeInactivityTimer(){
  if(!focusModeEnabled) return;
  clearTimeout(focusModeInactivityTimer);
  focusModeInactivityTimer = setTimeout(() => {
    if(timer) enterFocusMode(true);
  }, 5000);
}

function beginFocusModeExperience(){
  focusModeEnabled = true;
  focusModeSuppressMouseUntil = Date.now() + 900;
  enterFullscreenIfPossible();
  enterFocusMode(true);
  resetFocusModeInactivityTimer();
}

function endFocusModeExperience(){
  focusModeEnabled = false;
  clearTimeout(focusModeInactivityTimer);
  focusModeInactivityTimer = null;
  document.body.classList.remove("focus-minimal", "focus-normal");
  focusModeShellEl.setAttribute("aria-hidden", "true");
}

function completeCurrentTimer(){
  clearInterval(timer);
  timer = null;
  timerEndsAt = null;

  if(mode === "FOCUS"){
    const completedMins = focusMinutesSetting;
    playSelectedSound();
    notifyTimerEnd("Focus complete", `${preferences.sessionName} is done. Time for a ${breakMinutesSetting} minute break.`);
    enterFocusMode(false);
    openNoteModal({
      title: "Focus complete",
      sub: "Add a note for this session if you want. Your break can start right after save or skip.",
      onDone: (note) => {
        const remainingToCredit = Math.max(0, completedMins - countedPartialMinutes);
        savePomodoroSession(remainingToCredit);
        bumpLocalPomodoroStatsCompleted(remainingToCredit);
        addHistoryEntry({ kind: "completed", minutes: completedMins, note });
        setMode("BREAK");
        minutes = breakMinutesSetting;
        seconds = 0;
        breakStartRemainingSec = remainingSec();
        countedPartialMinutes = 0;
        updateDisplay();
        showToast("Break started");
        if(preferences.autoStartBreak){
          start();
        }else{
          updateStatusPill("Break ready");
        }
      }
    });
  }else{
    playSelectedSound();
    bumpLocalBreakCompleted(breakMinutesSetting);
    savePomodoroSession(breakMinutesSetting, "SHORT_BREAK", 1);
    addHistoryEntry({ kind: "break", minutes: breakMinutesSetting, note: "" });
    notifyTimerEnd("Break complete", "Your next focus session is ready.");
    setMode("FOCUS");
    minutes = focusMinutesSetting;
    seconds = 0;
    focusStartRemainingSec = null;
    updateDisplay();
    updateStatusPill("Ready");
    endFocusModeExperience();
    showToast("Break complete. Ready for focus");
  }
}

function tick(){
  if(syncTimerFromClock() === 0){
    updateDisplay();
    completeCurrentTimer();
    return;
  }

  updateDisplay();
}

function start(){
  if(timer){
    resetFocusModeInactivityTimer();
    return;
  }
  if(mode === "FOCUS" && focusStartRemainingSec === null) focusStartRemainingSec = remainingSec();
  if(mode === "BREAK" && breakStartRemainingSec === null) breakStartRemainingSec = remainingSec();
  timerEndsAt = Date.now() + (remainingSec() * 1000);
  timer = setInterval(tick, 1000);
  updateStatusPill(mode === "FOCUS" ? "In focus" : "On break");
  updateDisplay();
  beginFocusModeExperience();
}

function pause(){
  if(mode === "FOCUS" && timer){
    syncTimerFromClock();
    updateDisplay();
    const pendingMinutes = getUncountedPartialMinutes();
    if(pendingMinutes > 0){
      openPausePartialModal(pendingMinutes, () => {
        clearInterval(timer);
        timer = null;
        timerEndsAt = null;
        updateStatusPill("Paused");
        enterFocusMode(false);
        showToast("Timer paused");
      });
      return;
    }
  }
  syncTimerFromClock();
  clearInterval(timer);
  timer = null;
  timerEndsAt = null;
  updateDisplay();
  updateStatusPill("Paused");
  enterFocusMode(false);
  showToast("Timer paused");
}

function hardResetToFocus(){
  clearInterval(timer);
  timer = null;
  timerEndsAt = null;
  setMode("FOCUS");
  minutes = focusMinutesSetting;
  seconds = 0;
  focusStartRemainingSec = null;
  breakStartRemainingSec = null;
  countedPartialMinutes = 0;
  updateDisplay();
  updateStatusPill("Ready");
  endFocusModeExperience();
}

function reset(){
  if(mode === "FOCUS"){
    const elapsedMin = getUncountedPartialMinutes();
    if(elapsedMin > 0){
      openCountPartialModal(elapsedMin, () => hardResetToFocus());
      return;
    }
  }
  hardResetToFocus();
}

function applySettings(){
  preferences.focusMinutes = clampInt(focusInput.value, 5, 180, 25);
  preferences.breakMinutes = clampInt(breakInput.value, 1, 60, 5);
  preferences.sessionName = String(sessionNameInput.value || "").slice(0, 40).trim() || "Focus Sprint";
  preferences.autoStartBreak = autoStartBreakInput.checked;
  preferences.desktopAlerts = desktopAlertsInput.checked;
  preferences.soundPreset = soundPresets[soundPresetEl.value] ? soundPresetEl.value : "glass";
  preferences.soundVolume = clampInt(soundVolumeEl.value, 0, 100, 70);

  focusMinutesSetting = preferences.focusMinutes;
  breakMinutesSetting = preferences.breakMinutes;

  if(preferences.desktopAlerts && "Notification" in window && Notification.permission === "default"){
    Notification.requestPermission().catch(() => {});
  }

  savePreferences();
  saveVisualPreferences();
  syncFormWithPreferences();
  applyAppearance();
  applySoundUI();
  reset();
  showToast("Pomodoro settings updated");
}

function todayKey(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toSqlDateTime(date){
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getScopedStorageKey(baseKey){
  const userId = localStorage.getItem("user_id");
  return userId ? `${baseKey}_user_${userId}` : `${baseKey}_guest`;
}

function getVisualStorageKey(){
  return getScopedStorageKey(VISUAL_STORAGE_KEY);
}

function bumpLocalPomodoroMinutesOnly(durationMinutes){
  try{
    const key = getScopedStorageKey(DAILY_STATS_KEY);
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : {};
    const k = todayKey();
    if(!data[k]) data[k] = { minutes: 0, sessions: 0, breaks: 0 };
    data[k].minutes = roundStudyMinutes(Number(data[k].minutes || 0) + Number(durationMinutes || 0));
    localStorage.setItem(key, JSON.stringify(data));
  }catch(e){
    console.error(e);
  }
}

function bumpLocalPomodoroStatsCompleted(durationMinutes){
  try{
    const key = getScopedStorageKey(DAILY_STATS_KEY);
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : {};
    const k = todayKey();
    if(!data[k]) data[k] = { minutes: 0, sessions: 0, breaks: 0 };
    data[k].minutes = roundStudyMinutes(Number(data[k].minutes || 0) + Number(durationMinutes || 0));
    data[k].sessions = Number(data[k].sessions || 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));
  }catch(e){
    console.error(e);
  }
}

function bumpLocalBreakCompleted(durationMinutes){
  try{
    const key = getScopedStorageKey(DAILY_STATS_KEY);
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : {};
    const k = todayKey();
    if(!data[k]) data[k] = { minutes: 0, sessions: 0, breaks: 0 };
    data[k].breaks = Number(data[k].breaks || 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));
  }catch(e){
    console.error(e);
  }
}

function addHistoryEntry(entry){
  try{
    const key = getScopedStorageKey(HISTORY_KEY);
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const safe = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      date: todayKey(),
      ts: new Date().toISOString(),
      kind: entry.kind,
      minutes: Number(entry.minutes || 0),
      note: String(entry.note || "").slice(0, 240)
    };
    arr.push(safe);
    localStorage.setItem(key, JSON.stringify(arr));
  }catch(e){
    console.error(e);
  }
}

async function savePomodoroSession(durationMinutes, sessionType = "FOCUS", completed = 1){
  const userId = localStorage.getItem("user_id") ? Number(localStorage.getItem("user_id")) : null;
  if(!userId) return;

  const sessionEnd = new Date();
  const sessionStart = new Date(sessionEnd.getTime() - durationMinutes * 60000);

  try{
    await fetch(`https://unifocus.onrender.com/api/pomodoro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        session_start: toSqlDateTime(sessionStart),
        session_end: toSqlDateTime(sessionEnd),
        duration_minutes: durationMinutes,
        session_type: sessionType,
        completed
      })
    });
  }catch(err){
    console.error("Pomodoro save failed", err);
  }
}

function toggleTheme(){
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  setThemeUi(next);
}

function setThemeUi(theme){
  const glyph = document.getElementById("themeGlyph");
  const hint = document.getElementById("themeHint");
  if(glyph) glyph.textContent = theme === "dark" ? "🌞" : "🌙";
  if(hint) hint.textContent = theme === "dark" ? "Light" : "Dark";
}

function goDashboard(){
  window.location.href = "dashboard.html";
}

function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function openModal(title, sub, bodyEl){
  modalTitleEl.textContent = title || "";
  modalSubEl.textContent = sub || "";
  modalBodyEl.innerHTML = "";
  if(bodyEl) modalBodyEl.appendChild(bodyEl);
  modalEl.classList.add("show");
  modalEl.setAttribute("aria-hidden", "false");
}

function closeModal(){
  modalEl.classList.remove("show");
  modalEl.setAttribute("aria-hidden", "true");
  modalBodyEl.innerHTML = "";
}

function activateCustomBackdrop(imageValue, sourceLabel){
  visualPreferences.pomodoroSyncWithDashboard = false;
  visualPreferences.pomodoroBackgroundImage = imageValue;
  visualPreferences.pomodoroBlurEnabled = true;
  visualPreferences.pomodoroBlurAmount = 2;
  preferences.background = "custom";
  saveVisualPreferences();
  savePreferences();
  syncBackgroundImageControls();
  applyAppearance();
  populateCompactSelectors();
  renderBackgroundPresets();
  closeModal();
  showToast(`${sourceLabel} backdrop applied`);
}

function normalizeImageUrl(value){
  const input = String(value || "").trim();
  if(!input) return "";
  try{
    const url = new URL(input);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  }catch(_error){
    return "";
  }
}

function resizeLocalImage(file){
  return new Promise((resolve, reject) => {
    if(!file || !file.type.startsWith("image/")){
      reject(new Error("Choose a valid image file"));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const maxDimension = 1600;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("That image could not be opened"));
    };
    image.src = objectUrl;
  });
}

function openCustomBackdropModal(){
  const wrap = document.createElement("div");
  wrap.className = "custom-backdrop-modal";

  const urlField = document.createElement("label");
  urlField.className = "field2";
  const urlLabel = document.createElement("span");
  urlLabel.className = "label2";
  urlLabel.textContent = "Online image address";
  const urlInput = document.createElement("input");
  urlInput.className = "input2";
  urlInput.type = "url";
  urlInput.placeholder = "https://example.com/background.jpg";
  if(visualPreferences.pomodoroBackgroundImage && visualPreferences.pomodoroBackgroundImage !== "__local__"){
    urlInput.value = visualPreferences.pomodoroBackgroundImage;
  }
  urlField.appendChild(urlLabel);
  urlField.appendChild(urlInput);

  const divider = document.createElement("div");
  divider.className = "custom-backdrop-divider";
  divider.textContent = "or";

  const upload = document.createElement("label");
  upload.className = "custom-upload-zone";
  const uploadIcon = document.createElement("span");
  uploadIcon.className = "custom-upload-icon";
  uploadIcon.textContent = "+";
  const uploadTitle = document.createElement("strong");
  uploadTitle.textContent = "Import from this device";
  const uploadHint = document.createElement("span");
  uploadHint.textContent = "JPG, PNG, WEBP, or another browser-supported image";
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  upload.appendChild(uploadIcon);
  upload.appendChild(uploadTitle);
  upload.appendChild(uploadHint);
  upload.appendChild(fileInput);

  const actions = document.createElement("div");
  actions.className = "row2";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "btn2";
  cancel.textContent = "Cancel";
  cancel.onclick = closeModal;
  const applyUrl = document.createElement("button");
  applyUrl.type = "button";
  applyUrl.className = "btn2 primary";
  applyUrl.textContent = "Use image address";
  applyUrl.onclick = () => {
    const imageUrl = normalizeImageUrl(urlInput.value);
    if(!imageUrl){
      showToast("Enter a valid http or https image address");
      urlInput.focus();
      return;
    }
    setLocalBackgroundImage("");
    activateCustomBackdrop(imageUrl, "Custom");
  };
  actions.appendChild(cancel);
  actions.appendChild(applyUrl);

  fileInput.onchange = async () => {
    const file = fileInput.files?.[0];
    if(!file) return;
    upload.classList.add("loading");
    uploadTitle.textContent = "Preparing image...";
    try{
      const dataUrl = await resizeLocalImage(file);
      setLocalBackgroundImage(dataUrl);
      activateCustomBackdrop("__local__", "Local image");
    }catch(error){
      upload.classList.remove("loading");
      uploadTitle.textContent = "Import from this device";
      showToast(error.message || "Could not import that image");
    }
  };

  wrap.appendChild(urlField);
  wrap.appendChild(divider);
  wrap.appendChild(upload);
  wrap.appendChild(actions);
  openModal("Custom backdrop", "Paste an online image address or choose an image stored on this device.", wrap);
  setTimeout(() => urlInput.focus(), 0);
}

modalEl.addEventListener("click", (e) => {
  if(e.target === modalEl) closeModal();
});

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeModal();
});

function openNoteModal({ title, sub, onDone }){
  const wrap = document.createElement("div");
  const field = document.createElement("div");
  field.className = "field2";
  const lab = document.createElement("div");
  lab.className = "label2";
  lab.textContent = "Note (optional)";
  const ta = document.createElement("textarea");
  ta.className = "ta2";
  ta.maxLength = 240;
  ta.placeholder = "What did you work on in this focus block?";
  field.appendChild(lab);
  field.appendChild(ta);

  const row = document.createElement("div");
  row.className = "row2";
  const skip = document.createElement("button");
  skip.className = "btn2";
  skip.type = "button";
  skip.textContent = "Skip";
  skip.onclick = () => { closeModal(); onDone && onDone(""); };

  const save = document.createElement("button");
  save.className = "btn2 primary";
  save.type = "button";
  save.textContent = "Save note";
  save.onclick = () => { closeModal(); onDone && onDone(ta.value.trim()); };

  row.appendChild(skip);
  row.appendChild(save);
  wrap.appendChild(field);
  wrap.appendChild(row);
  openModal(title, sub, wrap);
  setTimeout(() => ta.focus(), 0);
}

function openCountPartialModal(elapsedMin, onAfter){
  const wrap = document.createElement("div");
  const msg = document.createElement("div");
  msg.className = "modal-sub";
  msg.textContent = `You already have ${formatStudyMinutes(elapsedMin)} in progress. Count them toward Studied Today without marking a full session?`;

  const row = document.createElement("div");
  row.className = "row2";
  const discard = document.createElement("button");
  discard.className = "btn2 danger";
  discard.type = "button";
  discard.textContent = "Discard";
  discard.onclick = () => { addHistoryEntry({ kind: "dropped", minutes: elapsedMin, note: "" }); closeModal(); onAfter && onAfter(); };

  const count = document.createElement("button");
  count.className = "btn2 primary";
  count.type = "button";
  count.textContent = "Count minutes";
  count.onclick = () => {
    closeModal();
    openNoteModal({
      title: "Count partial minutes",
      sub: `Counting ${formatStudyMinutes(elapsedMin)}. Add a note if you want.`,
      onDone: (note) => {
        bumpLocalPomodoroMinutesOnly(elapsedMin);
        savePomodoroSession(elapsedMin, "FOCUS", 0);
        countedPartialMinutes = roundStudyMinutes(countedPartialMinutes + elapsedMin);
        addHistoryEntry({ kind: "partial", minutes: elapsedMin, note });
        showToast(`${formatStudyMinutes(elapsedMin)} added to Studied Today`);
        onAfter && onAfter();
      }
    });
  };

  row.appendChild(discard);
  row.appendChild(count);
  wrap.appendChild(msg);
  wrap.appendChild(row);
  openModal("Reset focus session", "", wrap);
}

function openPausePartialModal(elapsedMin, onPauseOnly){
  const wrap = document.createElement("div");
  const msg = document.createElement("div");
  msg.className = "modal-sub";
  msg.textContent = `You have ${formatStudyMinutes(elapsedMin)} uncounted so far. Add them to Studied Today before pausing? Session count stays unchanged unless the full timer finishes.`;

  const row = document.createElement("div");
  row.className = "row2";

  const pauseOnly = document.createElement("button");
  pauseOnly.className = "btn2";
  pauseOnly.type = "button";
  pauseOnly.textContent = "Pause only";
  pauseOnly.onclick = () => {
    closeModal();
    onPauseOnly && onPauseOnly();
  };

  const addAndPause = document.createElement("button");
  addAndPause.className = "btn2 primary";
  addAndPause.type = "button";
  addAndPause.textContent = "Add and pause";
  addAndPause.onclick = () => {
    closeModal();
    openNoteModal({
      title: "Add paused minutes",
      sub: `Adding ${formatStudyMinutes(elapsedMin)} to Studied Today. This does not increase session count.`,
      onDone: (note) => {
        bumpLocalPomodoroMinutesOnly(elapsedMin);
        savePomodoroSession(elapsedMin, "FOCUS", 0);
        countedPartialMinutes = roundStudyMinutes(countedPartialMinutes + elapsedMin);
        addHistoryEntry({ kind: "partial", minutes: elapsedMin, note });
        showToast(`${formatStudyMinutes(elapsedMin)} added and timer paused`);
        onPauseOnly && onPauseOnly();
      }
    });
  };

  row.appendChild(pauseOnly);
  row.appendChild(addAndPause);
  wrap.appendChild(msg);
  wrap.appendChild(row);
  openModal("Pause focus timer", "", wrap);
}

function connectSpotify(){
  const currentEmail = localStorage.getItem("email") || "";
  const chosenEmail = preferences.spotifyEmailMode === "new" ? (preferences.spotifyAltEmail || "") : currentEmail;

  if(!chosenEmail){
    showToast("Add an email before connecting Spotify");
    return;
  }

  savePreferences();

  if(!SPOTIFY_CLIENT_ID){
    const body = document.createElement("div");
    const info = document.createElement("div");
    info.className = "modal-sub";
    info.textContent = `UI is ready for Spotify handoff using ${chosenEmail}. To complete real login, add a Spotify client ID and a backend callback URL.`;
    const row = document.createElement("div");
    row.className = "row2";
    const openSpotify = document.createElement("button");
    openSpotify.className = "btn2 primary";
    openSpotify.type = "button";
    openSpotify.textContent = "Open Spotify Web";
    openSpotify.onclick = () => {
      window.open("https://open.spotify.com/", "_blank", "noopener");
      closeModal();
    };
    row.appendChild(openSpotify);
    body.appendChild(info);
    body.appendChild(row);
    openModal("Spotify connection setup", "Frontend ready, OAuth backend pending", body);
    return;
  }

  const redirectUri = encodeURIComponent(window.location.href);
  const scope = encodeURIComponent("user-read-email user-read-private streaming");
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(SPOTIFY_CLIENT_ID)}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}&show_dialog=true`;
  window.open(authUrl, "_blank", "noopener");
}

function bindEvents(){
  soundPresetEl.addEventListener("change", () => {
    preferences.soundPreset = soundPresets[soundPresetEl.value] ? soundPresetEl.value : preferences.soundPreset;
    applySoundUI();
    savePreferences();
  });

  soundVolumeEl.addEventListener("input", () => {
    preferences.soundVolume = clampInt(soundVolumeEl.value, 0, 100, 70);
    savePreferences();
  });

  sessionNameInput.addEventListener("input", () => {
    preferences.sessionName = String(sessionNameInput.value || "").slice(0, 40).trim() || "Focus Sprint";
    sessionTitleEl.textContent = preferences.sessionName;
    savePreferences();
  });

  spotifyAltEmailEl.addEventListener("input", () => {
    preferences.spotifyAltEmail = spotifyAltEmailEl.value.trim();
    savePreferences();
    updateSpotifyEmailDisplay();
  });

  backgroundImageUrlEl.addEventListener("change", () => {
    if(backgroundImageSyncEl.checked){
      syncBackgroundImageControls();
    }
  });

  backgroundImageSyncEl.addEventListener("change", () => {
    visualPreferences.pomodoroSyncWithDashboard = backgroundImageSyncEl.checked;
    saveVisualPreferences();
    syncBackgroundImageControls();
    applyAppearance();
    showToast(backgroundImageSyncEl.checked ? "Using dashboard background image" : "Pomodoro using custom background");
  });

  backgroundBlurEnabledEl.addEventListener("change", () => {
    if(backgroundImageSyncEl.checked){
      syncBackgroundImageControls();
    }
  });

  backgroundBlurAmountEl.addEventListener("input", () => {
    if(backgroundImageSyncEl.checked){
      syncBackgroundImageControls();
    }
  });

  document.querySelectorAll('input[name="spotifyEmailMode"]').forEach((input) => {
    input.addEventListener("change", () => {
      if(input.checked){
        preferences.spotifyEmailMode = input.value;
        spotifyAltEmailEl.disabled = input.value !== "new";
        savePreferences();
        updateSpotifyEmailDisplay();
      }
    });
  });

  focusModeSoundPresetEl.addEventListener("change", () => {
    preferences.soundPreset = soundPresets[focusModeSoundPresetEl.value] ? focusModeSoundPresetEl.value : preferences.soundPreset;
    soundPresetEl.value = preferences.soundPreset;
    applySoundUI();
    savePreferences();
  });

  focusModeBackgroundEl.addEventListener("change", () => {
    if(focusModeBackgroundEl.value === "custom"){
      focusModeBackgroundEl.value = preferences.background;
      openCustomBackdropModal();
      return;
    }
    preferences.background = focusModeBackgroundEl.value;
    applyAppearance();
    renderBackgroundPresets();
    savePreferences();
  });

  focusModeAmbienceEl.addEventListener("change", () => {
    preferences.ambience = focusModeAmbienceEl.value;
    applyAmbience();
    renderAmbiencePresets();
    savePreferences();
  });

  focusModeRingColorEl.addEventListener("change", () => {
    preferences.ringColor = focusModeRingColorEl.value;
    applyRingAppearance();
    renderRingColorPresets();
    savePreferences();
  });

  ringCustomColorEl.addEventListener("input", () => {
    preferences.ringColor = "custom";
    preferences.customRingColor = ringCustomColorEl.value;
    focusModeRingColorEl.value = "custom";
    applyRingAppearance();
    renderRingColorPresets();
    savePreferences();
  });

  document.addEventListener("mousemove", () => {
    if(!focusModeEnabled || !timer) return;
    if(Date.now() < focusModeSuppressMouseUntil) return;
    enterFocusMode(false);
    resetFocusModeInactivityTimer();
  });

  document.addEventListener("mousedown", () => {
    if(!focusModeEnabled || !timer) return;
    if(Date.now() < focusModeSuppressMouseUntil) return;
    enterFocusMode(false);
    resetFocusModeInactivityTimer();
  });

  document.addEventListener("keydown", () => {
    if(!focusModeEnabled || !timer) return;
    enterFocusMode(false);
    resetFocusModeInactivityTimer();
  });

  document.addEventListener("visibilitychange", () => {
    if(timer) tick();
  });
}

(async function init(){
  const savedTheme = localStorage.getItem("theme");
  if(savedTheme){
    document.documentElement.setAttribute("data-theme", savedTheme);
    setThemeUi(savedTheme);
  }
  if(!savedTheme) setThemeUi("light");

  populateSoundPresets();
  await loadPreferences();
  populateCompactSelectors();
  await loadVisualPreferences();
  renderBackgroundPresets();
  renderAmbiencePresets();
  renderRingColorPresets();
  renderSpotifyPlaylists();
  syncFormWithPreferences();
  applyAppearance();
  applyAmbience();
  applySoundUI();
  applyRingAppearance();
  bindEvents();
  hardResetToFocus();
})();
