
    const API_BASE = (() => {
      const { protocol, hostname, port, origin } = window.location;
      if (port === "5050") return origin;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return `${protocol}//${hostname}:5050`;
      }
      return origin;
    })();

  const range=document.getElementById("stressRange");
  const result=document.getElementById("stressResult");
  const stressLevel=document.getElementById("stressLevel");

  function updateStress(){
    const value=Number(range.value);
    stressLevel.textContent=value+" / 10";
    if(value<=3){
      result.textContent="You're calm 😄";
      range.style.accentColor="green";
    } else if(value<=6){
      result.textContent="Take a short break 🌿";
      range.style.accentColor="#0077ff";
    } else {
      result.textContent="Time to relax 🧘";
      range.style.accentColor="red";
    }
  }

  range.oninput=updateStress;
  updateStress();

  let breathingTimers=[];

  function stopBreathing(){
    breathingTimers.forEach(id=>clearTimeout(id));
    breathingTimers=[];
    document.getElementById("breathingText").textContent="";
  }

  function startBreathing(){
    stopBreathing();
    const text=document.getElementById("breathingText");
    text.textContent="Breathe In...";
    breathingTimers.push(setTimeout(()=>text.textContent="Hold...", 4000));
    breathingTimers.push(setTimeout(()=>text.textContent="Breathe Out...", 8000));
    breathingTimers.push(setTimeout(()=>text.textContent="Good job 🌿", 12000));
    breathingTimers.push(setTimeout(()=>text.textContent="", 15000));
  }

  async function showQuote(){
    const el = document.getElementById("quoteText");
    el.textContent = "Loading quote...";

    try{
      const res = await fetch(`${API_BASE}/api/quotes/random`);
      if(!res.ok) throw new Error("Quote fetch failed");
      const q = await res.json();

      const text = q.quote_text || "Stay strong 💪";
      const author = q.author ? ` — ${q.author}` : "";
      el.textContent = text + author;
    }catch(err){
      el.textContent = "Could not load quote 😵 (is backend running?)";
      console.error(err);
    }
  }

  function clearQuote(){
    document.getElementById("quoteText").textContent="";
  }

  function getUserId() {
  // Later, after login, we’ll store user_id in localStorage.
  // For now fallback to 1 (your demo user).
  const stored = localStorage.getItem("user_id");
  return stored ? Number(stored) : 1;
}

async function saveStress() {
  const msg = document.getElementById("stressSaveMsg");
  const stressLevelValue = Number(document.getElementById("stressRange").value);

  msg.style.display = "inline-flex";
  msg.textContent = "Saving...";

  // simple mood label based on level
  let mood = "Calm";
  if (stressLevelValue >= 7) mood = "Anxious";
  else if (stressLevelValue >= 4) mood = "Neutral";

  try {
    const res = await fetch(`${API_BASE}/api/stress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: getUserId(),
        stress_level: stressLevelValue,
        mood: mood,
        trigger_note: null,
        coping_action: "Stress page slider",
        outcome_note: null
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || data?.error || "Save failed");

    msg.textContent = "Saved ✅";
    setTimeout(() => { msg.style.display = "none"; }, 1500);

  } catch (err) {
    msg.textContent = "Failed ❌";
    alert(err.message);

    console.error(err);
  }
}


  const gameArea=document.getElementById("gameArea");
  const scoreEl=document.getElementById("score");
  let score=0;
  let gameInterval=null;
  let bubbleId=0;

  function rand(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  function spawnBubble(){
    const b=document.createElement("div");
    b.className="bubble";
    b.dataset.id=String(++bubbleId);

    const size=rand(36,60);
    b.style.width=size+"px";
    b.style.height=size+"px";

    const left=rand(10, gameArea.clientWidth - size - 10);
    b.style.left=left+"px";

    const duration=rand(3500, 6500);
    b.style.animationDuration=duration+"ms";

    const c=[
      "rgba(0,150,255,0.70)",
      "rgba(255,120,180,0.55)",
      "rgba(120,255,200,0.55)",
      "rgba(255,220,120,0.55)"
    ];
    b.style.background=c[rand(0,c.length-1)];

    b.onclick=function(){
      score++;
      scoreEl.textContent=String(score);
      b.remove();
    };

    b.addEventListener("animationend", ()=>{ b.remove(); });

    gameArea.appendChild(b);
  }

  function startGame(){
    stopGame();
    score=0;
    scoreEl.textContent="0";
    gameInterval=setInterval(spawnBubble, 700);
  }

  function stopGame(){
    if(gameInterval) clearInterval(gameInterval);
    gameInterval=null;
    while(gameArea.firstChild) gameArea.removeChild(gameArea.firstChild);
  }

  document.getElementById("year").textContent=new Date().getFullYear();

  function toggleTheme(){
    const current=document.documentElement.getAttribute("data-theme")||"light";
    const next=current==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",next);
    localStorage.setItem("theme",next);
    document.getElementById("themeBtn").textContent=next==="dark"?"Light":"Dark";
  }

  (function(){
    const saved=localStorage.getItem("theme");
    if(saved){
      document.documentElement.setAttribute("data-theme",saved);
      document.getElementById("themeBtn").textContent=saved==="dark"?"Light":"Dark";
    } else {
      document.getElementById("themeBtn").textContent="Dark";
    }
  })();

