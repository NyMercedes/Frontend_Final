document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const nombre_usuario = document.getElementById("nombre_usuario").value;
    const password = document.getElementById("password").value;
  
    try {
      const res = await fetch("http://localhost:5002/usuario/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_usuario, password })
      });
  
      const data = await res.json();
      const responseEl = document.getElementById("response");
  
      responseEl.textContent = data.message;
      responseEl.className = data.success ? "text-success" : "text-danger";
  
      if (data.success) {
        setTimeout(() => {
          window.location.href = "Home.html";
        }, 1500);
      }
  
    } catch (error) {
      document.getElementById("response").textContent = "Error de conexión con el servidor.";
      document.getElementById("response").className = "text-danger";
    }
  });
  