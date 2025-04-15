document.getElementById("registroForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre_usuario = document.getElementById("nombre_usuario").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const confirmar_password = document.getElementById("confirmar_password").value;
    const rol = document.getElementById("rol").value;

    const responseEl = document.getElementById("response");
    responseEl.textContent = "";
    responseEl.className = "";

    if (password !== confirmar_password) {
      responseEl.textContent = "Las contraseñas no coinciden.";
      responseEl.className = "text-danger";
      return;
    }

    const data = {
      nombre_usuario,
      apellido,
      password,
      email,
      rol
    };

    try {
      const res = await fetch("http://localhost:5002/usuario/Registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      responseEl.textContent = result.message;
      responseEl.className = result.success ? "text-success" : "text-danger";

      if (result.success) {
        setTimeout(() => {
          window.location.href = "LoginUsuario.html";
        }, 2000);
      }

    } catch (err) {
      responseEl.textContent = "Error de conexión con el servidor.";
      responseEl.className = "text-danger";
    }
  });