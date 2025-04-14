var UrlActualizarProducto = "http://localhost:5002/usuario/RegistrarUsuario";

function AgregarUsuario() {
    var datosusuario = {
        codigo_usuario: $('#codigo_usuario').val(),
        nombre: $('#nombre').val(),
        apellido: $('#apellido').val(),
        password: $('#password').val(),
        email: $('#email').val(),
        estado: $('#estado').val(),
        ultima_fecha_ingreso: $('#ultima_fecha_ingreso').val(),
        password_expira: $('#password_expira').val(),
        dias_caducidad_password: $('#dias_caducidad_password').val(),
        rol: $('#rol').val(),
        intentos_incorrectos: 0,
        fecha_registro: new Date().toISOString()
    };

    var datosusuariojson = JSON.stringify(datosusuario);

    $.ajax({
        url: "http://localhost:5002/usuario/RegistrarUsuario",
        type: 'POST',
        data: datosusuariojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function(response) {
            alert(response.mensaje);
            // limpiarFormularioUsuario(); // si lo tienes
        },
        error: function(xhr, status, error) {
            alert('❌ Error: ' + xhr.responseText);
        }
    });
}
