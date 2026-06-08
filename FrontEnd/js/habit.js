
    const API_BASE = "https://unifocus-backend.onrender.com";

  const tableBody = document.querySelector("#habitTable tbody");
  const input = document.getElementById("newHabit");
  const habitContextMenu = document.getElementById("habitContextMenu");

  // =========================
  // 7-DAY ROLLING WINDOW (LAST 7 DAYS, INCLUDING TODAY)
  // Display: dd/mm
  // Store:   YYYY-MM-DD
  // =========================
  function toISO(d){
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // local YYYY-MM-DD
}


  function ddmm(d) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}`;
  }

  function addDays(date, days) {
    const x = new Date(date);
    x.setDate(x.getDate() + days);
    return x;
  }

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)); // 6 days ago .. today
  const isoDates = dates.map(toISO);

  function renderDateHeaders() {
    const heads = document.querySelectorAll("th.dayHead");
    heads.forEach((th, i) => {
      th.textContent = ddmm(dates[i]);     // UI label
      th.dataset.iso = isoDates[i];        // stored date
    });
  }

  // =========================
  // AUTH (per-user)
  // =========================
  function getUserId() {
    const id = localStorage.getItem("user_id");
    if (!id) {
      alert("Please login first");
      window.location.href = "login page.html";
      return null;
    }
    return Number(id);
  }

  async function api(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok) {
      console.error("API ERROR:", res.status, data);
      throw new Error(data.message || data.error || text);
    }
    return data;
  }

  function setDoneStyle(cell, isDone) {
    cell.classList.toggle("done", !!isDone);
  }

  // =========================
  // RENDER TABLE FROM DB
  // =========================
  function clearTable() {
    tableBody.innerHTML = "";
  }

  function makeRow(habit, statusByDate) {
    const row = document.createElement("tr");
    row.dataset.habitId = String(habit.habit_id);

    const nameCell = document.createElement("td");
    nameCell.className = "habit-name";
    nameCell.textContent = habit.habit_name;
    row.appendChild(nameCell);

    for (let i = 0; i < 7; i++) {
      const cell = document.createElement("td");
      cell.className = "cell";
      cell.dataset.dayIndex = String(i);

      const dateKey = isoDates[i]; // ISO date for this column
      const isDone = statusByDate[dateKey] === "DONE";
      setDoneStyle(cell, isDone);

      cell.addEventListener("click", async () => {
        await toggleCellAndSave(row, cell);
      });

      row.appendChild(cell);
    }

    return row;
  }

  async function loadHabitsFromDB() {
    const userId = getUserId();
    if (!userId) return;

    clearTable();

    const habits = await api(`/api/habits/${userId}`);
    const logs = await api(`/api/habits/log/${userId}`);

    // Build: habit_id -> { 'YYYY-MM-DD': 'DONE'|'MISSED' }
    const logMap = {};
    logs.forEach((l) => {
      const hid = String(l.habit_id);
      if (!logMap[hid]) logMap[hid] = {};
      const d = String(l.log_date).slice(0, 10);
      logMap[hid][d] = l.status;
    });

    habits.forEach((h) => {
      const statusByDate = logMap[String(h.habit_id)] || {};
      tableBody.appendChild(makeRow(h, statusByDate));
    });
  }

  // =========================
  // ADD / DELETE / RENAME
  // =========================
  async function addHabit() {
    const userId = getUserId();
    if (!userId) return;

    const habitName = input.value.trim();
    if (habitName === "") {
      alert("Enter a habit name");
      return;
    }

    try{
      await api(`/api/habits`, {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          habit_name: habitName,
          description: null,
          frequency: "Daily",
        }),
      });

      input.value = "";
      input.focus();
      await loadHabitsFromDB();
    }catch(err){
      alert(err.message || "Could not add habit");
      console.error(err);
    }
  }

  async function deleteHabitRow(row) {
    const userId = getUserId();
    if (!userId) return;

    const habitId = Number(row.dataset.habitId);

    await api(`/api/habits/${habitId}`, {
      method: "DELETE",
      body: JSON.stringify({ user_id: userId }),
    });

    row.remove();
  }

  async function renameHabitRow(row) {
    // NOTE: No rename route in backend yet. This renames only visually for now.
    const nameCell = row.querySelector(".habit-name");
    if (!nameCell) return;

    const current = nameCell.textContent.trim();
    const newName = prompt("Habit name:", current);
    if (newName === null) return;

    nameCell.textContent = newName.trim() || current;
    // If you want DB rename too, tell me & I'll add PATCH /api/habits/:habitId
  }

  // =========================
  // CLICK CELL: TOGGLE + SAVE TO habit_log
  // =========================
  async function toggleCellAndSave(row, cell) {
    const habitId = Number(row.dataset.habitId);
    const dayIndex = Number(cell.dataset.dayIndex);
    const log_date = isoDates[dayIndex]; // ✅ real date for this column

    const newStatus = cell.classList.contains("done") ? "MISSED" : "DONE";

    try{
      await api(`/api/habits/log`, {
        method: "POST",
        body: JSON.stringify({
          habit_id: habitId,
          log_date: log_date,
          status: newStatus,
          notes: null,
        }),
      });

      setDoneStyle(cell, newStatus === "DONE");
    }catch(err){
      alert(err.message || "Could not save habit log");
      console.error(err);
    }
  }

  // =========================
  // RESET (sets all 7 days to MISSED)
  // =========================
  async function resetAll() {
    if (!confirm("Reset all habits for these 7 days?")) return;

    const rows = [...tableBody.querySelectorAll("tr")];
    for (const row of rows) {
      const habitId = Number(row.dataset.habitId);
      const cells = [...row.querySelectorAll("td.cell")];

      for (const cell of cells) {
        const dayIndex = Number(cell.dataset.dayIndex);
        const log_date = isoDates[dayIndex];

        await api(`/api/habits/log`, {
          method: "POST",
          body: JSON.stringify({
            habit_id: habitId,
            log_date: log_date,
            status: "MISSED",
            notes: "Reset",
          }),
        });

        setDoneStyle(cell, false);
      }
    }
  }

  // =========================
  // RIGHT CLICK MENU
  // =========================
  let habitMenuRow = null;

  function showHabitMenu(e, row) {
    e.preventDefault();
    e.stopPropagation();
    habitMenuRow = row;
    habitContextMenu.classList.add("show");

    let x = e.clientX, y = e.clientY;
    const pad = 8, w = 180, h = 80;
    if (x + w + pad > window.innerWidth) x = window.innerWidth - w - pad;
    if (y + h + pad > window.innerHeight) y = window.innerHeight - h - pad;
    if (x < pad) x = pad;
    if (y < pad) y = pad;

    habitContextMenu.style.left = x + "px";
    habitContextMenu.style.top = y + "px";
  }

  function hideHabitMenu() {
    habitContextMenu.classList.remove("show");
    habitMenuRow = null;
  }

  habitContextMenu.querySelector('[data-action="rename"]').onclick = async (e) => {
    e.stopPropagation();
    if (habitMenuRow) await renameHabitRow(habitMenuRow);
    hideHabitMenu();
  };

  habitContextMenu.querySelector('[data-action="delete"]').onclick = async (e) => {
    e.stopPropagation();
    if (habitMenuRow) await deleteHabitRow(habitMenuRow);
    hideHabitMenu();
  };

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#habitContextMenu")) hideHabitMenu();
  });
  document.addEventListener("contextmenu", (e) => {
    if (!e.target.closest("#habitContextMenu")) hideHabitMenu();
  });

  tableBody.addEventListener("contextmenu", function (e) {
    const nameCell = e.target.closest("td.habit-name");
    if (!nameCell) return;
    const row = nameCell.closest("tr");
    if (row) showHabitMenu(e, row);
  });

  // =========================
  // HOOK BUTTONS (since HTML uses onclick="")
  // =========================
  window.addHabit = addHabit;
  window.resetAll = resetAll;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addHabit();
  });

  // =========================
  // THEME (keep yours)
  // =========================
  document.getElementById("year").textContent = new Date().getFullYear();

  function syncThemeUi(theme) {
    const glyph = document.getElementById("themeGlyph");
    const hint = document.getElementById("themeHint");
    if (glyph) glyph.textContent = theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";
    if (hint) hint.textContent = theme === "dark" ? "Light" : "Dark";
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncThemeUi(next);
  }
  window.toggleTheme = toggleTheme;

  (function () {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    syncThemeUi(saved);
  })();

  // =========================
  // START
  // =========================
  document.addEventListener("DOMContentLoaded", async () => {
    renderDateHeaders();
    await loadHabitsFromDB();
  });

