
    const API_BASE = (() => {
      const { protocol, hostname, port, origin } = window.location;
      if (port === "5050") return origin;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return `${protocol}//${hostname}:5050`;
      }
      return origin;
    })();
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const tableBody = document.querySelector("#tt tbody");
    const contextMenu = document.getElementById("contextMenu");
    const slotInput = document.getElementById("newSlot");
    let contextMenuCell = null;

    function getUserId() {
      const id = localStorage.getItem("user_id");
      if (!id) {
        alert("Please login first");
        window.location.href = "login page.html";
      }
      return Number(id);
    }

    function normalizeTime(t){
      const parts = t.trim().split(":");
      const h = (parts[0] || "0").padStart(2,"0");
      const m = (parts[1] || "00").padStart(2,"0");
      return `${h}:${m}`;
    }

    function parseTimeRange(text) {
      const parts = text.split("to").map(p => p.trim());
      return {
        start: normalizeTime(parts[0]),
        end: normalizeTime(parts[1])
      };
    }

    function applyFilled(cell){
      const has = cell.textContent.trim().length > 0;
      cell.classList.toggle("filled", has);
    }

    async function loadTimetable() {
      const userId = getUserId();
      const res = await fetch(`${API_BASE}/api/timetable/${userId}`);
      const data = await res.json();

      // clear existing cell texts
      document.querySelectorAll("#tt tbody td.slot").forEach(c => {
        c.textContent = "";
        c.classList.remove("filled");
      });

      data.forEach(slot => {
        const slotStart = normalizeTime(String(slot.start_time));
        const row = [...document.querySelectorAll("#tt tbody tr")].find(tr => {
          const { start } = parseTimeRange(tr.querySelector(".time").textContent.trim());
          return normalizeTime(start) === slotStart;
        });

        if (!row) return;

        const colIndex = days.indexOf(slot.day_of_week) + 1;
        const cell = row.children[colIndex];
        if (cell && cell.classList.contains("slot")) {
          cell.textContent = slot.subject;
          applyFilled(cell);
        }
      });
    }

    async function saveSlot(cell) {
      const userId = getUserId();
      const row = cell.closest("tr");
      const timeText = row.querySelector(".time").textContent.trim();
      const { start, end } = parseTimeRange(timeText);
      const dayIndex = cell.cellIndex - 1;
      const day = days[dayIndex];
      const subject = cell.textContent.trim();

      // empty => delete
      if (!subject) {
        await fetch(`${API_BASE}/api/timetable`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            day_of_week: day,
            start_time: start
          })
        });
        applyFilled(cell);
        return;
      }

      // upsert
      await fetch(`${API_BASE}/api/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          day_of_week: day,
          start_time: start,
          end_time: end,
          subject: subject
        })
      });

      applyFilled(cell);
    }

    function showContextMenu(e, cell) {
      e.preventDefault();
      e.stopPropagation();
      contextMenuCell = cell;
      contextMenu.classList.add("show");

      let x = e.clientX, y = e.clientY;
      const pad = 8, w = 180, h = 80;
      if (x + w + pad > window.innerWidth) x = window.innerWidth - w - pad;
      if (y + h + pad > window.innerHeight) y = window.innerHeight - h - pad;
      if (x < pad) x = pad;
      if (y < pad) y = pad;

      contextMenu.style.left = x + "px";
      contextMenu.style.top = y + "px";
    }

    function hideContextMenu() {
      contextMenu.classList.remove("show");
      contextMenuCell = null;
    }

    contextMenu.querySelector('[data-action="rename"]').onclick = async (e) => {
      e.stopPropagation();
      if (!contextMenuCell) { hideContextMenu(); return; }

      if (contextMenuCell.classList.contains("time")) {
        const current = contextMenuCell.textContent.trim();
        const newName = prompt("Time slot label:", current);
        if (newName !== null) contextMenuCell.textContent = newName.trim() || current;
      } else {
        const value = prompt("Enter subject:", contextMenuCell.textContent.trim());
        if (value !== null) {
          contextMenuCell.textContent = value.trim();
          await saveSlot(contextMenuCell);
        }
      }
      hideContextMenu();
    };

    contextMenu.querySelector('[data-action="delete"]').onclick = async (e) => {
      e.stopPropagation();
      if (!contextMenuCell) { hideContextMenu(); return; }

      // delete entire time row -> delete all 7 days for that start time
      if (contextMenuCell.classList.contains("time")) {
        const row = contextMenuCell.closest("tr");
        if (row) {
          const timeText = row.querySelector(".time").textContent.trim();
          const { start } = parseTimeRange(timeText);
          const userId = getUserId();

          for (const day of days) {
            await fetch(`${API_BASE}/api/timetable`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: userId, day_of_week: day, start_time: start })
            });
          }
          row.remove();
        }
      } else {
        contextMenuCell.textContent = "";
        await saveSlot(contextMenuCell);
      }
      hideContextMenu();
    };

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#contextMenu")) hideContextMenu();
    });
    document.addEventListener("contextmenu", (e) => {
      if (!e.target.closest("#contextMenu")) hideContextMenu();
    });

    tableBody.addEventListener("contextmenu", function (e) {
      const timeCell = e.target.closest("td.time");
      const slotCell = e.target.closest("td.slot");
      const cell = timeCell || slotCell;
      if (!cell) return;
      showContextMenu(e, cell);
    });

    tableBody.addEventListener("click", async function (e) {
      const cell = e.target.closest("td.slot");
      if (!cell) return;
      const value = prompt("Enter subject:", cell.textContent);
      if (value === null) return;
      cell.textContent = value.trim();
      await saveSlot(cell);
    });

    function addSlot() {
      const slot = slotInput.value.trim();
      if (!slot) {
        alert("Enter a time slot");
        return;
      }
      const row = document.createElement("tr");
      const timeCell = document.createElement("td");
      timeCell.textContent = slot;
      timeCell.className = "time";
      row.appendChild(timeCell);

      for (let i = 0; i < 7; i++) {
        const cell = document.createElement("td");
        cell.className = "slot";
        row.appendChild(cell);
      }

      tableBody.appendChild(row);
      slotInput.value = "";
      slotInput.focus();
    }

    async function clearAll() {
      if (!confirm("Clear the entire timetable?")) return;

      const userId = getUserId();
      const rows = [...document.querySelectorAll("#tt tbody tr")];

      for (const row of rows) {
        const timeText = row.querySelector(".time").textContent.trim();
        const { start } = parseTimeRange(timeText);

        for (const day of days) {
          await fetch(`${API_BASE}/api/timetable`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, day_of_week: day, start_time: start })
          });
        }
      }

      document.querySelectorAll("#tt tbody td.slot").forEach(cell => {
        cell.textContent = "";
        applyFilled(cell);
      });
    }

    slotInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addSlot();
    });

    document.getElementById("year").textContent = new Date().getFullYear();

    function toggleTheme() {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      document.getElementById("themeBtn").textContent = next === "dark" ? "Light" : "Dark";
    }

    (function () {
      const saved = localStorage.getItem("theme");
      if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
        document.getElementById("themeBtn").textContent = saved === "dark" ? "Light" : "Dark";
      } else {
        document.getElementById("themeBtn").textContent = "Dark";
      }
    })();

    document.addEventListener("DOMContentLoaded", loadTimetable);
  
