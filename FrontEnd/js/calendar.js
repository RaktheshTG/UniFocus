
    const DAILY_STATS_KEY = "unifocus_pomodoro_daily_stats";
    const CALENDAR_NOTES_KEY = "unifocus_calendar_notes";

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
    function pad2(n){ return String(n).padStart(2, "0"); }
    function dateKey(d){
      return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
    }

    function loadDailyMinutes(){
      try{
        const raw = localStorage.getItem(scopedStorageKey(DAILY_STATS_KEY));
        const data = raw ? JSON.parse(raw) : {};
        const out = {};
        Object.keys(data).forEach(k=>{
          out[k] = Number((data[k] && data[k].minutes) || 0);
        });
        return out;
      }catch(e){
        return {};
      }
    }

    function loadDayNotes(){
      try{
        const raw = localStorage.getItem(scopedStorageKey(CALENDAR_NOTES_KEY));
        return raw ? JSON.parse(raw) : {};
      }catch(e){
        return {};
      }
    }

    function saveDayNotes(notes){
      try{
        localStorage.setItem(scopedStorageKey(CALENDAR_NOTES_KEY), JSON.stringify(notes));
      }catch(e){}
    }

    function minutesToHeatClass(minutes){
      const hrs = minutes / 60;
      if(hrs <= 0) return "heat0";
      if(hrs <= 1) return "heat1";
      if(hrs <= 2) return "heat2";
      if(hrs <= 4) return "heat3";
      return "heat4";
    }

    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let view = new Date();
    view.setDate(1);

    function mondayIndex(jsDay){
      // JS: 0 Sun..6 Sat -> Mon..Sun index 0..6
      return (jsDay + 6) % 7;
    }

    function render(){
      const grid = document.getElementById("grid");
      const title = document.getElementById("monthTitle");
      const today = new Date();
      const todayK = dateKey(today);

      title.textContent = `${monthNames[view.getMonth()]} ${view.getFullYear()}`;

      const daily = loadDailyMinutes();
      const notes = loadDayNotes();

      grid.innerHTML = "";

      const year = view.getFullYear();
      const month = view.getMonth();

      const first = new Date(year, month, 1);
      const startPad = mondayIndex(first.getDay());
      const start = new Date(year, month, 1 - startPad);

      for(let i=0;i<42;i++){
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const k = dateKey(d);
        const inMonth = d.getMonth() === month;

        const cell = document.createElement("div");
        cell.className = `day ${minutesToHeatClass(daily[k] || 0)} ${inMonth ? "" : "muted"} ${k===todayK ? "today" : ""}`;

        const num = document.createElement("div");
        num.className = "num";
        num.textContent = String(d.getDate());

        const dotsWrap = document.createElement("div");
        dotsWrap.className = "dots";
        const { hasNote, hasTask } = dayTypeFlags(notes[k]);
        if(hasNote){
          const dn = document.createElement("div");
          dn.className = "dot note";
          dotsWrap.appendChild(dn);
        }
        if(hasTask){
          const dt = document.createElement("div");
          dt.className = "dot task";
          dotsWrap.appendChild(dt);
        }

        const labelsWrap = document.createElement("div");
        labelsWrap.className = "day-labels";
        if(hasNote){
          const label = document.createElement("span");
          label.className = "day-label note";
          label.textContent = "Note";
          labelsWrap.appendChild(label);
        }
        if(hasTask){
          const label = document.createElement("span");
          label.className = "day-label task";
          label.textContent = "Task";
          labelsWrap.appendChild(label);
        }

        cell.appendChild(num);
        cell.appendChild(dotsWrap);
        cell.appendChild(labelsWrap);

        cell.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openDayMenuAtCenter(k, cell);
        };
        cell.oncontextmenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          showDayMenu(e.clientX, e.clientY, k);
        };

        grid.appendChild(cell);
      }
    }

    function normalizeDayItems(raw){
      // New format: [{ id, type: 'note'|'task', text, createdAt }]
      // Back-compat: ["string", ...] treated as notes
      if(!raw) return [];
      if(Array.isArray(raw) && raw.length && typeof raw[0] === "string"){
        return raw.map((t)=>({
          id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
          type: "note",
          text: String(t).slice(0, 240),
          createdAt: new Date().toISOString()
        }));
      }
      if(Array.isArray(raw)){
        return raw
          .filter(Boolean)
          .map(x=>({
            id: String(x.id || `${Date.now()}_${Math.random().toString(16).slice(2)}`),
            type: (x.type === "task" ? "task" : "note"),
            text: String(x.text || "").slice(0, 240),
            createdAt: x.createdAt || new Date().toISOString()
          }))
          .filter(x=>x.text.trim().length>0);
      }
      return [];
    }

    function dayTypeFlags(raw){
      const items = normalizeDayItems(raw);
      let hasNote = false, hasTask = false;
      items.forEach(it=>{
        if(it.type === "task") hasTask = true;
        if(it.type === "note") hasNote = true;
      });
      return { hasNote, hasTask, count: items.length };
    }

    const calMenu = document.getElementById("calMenu");
    const calMenuHead = document.getElementById("calMenuHead");
    let activeDayKey = null;

    function showDayMenu(x, y, key){
      activeDayKey = key;
      calMenuHead.textContent = key;
      calMenu.classList.add("show");
      calMenu.setAttribute("aria-hidden", "false");
      const pad = 10;
      const w = 220;
      const h = 200;
      let nx = x, ny = y;
      if(nx + w + pad > window.innerWidth) nx = window.innerWidth - w - pad;
      if(ny + h + pad > window.innerHeight) ny = window.innerHeight - h - pad;
      if(nx < pad) nx = pad;
      if(ny < pad) ny = pad;
      calMenu.style.left = nx + "px";
      calMenu.style.top = ny + "px";
    }

    function openDayMenuAtCenter(key, el){
      const r = el.getBoundingClientRect();
      showDayMenu(r.left + r.width/2, r.top + r.height/2, key);
    }

    function hideDayMenu(){
      calMenu.classList.remove("show");
      calMenu.setAttribute("aria-hidden", "true");
    }

    document.addEventListener("click", (e)=>{
      if(!e.target.closest("#calMenu")) hideDayMenu();
    });
    document.addEventListener("keydown", (e)=>{
      if(e.key === "Escape"){
        hideDayMenu();
        closeModal();
      }
    });

    calMenu.addEventListener("click", (e)=>{
      const btn = e.target.closest("button[data-action]");
      if(!btn || !activeDayKey) return;
      const action = btn.getAttribute("data-action");
      hideDayMenu();
      if(action === "add_note") openAddModal(activeDayKey, "note");
      if(action === "add_task") openAddModal(activeDayKey, "task");
      if(action === "details") openManageModal(activeDayKey);
      if(action === "clear") clearDay(activeDayKey);
    });

    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalSub = document.getElementById("modalSub");
    const modalBody = document.getElementById("modalBody");

    function openModal(title, sub, bodyEl){
      modalTitle.textContent = title;
      modalSub.textContent = sub || "";
      modalBody.innerHTML = "";
      modalBody.appendChild(bodyEl);
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    }

    function closeModal(){
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      modalBody.innerHTML = "";
    }

    modal.addEventListener("click", (e)=>{
      if(e.target === modal) closeModal();
    });

    function upsertItem(dayKey, type, text){
      const notes = loadDayNotes();
      const items = normalizeDayItems(notes[dayKey]);
      items.push({
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        type,
        text: String(text || "").slice(0, 240),
        createdAt: new Date().toISOString()
      });
      notes[dayKey] = items;
      saveDayNotes(notes);
      render();
    }

    function deleteItem(dayKey, id){
      const notes = loadDayNotes();
      const items = normalizeDayItems(notes[dayKey]).filter(it=>it.id !== id);
      if(items.length) notes[dayKey] = items;
      else delete notes[dayKey];
      saveDayNotes(notes);
      render();
    }

    function clearDay(dayKey){
      const notes = loadDayNotes();
      delete notes[dayKey];
      saveDayNotes(notes);
      render();
    }

    function openAddModal(dayKey, type){
      const wrap = document.createElement("div");

      const field = document.createElement("div");
      field.className = "field";

      const lab = document.createElement("div");
      lab.className = "label";
      lab.textContent = type === "task" ? "Task" : "Note";

      const ta = document.createElement("textarea");
      ta.placeholder = type === "task" ? "Add a task (what’s pending?)" : "Add a note";
      ta.maxLength = 240;
      ta.autofocus = true;

      field.appendChild(lab);
      field.appendChild(ta);

      const row = document.createElement("div");
      row.className = "row";
      const cancel = document.createElement("button");
      cancel.className = "btn";
      cancel.type = "button";
      cancel.textContent = "Cancel";
      cancel.onclick = closeModal;

      const save = document.createElement("button");
      save.className = "btn primary";
      save.type = "button";
      save.textContent = "Save";
      save.onclick = ()=>{
        const t = ta.value.trim();
        if(!t){ ta.focus(); return; }
        upsertItem(dayKey, type, t);
        closeModal();
      };

      row.appendChild(cancel);
      row.appendChild(save);

      wrap.appendChild(field);
      wrap.appendChild(row);

      openModal(`${type === "task" ? "Add task" : "Add note"}`, dayKey, wrap);
      setTimeout(()=>ta.focus(), 0);
    }

    function openManageModal(dayKey){
      const notes = loadDayNotes();
      const items = normalizeDayItems(notes[dayKey]);

      const wrap = document.createElement("div");
      const list = document.createElement("div");
      list.className = "items";

      if(items.length === 0){
        const empty = document.createElement("div");
        empty.className = "modal-sub";
        empty.textContent = "No notes or tasks for this day yet.";
        wrap.appendChild(empty);
      } else {
        items.forEach(it=>{
          const row = document.createElement("div");
          row.className = "item";

          const left = document.createElement("div");
          left.style.minWidth = "0";

          const tag = document.createElement("span");
          tag.className = "tag " + it.type;
          tag.textContent = it.type === "task" ? "Task" : "Note";

          const text = document.createElement("div");
          text.className = "itext";
          text.textContent = it.text;

          left.appendChild(tag);
          left.appendChild(text);

          const mini = document.createElement("div");
          mini.className = "mini";
          const del = document.createElement("button");
          del.className = "btn danger";
          del.type = "button";
          del.textContent = "Delete";
          del.onclick = ()=>{ deleteItem(dayKey, it.id); openManageModal(dayKey); };
          mini.appendChild(del);

          row.appendChild(left);
          row.appendChild(mini);
          list.appendChild(row);
        });
        wrap.appendChild(list);
      }

      const actions = document.createElement("div");
      actions.className = "row";

      const addNote = document.createElement("button");
      addNote.className = "btn";
      addNote.type = "button";
      addNote.textContent = "Add note";
      addNote.onclick = ()=>openAddModal(dayKey, "note");

      const addTask = document.createElement("button");
      addTask.className = "btn";
      addTask.type = "button";
      addTask.textContent = "Add task";
      addTask.onclick = ()=>openAddModal(dayKey, "task");

      const close = document.createElement("button");
      close.className = "btn primary";
      close.type = "button";
      close.textContent = "Done";
      close.onclick = closeModal;

      actions.appendChild(addNote);
      actions.appendChild(addTask);
      actions.appendChild(close);
      wrap.appendChild(actions);

      openModal("Manage day", dayKey, wrap);
    }

    function prevMonth(){
      view = new Date(view.getFullYear(), view.getMonth()-1, 1);
      render();
    }

    function nextMonth(){
      view = new Date(view.getFullYear(), view.getMonth()+1, 1);
      render();
    }

    function goToday(){
      const now = new Date();
      view = new Date(now.getFullYear(), now.getMonth(), 1);
      render();
    }

    function toggleTheme(){
      const current=document.documentElement.getAttribute("data-theme");
      const next=current==="dark"?"light":"dark";
      document.documentElement.setAttribute("data-theme",next);
      localStorage.setItem("theme",next);
      document.getElementById("themeBtn").textContent=next==="dark"?"Light":"Dark";
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

    window.prevMonth = prevMonth;
    window.nextMonth = nextMonth;
    window.goToday = goToday;
    window.goDashboard = goDashboard;
    window.toggleTheme = toggleTheme;
    window.closeModal = closeModal;
  
