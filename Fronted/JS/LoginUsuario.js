function LoginUsuario() {
  var datosLogin = {
      nombre_usuario: $('#nombre_usuario').val(),
      password: $('#password').val()
  };

  var datosLoginJSON = JSON.stringify(datosLogin);

  $.ajax({
      url: "http://localhost:5002/usuario/Login",
      type: "POST",
      data: datosLoginJSON,
      datatype: "JSON",
      contentType: "application/json",
      success: function (data) {
          var responseEl = $('#response');
          responseEl.text(data.message);
          if (data.success) {
              responseEl.removeClass().addClass("text-success");
              setTimeout(function () {
                  window.location.href = "Home.html";
              }, 1500);
          } else {
              responseEl.removeClass().addClass("text-danger");
          }
      },
      error: function (xhr, status, error) {
          $('#response').text("Error de conexión con el servidor.").removeClass().addClass("text-danger");
          console.error(xhr.responseText);
      }
  });
}

// Asignar el evento cuando el DOM esté listo
$(document).ready(function () {
  $('#loginForm').on('submit', function (e) {
      e.preventDefault();
      LoginUsuario();
  });
});
