var UrlTodosProductos = "http://localhost:5002/producto/TodosProducto";
var UrlAgregarProducto = "http://localhost:5002/producto/InsertarProducto";
var UrlBuscarProducto = "http://localhost:5002/producto/UnicoProducto";
var UrlEliminarProducto = "http://localhost:5002/producto/EliminarProducto";
var UrlActualizarProducto = "http://localhost:5002/producto/ActualizarProducto";

$(document).ready(function () {
    CargarProductoOrdenados();
});

async function CargarProductoOrdenados() {
    try {
        $('#DataProducto').html('<tr><td colspan="7">Cargando...</td></tr>');

        const response = await $.ajax({
            url: UrlTodosProductos,
            type: 'GET',
            dataType: 'JSON'
        });

        var MiItems = response;
        MiItems.sort((a, b) => a.numero_pedido - b.numero_pedido);

        var Valores = '';
        for (i = 0; i < MiItems.length; i++) {
            Valores += '<tr>' +
            '<td>' + MiItems[i].numero_pedido + '</td>' +
            '<td>' + MiItems[i].nombre_articulo + '</td>' +
            '<td>' + MiItems[i].precio_unitario + '</td>' +
            '<td>' + MiItems[i].fecha_pedido + '</td>' +
            '<td>' + MiItems[i].cantidad_articulo + '</td>' +
            '<td>' + MiItems[i].monto_total + '</td>' +
            '<td>' + MiItems[i].aplica_impuesto + '</td>' +
            '<td>' +
            '<button class="btn btn-info" onclick="CargarDatosParaActualizar(' + MiItems[i].numero_pedido + ')">Editar</button>' +
            '</td>' +
            '<td>' +
            '<button class="btn btn-danger" onclick="EliminarProducto(' + MiItems[i].numero_pedido + ')">Eliminar</button>' +
            '</td>' +
            '</tr>';
        }
        $('#DataProducto').html(Valores); 

    } catch (error) {
        console.error("Error al cargar y ordenar los productos:", error);
        $('#DataProducto').html('<tr><td colspan="7">Error al cargar los datos.</td></tr>');
    }
    limpiarFormulario(); 
}

function AgregarProducto(){
    var datosproducto = {
        numero_pedido: $('#numero_pedido').val(),
        nombre_articulo: $('#nombre_articulo').val(),
        precio_unitario: $('#precio_unitario').val(),
        fecha_pedido: $('#fecha_pedido').val(),
        cantidad_articulo: $('#cantidad_articulo').val(),
        monto_total: $('#monto_total').val(),
        aplica_impuesto: $('#aplica_impuesto').val()
    };
    var datosproductojson  = JSON.stringify(datosproducto);

    $.ajax({
        url: UrlAgregarProducto,
        type: 'POST',
        data: datosproductojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function(response) {
            console.log(response);
            alert('¡Producto insertado correctamente!');
        },
        error: function(textStatus, errorThrown) {
            alert('Error al insertar: ' + textStatus  + errorThrown);
        }
    });
    
    CargarProductoOrdenados();
}

function EliminarProducto(numero_pedido) {
    var datosproducto = {
        numero_pedido: numero_pedido
    };
    var datosproductojson = JSON.stringify(datosproducto);

    $.ajax({
        url: UrlEliminarProducto,
        type: 'DELETE',
        data: datosproductojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function (response) {
            console.log(response);
        }
    });
    alert("Producto Eliminado Correctamente");
    CargarProductoOrdenados();
}

function limpiarFormulario() {
    $("#FormProducto")[0].reset();
    $('#numero_pedido').prop('disabled', false);

    // Restaurar el botón principal a "Ingresar"
    $('#btnprincipal').html(`
        <button type="button" class="btn btn-success" onclick="AgregarProducto()">Ingresar Producto</button>
    `);
}

