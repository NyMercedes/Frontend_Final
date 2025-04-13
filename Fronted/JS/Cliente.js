var UrlTodosClientes = "http://localhost:5002/cliente/TodosClientes";
var UrlAgregarCliente = "http://localhost:5002/cliente/InsertarCliente";
var UrlBuscarCliente = "http://localhost:5002/cliente/UnicoCliente";
var UrlEliminarCliente = "http://localhost:5002/cliente/EliminarCliente";
var UrlActualizarCliente = "http://localhost:5002/cliente/Actualizar";

$(document).ready(function () {
    CargarClientesOrdenados();
});

async function CargarClientesOrdenados() {
    try {
        $('#DataCliente').html('<tr><td colspan="6">Cargando...</td></tr>');

        const response = await $.ajax({
            url: UrlTodosClientes,
            type: 'GET',
            dataType: 'JSON'
        });

        var MiItems = response;
        MiItems.sort((a, b) => a.numero_cliente - b.numero_cliente);

        var Valores = '';
        for (i = 0; i < MiItems.length; i++) {
            Valores += '<tr>' +
                '<td>' + MiItems[i].numero_cliente + '</td>' +
                '<td>' + MiItems[i].nombre + '</td>' +
                '<td>' + MiItems[i].apellidos + '</td>' +
                '<td>' + MiItems[i].fecha_de_registro + '</td>' +
                '<td>' + MiItems[i].direccion_cliente + '</td>' +
                '<td>' + MiItems[i].rtn + '</td>' +
                '<td>' + MiItems[i].email + '</td>' +
                '<td>' +
                '<button class="btn btn-info" onclick="CargarDatosParaActualizar(' + MiItems[i].numero_cliente + ')">Editar</button>' +
                '</td>' +
                '<td>' +
                '<button class="btn btn-danger" onclick="EliminarCliente(' + MiItems[i].numero_cliente + ')">Eliminar</button>' +
                '</td>' +
                '</tr>';
        }
        $('#DataCliente').html(Valores);

    } catch (error) {
        console.error("Error al cargar y ordenar los clientes:", error);
        $('#DataCliente').html('<tr><td colspan="6">Error al cargar los datos.</td></tr>');
    }
    limpiarFormulario();
}

function AgregarCliente() {
    var datoscliente = {
        numero_cliente: parseInt($('#numero_cliente').val()),
        nombre: $('#nombre').val(),
        apellidos: $('#apellidos').val(),
        fecha_de_registro: $('#fecha_de_registro').val(),
        direccion_cliente: $('#direccion_cliente').val(),
        rtn: $('#rtn').val(),
        email: $('#email').val()
    };
    var datosclientejson = JSON.stringify(datoscliente);

    $.ajax({
        url: UrlAgregarCliente,
        type: 'POST',
        data: datosclientejson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function(response) {
            console.log(response);
            alert('¡Cliente insertado correctamente!');
            CargarClientesOrdenados();
            limpiarFormulario();
        },
        error: function(xhr, status, error) {
            alert('Error al insertar: ' + status + ' - ' + error);
            console.error(xhr.responseText);
        }
    });
}

function EliminarCliente(numero_cliente) {
    var datoscliente = {
        numero_cliente: numero_cliente
    };
    var datosclientejson = JSON.stringify(datoscliente);

    $.ajax({
        url: UrlEliminarCliente,
        type: 'DELETE',
        data: datosclientejson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            alert("Cliente Eliminado Correctamente");
            CargarClientesOrdenados();
        },
        error: function(xhr, status, error) {
            alert('Error al eliminar: ' + status + ' - ' + error);
            console.error(xhr.responseText);
        }
    });
}

function limpiarFormulario() {
    $("#FormCliente")[0].reset();
    $('#numero_cliente').prop('disabled', false);
  
    // Restaurar el botón principal a "Ingresar"
    $('#btnprincipal').html(`
      <button type="button" class="btn btn-success" onclick="AgregarCliente()">Ingresar Cliente</button>
    `);
  }

  // ✅ Carga los datos al hacer clic en "Editar"
