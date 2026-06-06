
    const API_BASE = "https://unifocus-backend.onrender.com";

    async function parseApiResponse(res){
      const raw = await res.text();

      if (!raw) {
        return {
          ok: res.ok,
          data: null,
          message: `Server returned an empty response (${res.status})`,
        };
      }

      try{
        const data = JSON.parse(raw);
        return {
          ok: res.ok,
          data,
          message: data.message || data.error || "",
        };
      }catch(_error){
        return {
          ok: res.ok,
          data: null,
          message: raw.trim() || `Unexpected server response (${res.status})`,
        };
      }
    }

    async function loginUser(event){
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try{
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ email, password })
        });

        const result = await parseApiResponse(res);
        if(!result.ok) throw new Error(result.message || "Login failed");
        if(!result.data) throw new Error("Server did not return login details");

        localStorage.setItem("user_id", result.data.user_id);
        localStorage.setItem("full_name", result.data.full_name);
        localStorage.setItem("email", result.data.email);

        alert("Login successful ✅");
        window.location.href = "dashboard.html";
      }catch(err){
        alert(err.message);
        console.error(err);
      }
    }
    
