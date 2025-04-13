var UrlTodosPedidos = "http://localhost:5002/pedido/TodosPedidos";
var UrlAgregarPedido = "http://localhost:5002/pedido/InsertarPedido";
var UrlBuscarPedido = "http://localhost:5002/pedido/UnicoPedido";
var UrlEliminarPedido = "http://localhost:5002/pedido/EliminarPedido";
var UrlActualizarPedido = "http://localhost:5002/pedido/Actualizar";

$(document).ready(function () {
    CargarPedidosOrdenados();
});

// Cargar todos los pedidos ordenados por número
async function CargarPedidosOrdenados() {
    try {
        $('#DataPedido').html('<tr><td colspan="7">Cargando...</td></tr>');

        const response = await $.ajax({
            url: UrlTodosPedidos,
            type: 'GET',
            dataType: 'JSON'
        });

        var MiItems = response;
        MiItems.sort((a, b) => a.numero_pedido - b.numero_pedido);

        var Valores = '';
        for (let i = 0; i < MiItems.length; i++) {
            Valores += '<tr>' +
                '<td>' + MiItems[i].numero_pedido + '</td>' +
                '<td>' + MiItems[i].numero_cliente + '</td>' +
                '<td>' + MiItems[i].empresa + '</td>' +
                '<td>' + MiItems[i].fecha_pedido + '</td>' +
                '<td>' + MiItems[i].direccion + '</td>' +
                '<td>' + MiItems[i].tipo_pago + '</td>' +
                '<td>' + MiItems[i].monto_total + '</td>' +
                '<td><button class="btn btn-info" onclick="CargarDatosParaActualizar(' + MiItems[i].numero_pedido + ')">Editar</button></td>' +
                '<td><button class="btn btn-danger" onclick="EliminarPedido(' + MiItems[i].numero_pedido + ')">Eliminar</button></td>' +
                '</tr>';
        }

        $('#DataPedido').html(Valores);

    } catch (error) {
        console.error("Error al cargar y ordenar los pedidos:", error);
        $('#DataPedido').html('<tr><td colspan="9">Error al cargar los datos.</td></tr>');
    }

    limpiarFormulario();
}

// Insertar nuevo pedido
function AgregarPedido() {
    var datospedido = {
        numero_pedido: parseInt($('#numero_pedido').val()),
        numero_cliente: parseInt($('#numero_cliente').val()),
        empresa: $('#empresa').val(),
        fecha_pedido: $('#fecha_pedido').val(),
        direccion: $('#direccion').val(),
        tipo_pago: $('#tipo_pago').val(),
        monto_total: parseFloat($('#monto_total').val())
    };

    var datospedidojson = JSON.stringify(datospedido);

    $.ajax({
        url: UrlAgregarPedido,
        type: 'POST',
        data: datospedidojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            alert('¡Pedido insertado correctamente!');
            CargarPedidosOrdenados();
            limpiarFormulario();
        },
        error: function (xhr, status, error) {
            alert('Error al insertar: ' + status + ' - ' + error);
            console.error(xhr.responseText);
        }
    });
}

// Eliminar pedido
function EliminarPedido(numero_pedido) {
    var datospedido = { numero_pedido };
    var datospedidojson = JSON.stringify(datospedido);

    $.ajax({
        url: UrlEliminarPedido,
        type: 'DELETE',
        data: datospedidojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            alert("Pedido eliminado correctamente.");
            CargarPedidosOrdenados();
        },
        error: function (xhr, status, error) {
            alert('Error al eliminar: ' + status + ' - ' + error);
            console.error(xhr.responseText);
        }
    });
}

