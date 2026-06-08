
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

    function goDashboard(){
      window.location.href = "dashboard.html";
    }
    function todayKey(){
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth()+1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    function loadDailyStats(){
      try{
        const raw = localStorage.getItem(scopedStorageKey(DAILY_STATS_KEY));
        const data = raw ? JSON.parse(raw) : {};
        const t = data[todayKey()] || { minutes: 0, sessions: 0, breaks: 0 };
        return { minutes: Number(t.minutes || 0), sessions: Number(t.sessions || 0), breaks: Number(t.breaks || 0) };
      }catch(e){
        return { minutes: 0, sessions: 0, breaks: 0 };
      }
    }

    function loadHistoryToday(){
      try{
        const raw = localStorage.getItem(scopedStorageKey(HISTORY_KEY));
        const arr = raw ? JSON.parse(raw) : [];
        const t = todayKey();
        return arr.filter(e => e && e.date === t);
      }catch(e){
        return [];
      }
    }

    function parseDateKey(k){
      const [y,m,d] = String(k).split("-").map(Number);
      if(!y||!m||!d) return null;
      return new Date(y, m-1, d);
    }

    function lastNDaysKeys(n){
      const out = [];
      const now = new Date();
      now.setHours(0,0,0,0);
      for(let i=n-1;i>=0;i--){
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        out.push(todayKeyFromDate(d));
      }
      return out;
    }

    function todayKeyFromDate(d){
      const y = d.getFullYear();
      const m = String(d.getMonth()+1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    function loadDailyMap(){
      try{
        const raw = localStorage.getItem(scopedStorageKey(DAILY_STATS_KEY));
        return raw ? JSON.parse(raw) : {};
      }catch(e){
        return {};
      }
    }

    function dayLabel(dateKeyStr){
      const dt = parseDateKey(dateKeyStr);
      if(!dt) return "";
      const names = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      return names[dt.getDay()];
    }

    function renderChart(){
      const canvas = document.getElementById("weekChart");
      const ctx = canvas.getContext("2d");
      const data = loadDailyMap();
      const keys = lastNDaysKeys(7);
      const vals = keys.map(k => (Number((data[k] && data[k].minutes) || 0) / 60));
      const labels = keys.map(k => dayLabel(k));

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0,0,w,h);

      const padL = 52, padR = 18, padT = 16, padB = 40;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      const maxVal = Math.max(4, ...vals);
      const yMax = Math.ceil(maxVal);

      const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const gridCol = theme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
      const textCol = theme === "dark" ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.70)";
      const barCol = "rgba(34,197,94,0.82)";
      const barGlow = "rgba(34,197,94,0.25)";

      // grid + y labels
      ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillStyle = textCol;
      ctx.strokeStyle = gridCol;
      ctx.lineWidth = 1;

      const steps = yMax;
      for(let i=0;i<=steps;i++){
        const y = padT + innerH - (innerH * (i/steps));
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();
        ctx.fillText(String(i), 18, y + 4);
      }

      // bars
      const gap = 12;
      const barW = (innerW - gap * (vals.length - 1)) / vals.length;
      for(let i=0;i<vals.length;i++){
        const v = Math.max(0, vals[i]);
        const bh = (v / yMax) * innerH;
        const x = padL + i * (barW + gap);
        const y = padT + innerH - bh;

        ctx.save();
        ctx.shadowColor = barGlow;
        ctx.shadowBlur = 18;
        ctx.fillStyle = barCol;
        roundRect(ctx, x, y, barW, bh, 12);
        ctx.fill();
        ctx.restore();

        // x labels
        ctx.fillStyle = textCol;
        const lx = x + barW/2;
        ctx.textAlign = "center";
        ctx.fillText(labels[i], lx, h - 14);
      }

      ctx.textAlign = "start";
    }

    function roundRect(ctx, x, y, w, h, r){
      const rr = Math.min(r, w/2, h/2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    }

    function computeStreakToday(history){
      let streak = 0;
      for(let i = history.length - 1; i >= 0; i--){
        const e = history[i];
        if(e.kind === "completed") streak++;
        else break;
      }
      return streak;
    }

    function escapeHtml(s){
      return String(s).replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
    }

    function refresh(){
      const { minutes, sessions, breaks } = loadDailyStats();
      const history = loadHistoryToday();
      const streak = computeStreakToday(history);

      document.getElementById("minutesToday").textContent = String(minutes);
      document.getElementById("sessionsToday").textContent = String(sessions);
      document.getElementById("streakToday").textContent = String(streak);
      const breaksEl = document.getElementById("breaksToday");
      if(breaksEl) breaksEl.textContent = String(breaks);

      const fireBox = document.getElementById("fireBox");
      if(streak >= 2) fireBox.classList.add("glow");
      else fireBox.classList.remove("glow");

      const list = document.getElementById("list");
      const empty = document.getElementById("empty");
      list.innerHTML = "";
      if(history.length === 0){
        empty.style.display = "block";
        return;
      }
      empty.style.display = "none";

      history.forEach(e=>{
        const div = document.createElement("div");
        div.className = "item";

        const left = document.createElement("div");
        left.className = "left";

        const badge = document.createElement("span");
        badge.className = "badge " + (e.kind === "completed" ? "good" : "partial");
        badge.textContent = e.kind === "completed" ? `Completed • ${e.minutes} min` : `Partial • ${e.minutes} min`;

        const meta = document.createElement("div");
        meta.className = "meta";
        const when = e.ts ? new Date(e.ts).toLocaleString() : "";
        meta.textContent = when;

        left.appendChild(badge);
        if(e.note && String(e.note).trim()){
          const note = document.createElement("div");
          note.className = "note";
          note.innerHTML = escapeHtml(e.note);
          left.appendChild(note);
        }
        left.appendChild(meta);

        div.appendChild(left);
        list.appendChild(div);
      });
    }

    function clearToday(){
      if(!confirm("Clear today's progress history and stats?")) return;
      const t = todayKey();
      try{
        const rawH = localStorage.getItem(scopedStorageKey(HISTORY_KEY));
        const arr = rawH ? JSON.parse(rawH) : [];
        const kept = arr.filter(e => !(e && e.date === t));
        localStorage.setItem(scopedStorageKey(HISTORY_KEY), JSON.stringify(kept));
      }catch(e){}
      try{
        const rawS = localStorage.getItem(scopedStorageKey(DAILY_STATS_KEY));
        const data = rawS ? JSON.parse(rawS) : {};
        delete data[t];
        localStorage.setItem(scopedStorageKey(DAILY_STATS_KEY), JSON.stringify(data));
      }catch(e){}
      refresh();
    }

    function syncThemeUi(theme){
      const glyph=document.getElementById("themeGlyph");
      const hint=document.getElementById("themeHint");
      if(glyph) glyph.textContent=theme==="dark"?"\u2600\uFE0F":"\uD83C\uDF19";
      if(hint) hint.textContent=theme==="dark"?"Light":"Dark";
    }

    function toggleTheme(){
      const current=document.documentElement.getAttribute("data-theme");
      const next=current==="dark"?"light":"dark";
      document.documentElement.setAttribute("data-theme",next);
      localStorage.setItem("theme",next);
      syncThemeUi(next);
    }

    (function init(){
      const saved=localStorage.getItem("theme")||"light";
      document.documentElement.setAttribute("data-theme",saved);
      syncThemeUi(saved);
      document.getElementById("year").textContent=new Date().getFullYear();
      refresh();
      renderChart();
    })();
  