// ✅ Carga los datos al hacer clic en "Editar"
function CargarDatosParaActualizar(numero_pedido) {
    const datosproducto = {
        numero_pedido: numero_pedido
    };
    const datosproductojson = JSON.stringify(datosproducto);

    $.ajax({
      url: UrlBuscarProducto,
      type: 'POST',
      data: datosproductojson,
      datatype: 'JSON',
      contentType: 'application/json',
      success: function (respuesta) {
        $('#numero_pedido').val(respuesta.numero_pedido).prop('disabled', true);
        $('#nombre_articulo').val(respuesta.nombre_articulo);
        $('#precio_unitario').val(respuesta.precio_unitario);
        $('#fecha_pedido').val(respuesta.fecha_pedido);
        $('#cantidad_articulo').val(respuesta.cantidad_articulo);
        $('#monto_total').val(respuesta.monto_total);
        $('#aplica_impuesto').val(respuesta.aplica_impuesto);        
  
        // Cambiar botón principal a "Actualizar"
        $('#btnprincipal').html(`
          <button type="button" class="btn btn-warning" onclick="ActualizarProducto()">Actualizar Producto</button>
        `);
      },
      error: function (xhr, status, error) {
        console.error("Error al buscar el producto:", xhr.responseText);
        alert("No se pudo cargar el producto para editar.");
      }
    });
}

// Actualiza el producto cargado en el formulario
function ActualizarProducto() {
    var datosproducto = {
        numero_pedido: parseInt($('#numero_pedido').val()),
        nombre_articulo: $('#nombre_articulo').val(),
        precio_unitario: parseFloat($('#precio_unitario').val()), // <-- número, no string
        fecha_pedido: $('#fecha_pedido').val(),
        cantidad_articulo: parseInt($('#cantidad_articulo').val()),
        monto_total: parseFloat($('#monto_total').val()), // <-- número, no string
        aplica_impuesto: $('#aplica_impuesto').val()        
    };

    for (let key in datosproducto) {
        if (datosproducto[key] === "" || datosproducto[key] === null || datosproducto[key] === undefined) {
            alert(`⚠️ El campo ${key} está vacío o inválido`);
            return;
        }
    }

    var datosproductojson = JSON.stringify(datosproducto);
    console.log("➡️ JSON que se enviará:", datosproductojson);

    $.ajax({
        url: "http://localhost:5002/producto/ActualizarProducto", // esta es la URL correcta
        type: 'PUT',
        data: datosproductojson,
        datatype: 'JSON',
        contentType: 'application/json',
        success: function(response) {
            console.log(response);
            alert('✅ Producto actualizado correctamente.');
            CargarProductoOrdenados();
            limpiarFormulario();
        },
        error: function(xhr, status, error) {
            alert('❌ Error al actualizar el Producto: ' + status + ' - ' + error);
            console.error("Respuesta del backend:", xhr.responseText);
        }
    });
}

function BuscarProductoEnLista() {
    const numeroBuscado = parseInt($('#buscar_producto').val());
  
    if (isNaN(numeroBuscado)) {
      alert('⚠️ Ingresá un número de pedido válido.');
      return;
    }
  
    $.ajax({
      url: UrlTodosProductos,
      type: 'GET',
      dataType: 'JSON',
      success: function (response) {
        const resultado = response.find(p => p.numero_pedido === numeroBuscado);
  
        if (resultado) {
          const fila = `
            <tr>
              <td>${resultado.numero_pedido}</td>
              <td>${resultado.nombre_articulo}</td>
              <td>${resultado.precio_unitario}</td>
              <td>${resultado.fecha_pedido}</td>
              <td>${resultado.cantidad_articulo}</td>
              <td>${resultado.monto_total}</td>
              <td>${resultado.aplica_impuesto}</td>
              <td><button class="btn btn-info" onclick="CargarDatosParaActualizar(${resultado.numero_pedido})">Editar</button></td>
              <td><button class="btn btn-danger" onclick="EliminarProducto(${resultado.numero_pedido})">Eliminar</button></td>
            </tr>
          `;
          $('#DataProducto').html(fila);
        } else {
          $('#DataProducto').html('<tr><td colspan="8" class="text-center text-danger">🔍 Producto no encontrado.</td></tr>');
        }
      },
      error: function (xhr, status, error) {
        alert('❌ Error al buscar productos: ' + status + ' - ' + error);
        console.error(xhr.responseText);
      }
    });
}