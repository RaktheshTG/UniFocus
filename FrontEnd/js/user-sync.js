(function(){
  const API_BASE = "https://unifocus-backend.onrender.com";
  const pendingSaves = new Map();

  function getUserId(){
    const value = Number(localStorage.getItem("user_id"));
    return Number.isInteger(value) && value > 0 ? value : null;
  }

  function scopedKey(key){
    const userId = getUserId();
    return userId ? `${key}_user_${userId}` : `${key}_guest`;
  }

  function readLocal(key, fallback){
    try{
      const raw = localStorage.getItem(scopedKey(key));
      return raw ? JSON.parse(raw) : fallback;
    }catch(_error){
      return fallback;
    }
  }

  function writeLocal(key, value){
    localStorage.setItem(scopedKey(key), JSON.stringify(value));
  }

  async function request(path, options){
    const response = await fetch(`${API_BASE}${path}`, options);
    const data = await response.json().catch(() => ({}));
    if(!response.ok) throw new Error(data.message || data.error || "Sync request failed");
    return data;
  }

  async function load(namespace, localKey, fallback){
    const userId = getUserId();
    const localValue = readLocal(localKey, fallback);
    if(!userId) return localValue;

    try{
      const result = await request(`/api/preferences/${userId}/${encodeURIComponent(namespace)}`);
      if(result.exists){
        writeLocal(localKey, result.value);
        return result.value;
      }

      await save(namespace, localKey, localValue, true);
      return localValue;
    }catch(error){
      console.error(`Could not load ${namespace}`, error);
      return localValue;
    }
  }

  async function save(namespace, localKey, value, immediate){
    writeLocal(localKey, value);
    const userId = getUserId();
    if(!userId) return;

    const send = async () => {
      pendingSaves.delete(namespace);
      try{
        await request(`/api/preferences/${userId}/${encodeURIComponent(namespace)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value })
        });
      }catch(error){
        console.error(`Could not save ${namespace}`, error);
      }
    };

    if(immediate) return send();
    clearTimeout(pendingSaves.get(namespace));
    pendingSaves.set(namespace, setTimeout(send, 250));
  }

  async function hydratePomodoroStats(storageKey){
    const userId = getUserId();
    if(!userId) return readLocal(storageKey, {});
    try{
      const rows = await request(`/api/pomodoro/stats/${userId}`);
      const stats = {};
      rows.forEach((row) => {
        stats[String(row.stat_date).slice(0, 10)] = {
          minutes: Number(row.minutes || 0),
          sessions: Number(row.sessions || 0),
          breaks: Number(row.breaks || 0)
        };
      });
      writeLocal(storageKey, stats);
      return stats;
    }catch(error){
      console.error("Could not sync Pomodoro statistics", error);
      return readLocal(storageKey, {});
    }
  }

  async function hydrateCalendar(storageKey){
    const userId = getUserId();
    if(!userId) return readLocal(storageKey, {});
    try{
      const rows = await request(`/api/calendar/${userId}`);
      const itemsByDate = {};
      rows.forEach((row) => {
        const date = String(row.item_date).slice(0, 10);
        if(!itemsByDate[date]) itemsByDate[date] = [];
        itemsByDate[date].push({
          id: String(row.item_id),
          type: row.item_type,
          text: row.item_text,
          createdAt: row.created_at
        });
      });
      writeLocal(storageKey, itemsByDate);
      return itemsByDate;
    }catch(error){
      console.error("Could not sync calendar", error);
      return readLocal(storageKey, {});
    }
  }

  window.UserSync = {
    API_BASE, getUserId, scopedKey, readLocal, writeLocal, load, save, request,
    hydratePomodoroStats, hydrateCalendar
  };
})();
