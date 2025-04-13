var UrlTodosPagos = "http://localhost:5002/pago/TodosPagos";
var UrlAgregarPago = "http://localhost:5002/pago/InsertarPago";
var UrlBuscarPago = "http://localhost:5002/pago/UnicoPago";
var UrlEliminarPago = "http://localhost:5002/pago/EliminarPago";
var UrlActualizarPago = "http://localhost:5002/pago/Actualizar";

$(document).ready(function () {
    CargarPagosOrdenados();
});

async function CargarPagosOrdenados() {
  try {
      $('#DataPago').html('<tr><td colspan="6">Cargando...</td></tr>');

      const response = await $.ajax({
          url: UrlTodosPagos,
          type: 'GET',
          dataType: 'JSON'
      });

      var MiItems = response;
      MiItems.sort((a, b) => a.numero_de_pago - b.numero_de_pago);

      var Valores = '';
      for (i = 0; i < MiItems.length; i++) {
          Valores += '<tr>' +
              '<td>' + MiItems[i].numero_de_pago + '</td>' +
              '<td>' + MiItems[i].numero_de_pedido + '</td>' +
              '<td>' + MiItems[i].empresa + '</td>' +
              '<td>' + MiItems[i].fecha_de_pago + '</td>' +
              '<td>' + MiItems[i].tipo_de_pago + '</td>' +
              '<td>' + MiItems[i].monto_de_pago + '</td>' +
              '<td>' +
              '<button class="btn btn-info" onclick="CargarDatosParaActualizar(' + MiItems[i].numero_de_pago + ')">Editar</button>' +
              '</td>' +
              '<td>' +
              '<button class="btn btn-danger" onclick="EliminarPago(' + MiItems[i].numero_de_pago + ')">Eliminar</button>' +
              '</td>' +
              '</tr>';
      }
      $('#DataPago').html(Valores);

  } catch (error) {
      console.error("Error al cargar y ordenar los pagos:", error);
      $('#DataPago').html('<tr><td colspan="6">Error al cargar los datos.</td></tr>');
  }
  limpiarFormulario();
}

function AgregarPago() {
    var datospago = {
        numero_de_pago: parseInt($('#numero_de_pago').val()),
        numero_de_pedido: parseInt($('#numero_de_pedido').val()),
        empresa: $('#empresa').val(),
        fecha_de_pago: $('#fecha_de_pago').val(),
        tipo_de_pago: $('#tipo_de_pago').val(),
        monto_de_pago: parseFloat($('#monto_de_pago').val())
    };
    var datospagojson = JSON.stringify(datospago);

    $.ajax({
        url: UrlAgregarPago,
        type: 'POST',
        data: datospagojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function(response) {
            console.log(response);
            alert('¡Pago insertado correctamente!');
            CargarPagosOrdenados();
            limpiarFormulario();
        },
        error: function(xhr, status, error) {
            alert('Error al insertar: ' + status + ' - ' + error);
            console.error(xhr.responseText);
        }
    });
}

function EliminarPago(numero_de_pago) {
    var datospago = {
        numero_de_pago: numero_de_pago
    };
    var datospagojson = JSON.stringify(datospago);

    $.ajax({
        url: UrlEliminarPago,
        type: 'DELETE',
        data: datospagojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            alert("Pago Eliminado Correctamente");
            CargarPagosOrdenados();
        },
        error: function(xhr, status, error) {
            alert('Error al eliminar: ' + status + ' - ' + error);
            console.error(xhr.responseText);
        }
    });
}

function limpiarFormulario() {
    $("#FormPago")[0].reset();
    $('#numero_de_pago').prop('disabled', false);
  
    // Restaurar el botón principal a "Ingresar"
    $('#btnprincipal').html(`
      <button type="button" class="btn btn-success" onclick="AgregarPago()">Ingresar Pago</button>
    `);
}

