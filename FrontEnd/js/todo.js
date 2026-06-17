
    const pendingDiv=document.getElementById("pending");
    const doneDiv=document.getElementById("done");
    const taskInput=document.getElementById("taskInput");
    const pendingCount=document.getElementById("pendingCount");
    const doneCount=document.getElementById("doneCount");
    const toast=document.getElementById("toast");
    const API_BASE = "https://unifocus.onrender.com";

    function getUserId(){
      const id=localStorage.getItem("user_id");
      if(!id){ alert("Please login first"); window.location.href="login.html"; return null; }
      return Number(id);
    }

    async function parseRes(res){
      const text=await res.text();
      try{
        const data=text ? JSON.parse(text) : {};
        return { ok: res.ok, data };
      }catch(e){
        const msg=res.status===404 ? "Todo API not found – restart the BackEnd server (node server.js)." : res.status>=500 ? "Server error (e.g. 'todos' table missing in MySQL)." : "Server error – try restarting the backend on port 5050.";
        return { ok: false, data: { message: msg } };
      }
    }

    const todoContextMenu=document.getElementById("todoContextMenu");
    let todoMenuTask=null;

    function showTodoMenu(e, taskEl){
      e.preventDefault();
      e.stopPropagation();
      todoMenuTask=taskEl;
      todoContextMenu.classList.add("show");
      let x=e.clientX, y=e.clientY;
      const pad=8, w=180, h=80;
      if(x+w+pad>window.innerWidth) x=window.innerWidth-w-pad;
      if(y+h+pad>window.innerHeight) y=window.innerHeight-h-pad;
      if(x<pad) x=pad; if(y<pad) y=pad;
      todoContextMenu.style.left=x+"px"; todoContextMenu.style.top=y+"px";
    }
    function hideTodoMenu(){ todoContextMenu.classList.remove("show"); todoMenuTask=null; }

    todoContextMenu.querySelector('[data-action="edit"]').onclick=async (e)=>{
      e.stopPropagation();
      if(todoMenuTask){
        const textEl=todoMenuTask.querySelector(".text");
        const todoId=todoMenuTask.getAttribute("data-todo-id");
        if(textEl&&todoId){
          const current=textEl.textContent.trim();
          const newText=prompt("Edit task:", current);
          if(newText!==null){
            const userId=getUserId(); if(!userId) return;
            const res=await fetch(`${API_BASE}/api/todos/${todoId}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user_id:userId,task_text:newText.trim()||current}) });
            const {ok,data}=await parseRes(res);
            if(ok){ textEl.textContent=newText.trim()||current; showToast("Updated"); } else showToast(data.message||data.error||"Update failed");
          }
        }
      }
      hideTodoMenu();
    };
    todoContextMenu.querySelector('[data-action="delete"]').onclick=async (e)=>{
      e.stopPropagation();
      if(todoMenuTask){
        const todoId=todoMenuTask.getAttribute("data-todo-id");
        const userId=getUserId(); if(!userId||!todoId){ hideTodoMenu(); return; }
        const res=await fetch(`${API_BASE}/api/todos/${todoId}`,{ method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user_id:userId}) });
        const {ok,data}=await parseRes(res);
        if(ok){ todoMenuTask.remove(); updateCounts(); showToast("Deleted"); } else showToast(data.message||data.error||"Delete failed");
      }
      hideTodoMenu();
    };

    document.addEventListener("click", (e)=>{ if(!e.target.closest("#todoContextMenu")) hideTodoMenu(); });
    document.addEventListener("contextmenu", (e)=>{ if(!e.target.closest("#todoContextMenu")) hideTodoMenu(); });

    pendingDiv.addEventListener("contextmenu", function(e){
      const task=e.target.closest(".task");
      if(task) showTodoMenu(e, task);
    });
    doneDiv.addEventListener("contextmenu", function(e){
      const task=e.target.closest(".task");
      if(task) showTodoMenu(e, task);
    });

    function showToast(msg){
      toast.textContent=msg;
      toast.classList.add("show");
      setTimeout(()=>toast.classList.remove("show"), 1200);
    }

    function updateCounts(){
      pendingCount.textContent=pendingDiv.children.length;
      doneCount.textContent=doneDiv.children.length;
    }

    function createTaskElement(text, todoId, isDone, createdAt){
      const taskDiv=document.createElement("div");
      taskDiv.className="task";
      if(todoId) taskDiv.setAttribute("data-todo-id", todoId);

      const left=document.createElement("div");
      left.className="left";

      const checkbox=document.createElement("input");
      checkbox.type="checkbox";
      checkbox.className="check";
      if(isDone) checkbox.checked=true;

      const textWrap=document.createElement("div");
      textWrap.style.minWidth="0";

      const span=document.createElement("div");
      span.className="text";
      span.textContent=text;

      const meta=document.createElement("div");
      meta.className="meta";
      meta.textContent=createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString();

      textWrap.appendChild(span);
      textWrap.appendChild(meta);

      left.appendChild(checkbox);
      left.appendChild(textWrap);

      const mini=document.createElement("div");
      mini.className="mini";

      const del=document.createElement("button");
      del.className="icon-btn";
      del.type="button";
      del.textContent="Del";

      del.onclick=async function(){
        const id=taskDiv.getAttribute("data-todo-id");
        const userId=getUserId(); if(!userId||!id) return;
        const res=await fetch(`${API_BASE}/api/todos/${id}`,{ method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user_id:userId}) });
        const {ok,data}=await parseRes(res);
        if(ok){ taskDiv.remove(); updateCounts(); showToast("Deleted"); } else showToast(data.message||data.error||"Delete failed");
      };

      mini.appendChild(del);

      checkbox.onchange=async function(){
        const id=taskDiv.getAttribute("data-todo-id");
        const userId=getUserId(); if(!id||!userId) return;
        if(checkbox.checked){
          taskDiv.classList.add("doneState");
          taskDiv.style.transform="translateX(14px)";
          setTimeout(async ()=>{
            if(taskDiv.parentElement===pendingDiv){
              const res=await fetch(`${API_BASE}/api/todos/${id}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user_id:userId,is_done:1}) });
              const {ok}=await parseRes(res);
              if(ok){ pendingDiv.removeChild(taskDiv); doneDiv.appendChild(taskDiv); showToast("Moved to Accomplished"); updateCounts(); }
            }
          }, 180);
        } else {
          taskDiv.classList.remove("doneState");
          taskDiv.style.transform="translateX(-14px)";
          setTimeout(async ()=>{
            if(taskDiv.parentElement===doneDiv){
              const res=await fetch(`${API_BASE}/api/todos/${id}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user_id:userId,is_done:0}) });
              const {ok}=await parseRes(res);
              if(ok){ doneDiv.removeChild(taskDiv); pendingDiv.appendChild(taskDiv); showToast("Moved back to Pending"); updateCounts(); }
            }
          }, 180);
        }
      };

      taskDiv.appendChild(left);
      taskDiv.appendChild(mini);

      return taskDiv;
    }

    async function loadTodo(){
      const userId=getUserId(); if(!userId) return;
      try{
        const res=await fetch(`${API_BASE}/api/todos/${userId}`);
        const {ok,data}=await parseRes(res);
        if(!ok) throw new Error(data.message||data.error||"Failed to load");
        const list=Array.isArray(data)?data:[];
        pendingDiv.innerHTML="";
        doneDiv.innerHTML="";
        list.forEach(t=>{
          const el=createTaskElement(t.task_text, t.todo_id, t.is_done===1, t.created_at);
          if(t.is_done===1){ el.classList.add("doneState"); el.querySelector(".check").checked=true; doneDiv.appendChild(el); }
          else pendingDiv.appendChild(el);
        });
        updateCounts();
      }catch(err){
        const msg=err.message||"Load failed";
        showToast(msg);
        if(msg.includes("log in again")||msg.includes("User not found")) setTimeout(()=>{ window.location.href="login page.html"; }, 1500);
      }
    }

    async function addTask(){
      const text=taskInput.value.trim();
      if(!text){ showToast("Enter a task"); taskInput.focus(); return; }
      const userId=getUserId(); if(!userId) return;
      try{
        const res=await fetch(`${API_BASE}/api/todos`,{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user_id:userId,task_text:text,is_done:0}) });
        const {ok,data}=await parseRes(res);
        if(!ok) throw new Error(data.message||data.error||"Failed to add");
        const taskEl=createTaskElement(text, data.todo_id, false);
        pendingDiv.appendChild(taskEl);
        taskInput.value="";
        taskInput.focus();
        updateCounts();
        showToast("Added");
      }catch(err){
        const msg=err.message||"Add failed";
        console.error(err);
        showToast(msg);
        if(msg.includes("log in again")||msg.includes("User not found")) setTimeout(()=>{ window.location.href="login page.html"; }, 1500);
      }
    }

    async function clearDone(){
      if(doneDiv.children.length===0){ showToast("No done tasks"); return; }
      if(!confirm("Clear all accomplished tasks?")) return;
      const userId=getUserId(); if(!userId) return;
      try{
        const res=await fetch(`${API_BASE}/api/todos/${userId}/clear-done`, { method:"DELETE" });
        const {ok,data}=await parseRes(res);
        if(!ok) throw new Error(data.message||data.error||"Failed");
        while(doneDiv.firstChild) doneDiv.removeChild(doneDiv.firstChild);
        updateCounts();
        showToast("Cleared");
      }catch(err){ showToast(err.message||"Clear failed"); }
    }

    taskInput.addEventListener("keydown",(e)=>{
      if(e.key==="Enter") addTask();
    });

    document.getElementById("year").textContent=new Date().getFullYear();

    function syncThemeUi(theme){
      const glyph=document.getElementById("themeGlyph");
      const hint=document.getElementById("themeHint");
      if(glyph) glyph.textContent=theme==="dark"?"\u2600\uFE0F":"\uD83C\uDF19";
      if(hint) hint.textContent=theme==="dark"?"Light":"Dark";
    }

    function toggleTheme(){
      const current=document.documentElement.getAttribute("data-theme")||"light";
      const next=current==="dark"?"light":"dark";
      document.documentElement.setAttribute("data-theme",next);
      localStorage.setItem("theme",next);
      syncThemeUi(next);
    }

    (function(){
      const saved=localStorage.getItem("theme")||"light";
      document.documentElement.setAttribute("data-theme",saved);
      syncThemeUi(saved);
      loadTodo();
    })();

    window.addTask = addTask;
    window.clearDone = clearDone;
    window.toggleTheme = toggleTheme;
  
