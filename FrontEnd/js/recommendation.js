
    const DAILY_STATS_KEY = "unifocus_pomodoro_daily_stats";
    const HISTORY_KEY = "unifocus_pomodoro_history";
    const CALENDAR_NOTES_KEY = "unifocus_calendar_notes";

    function getUserId(){
      const id = localStorage.getItem("user_id");
      return id ? Number(id) : null;
    }

    function scopedStorageKey(baseKey){
      const userId = getUserId();
      return userId ? `${baseKey}_user_${userId}` : `${baseKey}_guest`;
    }

    function goDashboard(){ window.location.href = "dashboard.html"; }

    function toggleTheme(){
      const current=document.documentElement.getAttribute("data-theme");
      const next=current==="dark"?"light":"dark";
      document.documentElement.setAttribute("data-theme",next);
      localStorage.setItem("theme",next);
      document.getElementById("themeBtn").textContent=next==="dark"?"Light":"Dark";
    }

    function pad2(n){ return String(n).padStart(2, "0"); }
    function dateKeyFromDate(d){
      return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
    }
    function parseDateKey(k){
      const [y,m,d] = String(k).split("-").map(Number);
      if(!y||!m||!d) return null;
      return new Date(y, m-1, d);
    }

    function loadDailyMap(){
      try{
        const raw = localStorage.getItem(scopedStorageKey(DAILY_STATS_KEY));
        return raw ? JSON.parse(raw) : {};
      }catch(e){ return {}; }
    }

    function loadHistory(){
      try{
        const raw = localStorage.getItem(scopedStorageKey(HISTORY_KEY));
        return raw ? JSON.parse(raw) : [];
      }catch(e){ return []; }
    }

    function loadCalendarNotes(){
      try{
        const raw = localStorage.getItem(scopedStorageKey(CALENDAR_NOTES_KEY));
        return raw ? JSON.parse(raw) : {};
      }catch(e){ return {}; }
    }

    function normalizeDayItems(raw){
      if(!raw) return [];
      if(Array.isArray(raw) && raw.length && typeof raw[0] === "string"){
        return raw.map(t=>({ id: "", type:"note", text:String(t) }));
      }
      if(Array.isArray(raw)){
        return raw.map(x=>({ id:String(x.id||""), type:(x.type==="task"?"task":"note"), text:String(x.text||"") }))
          .filter(x=>x.text.trim().length>0);
      }
      return [];
    }

    function lastNDaysKeys(n){
      const out = [];
      const now = new Date();
      now.setHours(0,0,0,0);
      for(let i=n-1;i>=0;i--){
        const d = new Date(now);
        d.setDate(now.getDate()-i);
        out.push(dateKeyFromDate(d));
      }
      return out;
    }

    function computeBestStudyTime(history, daily){
      // bucket minutes by time-of-day using session timestamps (completed+partial)
      const buckets = { morning:0, afternoon:0, evening:0, night:0 };
      history.forEach(e=>{
        if(!e || (e.kind !== "completed" && e.kind !== "partial")) return;
        const dt = e.ts ? new Date(e.ts) : null;
        if(!dt || isNaN(dt.getTime())) return;
        const h = dt.getHours();
        const mins = Number(e.minutes || 0);
        if(h >= 5 && h <= 11) buckets.morning += mins;
        else if(h >= 12 && h <= 16) buckets.afternoon += mins;
        else if(h >= 17 && h <= 20) buckets.evening += mins;
        else buckets.night += mins;
      });
      const entries = Object.entries(buckets).sort((a,b)=>b[1]-a[1]);
      const best = entries[0] || ["morning",0];
      return { buckets, bestPeriod: best[0], bestMinutes: best[1] };
    }

    function computeConsistency(daily){
      const keys = lastNDaysKeys(30);
      let studiedDays = 0;
      keys.forEach(k=>{
        const m = Number((daily[k] && daily[k].minutes) || 0);
        if(m > 0) studiedDays++;
      });
      return { studiedDays, totalDays: 30, ratio: studiedDays/30 };
    }

    function computeDropRate(history){
      let completed = 0;
      let dropped = 0;
      history.forEach(e=>{
        if(!e) return;
        if(e.kind === "completed") completed++;
        if(e.kind === "dropped") dropped++;
      });
      const total = completed + dropped;
      return { completed, dropped, total, rate: total ? (dropped/total) : 0 };
    }

    function computeAvgFocus(history){
      const list = history.filter(e=>e && e.kind === "completed").map(e=>Number(e.minutes||0)).filter(n=>n>0);
      const avg = list.length ? (list.reduce((a,b)=>a+b,0)/list.length) : 0;
      return { avgMinutes: avg, count: list.length };
    }

    function recommendTimer(avgFocusMin){
      const focusSetting = Number(localStorage.getItem("unifocus_pomo_focus_min") || 25);
      if(!Number.isFinite(focusSetting) || focusSetting <= 0) return null;
      if(avgFocusMin >= 0.75 * focusSetting){
        return { kind:"increase", msg:`Your average completed focus is close to your timer. Consider increasing focus time to ${focusSetting + 10} min.` };
      }
      if(avgFocusMin > 0 && avgFocusMin <= 0.45 * focusSetting){
        return { kind:"decrease", msg:`Your average completed focus is much shorter than your timer. Consider reducing focus time to ${Math.max(5, focusSetting - 10)} min.` };
      }
      return { kind:"keep", msg:`Your current focus timer (${focusSetting} min) looks well matched to your average sessions.` };
    }

    function buildMsgBadge(type){
      const span = document.createElement("span");
      span.className = "badge " + type;
      span.textContent = type === "good" ? "Good" : type === "warn" ? "Heads-up" : "Fix";
      return span;
    }

    function rowKV(key, value, badgeType, message){
      const row = document.createElement("div");
      row.className = "row";
      const left = document.createElement("div");
      const k = document.createElement("div");
      k.className = "k";
      k.textContent = key;
      const v = document.createElement("div");
      v.className = "v";
      v.textContent = value;
      left.appendChild(k);
      left.appendChild(v);

      const right = document.createElement("div");
      right.style.display = "flex";
      right.style.flexDirection = "column";
      right.style.gap = "6px";
      right.style.alignItems = "flex-end";
      right.appendChild(buildMsgBadge(badgeType));
      const msg = document.createElement("div");
      msg.className = "msg";
      msg.style.maxWidth = "420px";
      msg.style.textAlign = "right";
      msg.textContent = message;
      right.appendChild(msg);

      row.appendChild(left);
      row.appendChild(right);
      return row;
    }

    function loadDeadlines(){
      const cal = loadCalendarNotes();
      const now = new Date();
      now.setHours(0,0,0,0);
      const out = [];
      for(let i=0;i<7;i++){
        const d = new Date(now);
        d.setDate(now.getDate()+i);
        const k = dateKeyFromDate(d);
        const items = normalizeDayItems(cal[k]).filter(x=>x.type === "task" || x.type === "note");
        if(items.length){
          out.push({ date: k, daysAway: i, items });
        }
      }
      return out;
    }

    function render(){
      const daily = loadDailyMap();
      const history = loadHistory();

      const patt = document.getElementById("patternList");
      patt.innerHTML = "";

      const best = computeBestStudyTime(history, daily);
      const bestLabel = best.bestPeriod.charAt(0).toUpperCase() + best.bestPeriod.slice(1);
      patt.appendChild(rowKV(
        "Best study time",
        bestLabel,
        best.bestMinutes > 0 ? "good" : "warn",
        best.bestMinutes > 0 ? `You tend to study most during ${bestLabel.toLowerCase()}. Try scheduling your hardest work then.` : "No session timing data yet. Complete a few sessions to personalize this."
      ));

      const avg = computeAvgFocus(history);
      const timerRec = recommendTimer(avg.avgMinutes);
      const badge = timerRec.kind === "increase" ? "good" : timerRec.kind === "decrease" ? "warn" : "good";
      patt.appendChild(rowKV(
        "Average focus (completed)",
        `${avg.avgMinutes ? Math.round(avg.avgMinutes) : 0} min`,
        avg.count ? "good" : "warn",
        avg.count ? timerRec.msg : "Complete at least one focus session to compute this."
      ));

      const cons = computeConsistency(daily);
      const pct = Math.round(cons.ratio * 100);
      let consBadge = "good";
      let consMsg = "Great consistency. Keep it up.";
      if(pct < 35){ consBadge = "bad"; consMsg = "Low consistency. Aim for small daily wins (even 15–25 min) to build momentum."; }
      else if(pct < 65){ consBadge = "warn"; consMsg = "Decent consistency. Try setting a fixed daily start time to improve."; }
      patt.appendChild(rowKV(
        "Consistency",
        `${cons.studiedDays}/${cons.totalDays} days`,
        consBadge,
        consMsg
      ));

      const drop = computeDropRate(history);
      const dropPct = Math.round(drop.rate * 100);
      let dropBadge = "good";
      let dropMsg = "Drop rate looks healthy.";
      if(drop.total === 0){ dropBadge = "warn"; dropMsg = "No drop data yet. Partial resets will help personalize this."; }
      else if(dropPct >= 45){ dropBadge = "bad"; dropMsg = "High drop rate. Consider reducing focus time by 10 min and removing distractions before starting."; }
      else if(dropPct >= 25){ dropBadge = "warn"; dropMsg = "Moderate drop rate. Try a shorter focus or a 2‑minute plan before you start."; }
      patt.appendChild(rowKV(
        "Drop rate",
        drop.total ? `${dropPct}%` : "—",
        dropBadge,
        dropMsg
      ));

      const dl = document.getElementById("deadlineList");
      dl.innerHTML = "";
      const upcoming = loadDeadlines();
      if(upcoming.length === 0){
        const r = document.createElement("div");
        r.className = "row";
        const left = document.createElement("div");
        left.innerHTML = `<div class="k">Up next</div><div class="v">No items</div>`;
        const right = document.createElement("div");
        right.appendChild(buildMsgBadge("good"));
        const msg = document.createElement("div");
        msg.className = "msg";
        msg.textContent = "Add tasks/notes to upcoming days from Calendar to get deadline warnings here.";
        right.appendChild(msg);
        r.appendChild(left); r.appendChild(right);
        dl.appendChild(r);
      } else {
        upcoming.forEach(d=>{
          const tasks = d.items.filter(x=>x.type === "task");
          const notes = d.items.filter(x=>x.type === "note");
          const urgent = d.daysAway <= 1 && tasks.length;
          const badgeType = urgent ? "bad" : (d.daysAway <= 3 && tasks.length) ? "warn" : "good";
          const msg = urgent
            ? "Deadline is very near. Plan one focused session for it today."
            : (d.daysAway <= 3 && tasks.length)
              ? "Upcoming task. Schedule a session before it becomes urgent."
              : "Keep tracking your upcoming items.";
          const r = rowKV(
            d.date,
            `${tasks.length} task(s), ${notes.length} note(s)`,
            badgeType,
            msg
          );
          dl.appendChild(r);
        });
      }
    }

    (function init(){
      const saved=localStorage.getItem("theme");
      if(saved){
        document.documentElement.setAttribute("data-theme",saved);
        document.getElementById("themeBtn").textContent=saved==="dark"?"Light":"Dark";
      }
      document.getElementById("year").textContent=new Date().getFullYear();
      render();
    })();
  
