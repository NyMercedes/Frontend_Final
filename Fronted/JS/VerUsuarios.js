$(document).ready(function () {
    $.ajax({
      url: "http://localhost:5002/usuario/TodosUsuarios",
      method: "GET",
      dataType: "json",
      success: function (data) {
        if (Array.isArray(data)) {
          data.forEach(usuario => {
            $("#usuariosTable tbody").append(`
              <tr>
                <td>${usuario.codigo_usuario}</td>
                <td>${usuario.nombre_usuario}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.password}</td>
                <td>${usuario.email}</td>
                <td>${usuario.estado}</td>
                <td>${usuario.ultima_fecha_hora_ingreso}</td>
                <td>${usuario.password_expira}</td>
                <td>${usuario.dias_caducidad_password}</td>
                <td>${usuario.rol}</td>
                <td>${usuario.numero_intentos_incorrectos}</td>
                <td>${usuario.fecha_registro}</td>
              </tr>
            `);
          });
        } else {
          $("#mensajeError").text("No se pudo obtener la lista de usuarios.");
        }
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText); // Log para error detallado
        $("#mensajeError").text("Error al conectar con el servidor.");
      }
    });
  });