// Cargar datos en el formulario para editar
function CargarDatosParaActualizar(numero_pedido) {
    const datospedido = { numero_pedido };
    const datospedidojson = JSON.stringify(datospedido);

    $.ajax({
        url: UrlBuscarPedido,
        type: 'POST',
        data: datospedidojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (respuesta) {
            $('#numero_pedido').val(respuesta.numero_pedido).prop('disabled', true);
            $('#numero_cliente').val(respuesta.numero_cliente);
            $('#empresa').val(respuesta.empresa);
            $('#fecha_pedido').val(respuesta.fecha_pedido);
            $('#direccion').val(respuesta.direccion);
            $('#tipo_pago').val(respuesta.tipo_pago);
            $('#monto_total').val(respuesta.monto_total);

            $('#btnprincipal').html(`
                <button type="button" class="btn btn-warning" onclick="ActualizarPedido()">Actualizar Pedido</button>
            `);
        },
        error: function (xhr, status, error) {
            console.error("Error al buscar el pedido:", xhr.responseText);
            alert("No se pudo cargar el pedido para editar.");
        }
    });
}

// Actualizar pedido existente
function ActualizarPedido() {
    var datospedido = {
        numero_pedido: parseInt($('#numero_pedido').val()),
        numero_cliente: parseInt($('#numero_cliente').val()),
        empresa: $('#empresa').val(),
        fecha_pedido: $('#fecha_pedido').val(),
        direccion: $('#direccion').val(),
        tipo_pago: $('#tipo_pago').val(),
        monto_total: parseFloat($('#monto_total').val())
    };

    for (let key in datospedido) {
        if (datospedido[key] === "" || datospedido[key] === null || datospedido[key] === undefined) {
            alert(`⚠️ El campo ${key} está vacío o inválido`);
            return;
        }
    }

    var datospedidojson = JSON.stringify(datospedido);
    console.log("➡️ JSON que se enviará:", datospedidojson);

    $.ajax({
        url: UrlActualizarPedido,
        type: 'PUT',
        data: datospedidojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
            alert('✅ Pedido actualizado correctamente.');
            CargarPedidosOrdenados();
            limpiarFormulario();
        },
        error: function (xhr, status, error) {
            alert('❌ Error al actualizar el pedido: ' + status + ' - ' + error);
            console.error(xhr.responseText);
        }
    });
}

// Buscar un pedido específico en la lista
function BuscarPedidoEnLista() {
    const numeroBuscado = parseInt($('#buscar_pedido').val());

    if (isNaN(numeroBuscado)) {
        alert('⚠️ Ingresá un número de pedido válido.');
        return;
    }

    $.ajax({
        url: UrlTodosPedidos,
        type: 'GET',
        dataType: 'JSON',
        success: function (response) {
            const resultado = response.find(p => p.numero_pedido === numeroBuscado);

            if (resultado) {
                const fila = `
                    <tr>
                        <td>${resultado.numero_pedido}</td>
                        <td>${resultado.numero_cliente}</td>
                        <td>${resultado.empresa}</td>
                        <td>${resultado.fecha_pedido}</td>
                        <td>${resultado.direccion}</td>
                        <td>${resultado.tipo_pago}</td>
                        <td>${resultado.monto_total}</td>
                        <td><button class="btn btn-info" onclick="CargarDatosParaActualizar(${resultado.numero_pedido})">Editar</button></td>
                        <td><button class="btn btn-danger" onclick="EliminarPedido(${resultado.numero_pedido})">Eliminar</button></td>
                    </tr>
                `;
                $('#DataPedido').html(fila);
            } else {
                $('#DataPedido').html('<tr><td colspan="9" class="text-center text-danger">🔍 Pedido no encontrado.</td></tr>');
            }
        },
        error: function (xhr, status, error) {
            alert('❌ Error al buscar pedidos: ' + status + ' - ' + error);
            console.error(xhr.responseText);
        }
    });
}

// Limpiar formulario
function limpiarFormulario() {
    $("#FormPedido")[0].reset();
    $('#numero_pedido').prop('disabled', false);

    $('#btnprincipal').html(`
      <button type="button" class="btn btn-success" onclick="AgregarPedido()">Ingresar Pedido</button>
    `);
}