function CargarDatosParaActualizar(numero_cliente) {
    const datoscliente = {
      numero_cliente: numero_cliente
    };
    const datosclientejson = JSON.stringify(datoscliente);
  
    $.ajax({
      url: UrlBuscarCliente,
      type: 'POST',
      data: datosclientejson,
      datatype: 'JSON',
      contentType: 'application/json',
      success: function (respuesta) {
        $('#numero_cliente').val(respuesta.numero_cliente).prop('disabled', true);
        $('#nombre').val(respuesta.nombre);
        $('#apellidos').val(respuesta.apellidos);
        $('#fecha_de_registro').val(respuesta.fecha_de_registro);
        $('#direccion_cliente').val(respuesta.direccion_cliente);
        $('#rtn').val(respuesta.rtn);
        $('#email').val(respuesta.email);
  
        // Cambiar botón principal a "Actualizar"
        $('#btnprincipal').html(`
          <button type="button" class="btn btn-warning" onclick="ActualizarCliente()">Actualizar Cliente</button>
        `);
      },
      error: function (xhr, status, error) {
        console.error("Error al buscar el cliente:", xhr.responseText);
        alert("No se pudo cargar el cliente para editar.");
      }
    });
  }

  // Actualiza el cliente cargado en el formulario
function ActualizarCliente() {
    var datoscliente = {
        numero_cliente: parseInt($('#numero_cliente').val()),
        nombre: $('#nombre').val(),
        apellidos: $('#apellidos').val(),
        fecha_de_registro: $('#fecha_de_registro').val(),
        direccion_cliente: $('#direccion_cliente').val(),
        rtn: parseInt($('#rtn').val()),
        email: $('#email').val()
    };

    for (let key in datoscliente) {
        if (datoscliente[key] === "" || datoscliente[key] === null || datoscliente[key] === undefined) {
            alert(`⚠️ El campo ${key} está vacío o inválido`);
            return;
        }
    }

    var datosclientejson = JSON.stringify(datoscliente);
    console.log("➡️ JSON que se enviará:", datosclientejson);

    $.ajax({
        url: UrlActualizarCliente, 
        type: 'PUT',
        data: datosclientejson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function(response) {
            console.log(response);
            alert('✅ Cliente actualizado correctamente.');
            CargarClientesOrdenados();
            limpiarFormulario();
        },
        error: function(xhr, status, error) {
            alert('❌ Error al actualizar el Cliente: ' + status + ' - ' + error);
            console.error("Respuesta del backend:", xhr.responseText);
        }
    });
}

function BuscarClienteEnLista() {
    const numeroBuscado = parseInt($('#buscar_cliente').val());
  
    if (isNaN(numeroBuscado)) {
      alert('⚠️ Ingresá un número de cliente válido.');
      return;
    }
  
    $.ajax({
      url: UrlTodosClientes,
      type: 'GET',
      dataType: 'JSON',
      success: function (response) {
        const resultado = response.find(p => p.numero_cliente === numeroBuscado);
  
        if (resultado) {
          const fila = `
            <tr>
              <td>${resultado.numero_cliente}</td>
              <td>${resultado.nombre}</td>
              <td>${resultado.apellidos}</td>
              <td>${resultado.fecha_de_registro}</td>
              <td>${resultado.direccion_cliente}</td>
              <td>${resultado.rtn}</td>
              <td>${resultado.email}</td>
              <td><button class="btn btn-info" onclick="CargarDatosParaActualizar(${resultado.numero_cliente})">Editar</button></td>
              <td><button class="btn btn-danger" onclick="EliminarCliente(${resultado.numero_cliente})">Eliminar</button></td>
            </tr>
          `;
          $('#DataCliente').html(fila);
        } else {
          $('#DataCliente').html('<tr><td colspan="8" class="text-center text-danger">🔍 Cliente no encontrado.</td></tr>');
        }
      },
      error: function (xhr, status, error) {
        alert('❌ Error al buscar clientes: ' + status + ' - ' + error);
        console.error(xhr.responseText);
      }
    });
  }