// ✅ Carga los datos al hacer clic en "Editar"
function CargarDatosParaActualizar(numero_de_pago) {
    const datospago = {
      numero_de_pago: numero_de_pago
    };
    const datospagojson = JSON.stringify(datospago);
  
    $.ajax({
      url: UrlBuscarPago,
      type: 'POST',
      data: datospagojson,
      datatype: 'JSON',
      contentType: 'application/json',
      success: function (respuesta) {
        $('#numero_de_pago').val(respuesta.numero_de_pago).prop('disabled', true);
        $('#numero_de_pedido').val(respuesta.numero_de_pedido);
        $('#empresa').val(respuesta.empresa);
        $('#fecha_de_pago').val(respuesta.fecha_de_pago);
        $('#tipo_de_pago').val(respuesta.tipo_de_pago);
        $('#monto_de_pago').val(respuesta.monto_de_pago);
  
        // Cambiar botón principal a "Actualizar"
        $('#btnprincipal').html(`
          <button type="button" class="btn btn-warning" onclick="ActualizarPago()">Actualizar Pago</button>
        `);
      },
      error: function (xhr, status, error) {
        console.error("Error al buscar el pago:", xhr.responseText);
        alert("No se pudo cargar el pago para editar.");
      }
    });
}

// Actualiza el pago cargado en el formulario
function ActualizarPago() {
  var datospago = {
      numero_de_pago: parseInt($('#numero_de_pago').val()),
      numero_de_pedido: parseInt($('#numero_de_pedido').val()),
      empresa: $('#empresa').val(),
      fecha_de_pago: $('#fecha_de_pago').val(),
      tipo_de_pago: $('#tipo_de_pago').val(),
      monto_de_pago: parseFloat($('#monto_de_pago').val()) // <-- número, no string
  };

  for (let key in datospago) {
      if (datospago[key] === "" || datospago[key] === null || datospago[key] === undefined) {
          alert(`⚠️ El campo ${key} está vacío o inválido`);
          return;
      }
  }

  var datospagojson = JSON.stringify(datospago);
  console.log("➡️ JSON que se enviará:", datospagojson);

  $.ajax({
      url: "http://localhost:5002/pago/ActualizarPago", 
      type: 'PUT',
      data: datospagojson,
      datatype: 'JSON',
      contentType: 'application/json',
      success: function(response) {
          console.log(response);
          alert('✅ Pago actualizado correctamente.');
          CargarPagosOrdenados();
          limpiarFormulario();
      },
      error: function(xhr, status, error) {
          alert('❌ Error al actualizar el Pago: ' + status + ' - ' + error);
          console.error("Respuesta del backend:", xhr.responseText);
      }
  });
}

/* ----------------Funcion para Buscar un pago en la base usando la API buscar pago especifico---------------*/
function BuscarPagoEnLista() {
  const numeroBuscado = parseInt($('#buscar_pago').val());

  if (isNaN(numeroBuscado)) {
    alert('⚠️ Ingresá un número de pago válido.');
    return;
  }

  $.ajax({
    url: UrlTodosPagos,
    type: 'GET',
    dataType: 'JSON',
    success: function (response) {
      const resultado = response.find(p => p.numero_de_pago === numeroBuscado);

      if (resultado) {
        const fila = `
          <tr>
            <td>${resultado.numero_de_pago}</td>
            <td>${resultado.numero_de_pedido}</td>
            <td>${resultado.empresa}</td>
            <td>${resultado.fecha_de_pago}</td>
            <td>${resultado.tipo_de_pago}</td>
            <td>${resultado.monto_de_pago}</td>
            <td><button class="btn btn-info" onclick="CargarDatosParaActualizar(${resultado.numero_de_pago})">Editar</button></td>
            <td><button class="btn btn-danger" onclick="EliminarPago(${resultado.numero_de_pago})">Eliminar</button></td>
          </tr>
        `;
        $('#DataPago').html(fila);
      } else {
        $('#DataPago').html('<tr><td colspan="8" class="text-center text-danger">🔍 Pago no encontrado.</td></tr>');
      }
    },
    error: function (xhr, status, error) {
      alert('❌ Error al buscar pagos: ' + status + ' - ' + error);
      console.error(xhr.responseText);
    }
  });
}