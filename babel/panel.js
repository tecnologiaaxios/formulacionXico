"use strict";

var config = {
  apiKey: "AIzaSyA19j6-VLNcXLJfBkfd_lZfFFbzg6z0Imc",
  authDomain: "xico-netcontrol.firebaseapp.com",
  databaseURL: "https://xico-netcontrol.firebaseio.com",
  projectId: "xico-netcontrol",
  storageBucket: "xico-netcontrol.appspot.com",
  messagingSenderId: "248615705793"
};
firebase.initializeApp(config);

var db = firebase.database();
var auth = firebase.auth();
var listaSubProductos = [],
    clavesSubProductos = [],
    listaSustitutos = [],
    clavesSustitutos = [],
    listaClavesSubProductos = [];

function logout() {
  auth.signOut();
}

$('#producto').keyup(function () {
  $(this).val($(this).val().toUpperCase());
});

$('#subProductos').change(function () {
  var id = $(this).val();

  var subProductosRef = db.ref("subProductos/" + id);
  subProductosRef.once('value', function (snap) {
    var subProducto = snap.val();

    $('#nombreSubProducto').val(subProducto.nombre);
  });

  if (id == undefined || id == null) {
    $('#subProductos').parent().addClass('has-error');
    $('#helpBlockSubProductos').removeClass('hidden');
  } else {
    $('#subProductos').parent().removeClass('has-error');
    $('#helpBlockSubProductos').addClass('hidden');
  }
});

$('#cantidad').change(function () {
  var valorConstante = $(this).val();

  if (valorConstante.length > 0) {
    $('#cantidad').parent().removeClass('has-error');
    $('#helpBlockCantidad').addClass('hidden');
  } else {
    $('#cantidad').parent().addClass('has-error');
    $('#helpBlockCantidad').removeClass('hidden');
  }
});

$('#tipoFormulacion').change(function () {
  var tipoFormulacion = $(this).val();

  if (tipoFormulacion == undefined || tipoFormulacion == null) {
    $('#tipoFormulacion').parent().addClass('has-error');
    $('#helpBlockTipoFormulacion').removeClass('hidden');
  } else {
    $('#tipoFormulacion').parent().removeClass('has-error');
    $('#helpBlockTipoFormulacion').addClass('hidden');
  }
});

$('#modalAgregarFormula').on('hide.bs.modal', function (e) {
  $('#subProductos').parent().removeClass('has-error');
  $('#helpBlockSubProductos').addClass('hidden');
  $('#cantidad').parent().removeClass('has-error');
  $('#helpBlockCantidad').addClass('hidden');
  $('#tipoFormulacion').parent().removeClass('has-error');
  $('#helpBlockTipoFormulacion').addClass('hidden');
});

/*$('#tabla-subProductos-editar td').on('change', function(evt, newValue) {
	let formulasRef = db.ref('formulaciones');

});*/

function llenarSelectSubProductos() {
  var subProd = db.ref('subProductos');
  subProd.on('value', function (snap) {
    var subProductos = snap.val();
    var options = '<option value="" selected disabled>Seleccionar</option>';
    for (var subProducto in subProductos) {
      options += "<option value=\"" + subProducto + "\">" + subProducto + " - " + subProductos[subProducto].nombre + "</option>";
    }
    $('#subProductos').html(options);
    $('#sustitutos').html(options);
    $('#subProductosEditar').html(options);
    $('#sustitutosEditar').html(options);
  });
}

function llenarSelectCategorias() {
  var cat = db.ref('categoriasPT');
  cat.on('value', function (snap) {
    var categorias = snap.val();
    var options = '<option value="" selected disabled>Seleccionar</option>';
    for (var categoria in categorias) {
      options += "<option value=\"" + categorias[categoria].nombre + "\">" + categorias[categoria].nombre + "</option>";
    }
    $('#categoria').html(options);
  });
}

function llenarSelectTiposFormulaciones() {
  var tF = db.ref('tiposFormulaciones');
  tF.on('value', function (snap) {
    var tipos = snap.val();
    var options = '<option value="" selected disabled>Seleccionar</option>';
    for (var tipo in tipos) {
      options += "<option value=\"" + tipos[tipo].nombre + "\">" + tipos[tipo].nombre + "</option>";
    }
    $('#tipoFormulacion').html(options);
    $('#tipoFormulacionSustituto').html(options);
    $('#tipoFormulacionEditar').html(options);
    $('#tipoFormulacionSustitutoEditar').html(options);
  });
}

function agregarSubProducto() {
  var id = $('#subProductos').val();
  var nombre = $('#nombreSubProducto').val();
  var valorConstante = $('#cantidad').val();
  var tipoFormulacion = $('#tipoFormulacion').val();

  if (id != null && id != undefined && valorConstante.length > 0 && tipoFormulacion != null && tipoFormulacion != undefined) {
    var fila = "<tr id=\"fila-" + id + "\">\n                  <td>" + id + "</td>\n                  <td>" + nombre + "</td>\n                  <td>" + tipoFormulacion + "</td>\n                  <td>" + valorConstante + "</td>\n                  <td class=\"text-center\"><button onclick=\"removerSubProducto('fila-" + id + "', '" + id + "')\" class=\"btn btn-danger btn-sm\"><i class=\"fa fa-times\"></i></button></td>\n                </tr>";

    $('#tabla-subProductos tbody').append(fila);

    var datos = {
      nombre: nombre,
      valorConstante: Number(valorConstante),
      tipoFormulacion: tipoFormulacion
    };

    listaSubProductos.push(datos);
    clavesSubProductos.push(id);
    $('#claveSubProductoSustituir').append("<option value=\"" + id + "\">" + id + " - " + nombre + "</option>");

    $('#cantidad').val('');
    $('#subProductos').val('');
    $('#tipoFormulacion').val('');
  } else {
    if (id == undefined || id == null) {
      $('#subProductos').parent().addClass('has-error');
      $('#helpBlockSubProductos').removeClass('hidden');
    } else {
      $('#subProductos').parent().removeClass('has-error');
      $('#helpBlockSubProductos').addClass('hidden');
    }
    if (valorConstante.length > 0) {
      $('#cantidad').parent().removeClass('has-error');
      $('#helpBlockCantidad').addClass('hidden');
    } else {
      $('#cantidad').parent().addClass('has-error');
      $('#helpBlockCantidad').removeClass('hidden');
    }
    if (tipoFormulacion == undefined || tipoFormulacion == null) {
      $('#tipoFormulacion').parent().addClass('has-error');
      $('#helpBlockTipoFormulacion').removeClass('hidden');
    } else {
      $('#tipoFormulacion').parent().removeClass('has-error');
      $('#helpBlockTipoFormulacion').addClass('hidden');
    }
  }
}

$('#claveSubProductoSustituir').change(function () {
  var id = $(this).val();

  if (id == undefined || id == null) {
    $('#claveSubProductoSustituir').parent().addClass('has-error');
    $('#helpBlockClaveSubProductoSustituir').removeClass('hidden');
  } else {
    $('#claveSubProductoSustituir').parent().removeClass('has-error');
    $('#helpBlockClaveSubProductoSustituir').addClass('hidden');
  }
});

$('#sustitutos').change(function () {
  var id = $(this).val();

  var subProductoRef = db.ref("subProductos/" + id);
  subProductoRef.once('value', function (snap) {
    var subProducto = snap.val();
    $('#nombreSustituto').val(subProducto.nombre);
  });

  if (id == undefined || id == null) {
    $('#sustitutos').parent().addClass('has-error');
    $('#helpBlockSustitutos').removeClass('hidden');
  } else {
    $('#sustitutos').parent().removeClass('has-error');
    $('#helpBlockSustitutos').addClass('hidden');
  }
});

$('#cantidadSustituto').change(function () {
  var valorConstante = $(this).val();

  if (valorConstante.length > 0) {
    $('#cantidadSustituto').parent().removeClass('has-error');
    $('#helpBlockCantidadSustituto').addClass('hidden');
  } else {
    $('#cantidadSustituto').parent().addClass('has-error');
    $('#helpBlockCantidadSustituto').removeClass('hidden');
  }
});

$('#tipoFormulacionSustituto').change(function () {
  var tipoFormulacion = $(this).val();

  if (tipoFormulacion == undefined || tipoFormulacion == null) {
    $('#tipoFormulacionSustituto').parent().addClass('has-error');
    $('#helpBlockTipoFormulacionSustituto').removeClass('hidden');
  } else {
    $('#tipoFormulacionSustituto').parent().removeClass('has-error');
    $('#helpBlockTipoFormulacionSustituto').addClass('hidden');
  }
});

function removerSustituto(idFila, clave) {
  $("#" + idFila).remove();

  var index = clavesSustitutos.indexOf(clave);
  clavesSustitutos.splice(index, 1);
  listaSustitutos.splice(index, 1);
  listaClavesSubProductos.splice(index, 1);
}

function agregarSustituto() {
  var claveSubProducto = $('#claveSubProductoSustituir').val();
  var claveSustituto = $('#sustitutos').val();
  var nombreSustituto = $('#nombreSustituto').val();
  var valorConstanteSustituto = $('#cantidadSustituto').val();
  var tipoFormulacionSustituto = $('#tipoFormulacionSustituto').val();

  if (claveSubProducto != null && claveSubProducto != undefined && claveSustituto != null && claveSustituto != undefined && valorConstanteSustituto.length > 0 && tipoFormulacionSustituto != null && tipoFormulacionSustituto != undefined) {
    var fila = "<tr id=\"sustituto-de-" + claveSubProducto + "\">\n                  <td>" + claveSubProducto + "</td>\n                  <td>" + claveSustituto + "</td>\n                  <td>" + nombreSustituto + "</td>\n                  <td>" + tipoFormulacionSustituto + "</td>\n                  <td>" + valorConstanteSustituto + "</td>\n                  <td class=\"text-center\"><button onclick=\"removerSustituto('sustituto-de-" + claveSubProducto + "')\" class=\"btn btn-danger btn-sm\"><i class=\"fa fa-times\"></i></button></td>\n                </tr>";

    $('#tabla-sustitutos tbody').append(fila);

    var datos = {
      nombre: nombreSustituto,
      valorConstante: Number(valorConstanteSustituto),
      tipoFormulacion: tipoFormulacionSustituto
    };

    listaSustitutos.push(datos);
    clavesSustitutos.push(claveSustituto);
    listaClavesSubProductos.push(claveSubProducto);

    $('#cantidadSustituto').val('');
    $('#sustitutos').val('');
    $('#tipoFormulacionSustituto').val('');
    $('#claveSubProductoSustituir').val('');
  } else {
    if (claveSubProducto == undefined || claveSubProducto == null) {
      $('#claveSubProductoSustituir').parent().addClass('has-error');
      $('#helpBlockClaveSubProductoSustituir').removeClass('hidden');
    } else {
      $('#claveSubProductoSustituir').parent().removeClass('has-error');
      $('#helpBlockClaveSubProductoSustituir').addClass('hidden');
    }
    if (claveSustituto == undefined || claveSustituto == null) {
      $('#sustitutos').parent().addClass('has-error');
      $('#helpBlockSustitutos').removeClass('hidden');
    } else {
      $('#sustitutos').parent().removeClass('has-error');
      $('#helpBlockSustitutos').addClass('hidden');
    }
    if (valorConstanteSustituto.length > 0) {
      $('#cantidadSustituto').parent().removeClass('has-error');
      $('#helpBlockCantidadSustituto').addClass('hidden');
    } else {
      $('#cantidadSustituto').parent().addClass('has-error');
      $('#helpBlockCantidadSustituto').removeClass('hidden');
    }
    if (tipoFormulacionSustituto == undefined || tipoFormulacion == null) {
      $('#tipoFormulacionSustituto').parent().addClass('has-error');
      $('#helpBlockTipoFormulacionSustituto').removeClass('hidden');
    } else {
      $('#tipoFormulacionSustituto').parent().removeClass('has-error');
      $('#helpBlockTipoFormulacionSustituto').addClass('hidden');
    }
  }
}

function removerSubProducto(idFila, id) {
  $("#" + idFila).remove();

  var index = clavesSubProductos.indexOf(id);
  clavesSubProductos.splice(index, 1);
  listaSubProductos.splice(index, 1);

  $("#claveSubProductoSustituir option[value=\"" + id + "\"]").remove();
  $("#sustituto-de-" + id).remove();
}

function guardarSubProducto() {
  var id = $('#idSubProducto').val();
  var nombre = $('#nombreSubProducto').val();

  var subProductosRef = db.ref("subProductos/" + id);
  subProductosRef.once('value', function (snapshot) {
    if (snapshot.hasChildren()) {
      alert("Ya existe un subproducto con ese id");
    } else {
      var datos = {
        nombre: nombre
      };
      subProductosRef.set(datos);
      $('#idSubProducto').val('');
      $('#nombreSubProducto').val('');
    }
  });
}

function guardarFormula() {
  var producto = $('#producto').val().trim();
  var nombre = $('#nombre').val();
  var categoria = $('#categoria').val();

  var formulacionesRef = db.ref("formulaciones/" + producto);
  formulacionesRef.once('value', function (snapshot) {
    if (snapshot.hasChildren()) {
      //Ya esta la formula
      $.toaster({ priority: 'danger', title: 'Mensaje de información', message: 'Este producto ya tiene una fórmula' });
    } else {
      var kilosProduccion = 0;

      for (var i in listaSubProductos) {
        kilosProduccion += listaSubProductos[i].valorConstante;
      }

      var datos = {
        nombre: nombre,
        categoria: categoria,
        kilosProduccion: kilosProduccion
      };
      formulacionesRef.set(datos);

      var connectedRef = firebase.database().ref(".info/connected");

      connectedRef.on("value", function (snap) {
        if (snap.val() === true) {
          for (var _i in listaSubProductos) {
            var ruta = db.ref("formulaciones/" + producto + "/subProductos/" + clavesSubProductos[_i]);
            ruta.set(listaSubProductos[_i]);
          }

          listaSubProductos = [];
          clavesSubProductos = [];

          var seUsaronSustitutos = $('#cbAgregarSustitutos').bootstrapSwitch('state');
          if (seUsaronSustitutos) {
            for (var _i2 in listaSustitutos) {
              var rutaSustitutos = db.ref("formulaciones/" + producto + "/subProductos/" + listaClavesSubProductos[_i2] + "/sustitutos/" + clavesSustitutos[_i2]);
              rutaSustitutos.set(listaSustitutos[_i2]);
            }

            listaSustitutos = [];
            listaClavesSubProductos = [];
            clavesSustitutos = [];
          }
          $.toaster({ priority: 'success', title: 'Mensaje de información', message: 'La fórmula se guardó correctamente' });
          $('#producto').val('');
          $('#nombre').val('');
          $('#categoria').val('');
          $('#producto').attr('readonly', true);
          $('#nombre').attr('readonly', true);
          $('#categoria').attr('readonly', true);
          $('#subProductos').attr('readonly', true);
          $('#cantidad').attr('readonly', true);
          $('#tipoFormulacion').attr('readonly', true);
          $('#añadirSubProducto').attr('disabled', true);
          $('#claveSubProductoSustituir').val('');
          $('#tabla-subProductos tbody').html('');
          $('#tabla-sustitutos tbody').html('');
          $('#cbAgregarSustitutos').bootstrapSwitch('state', false);
        } else {
          for (var _i3 in listaSubProductos) {
            var _ruta = db.ref("formulaciones/" + producto + "/subProductos/" + clavesSubProductos[_i3]);
            _ruta.onDisconnect().set(listaSubProductos[_i3]);
          }

          listaSubProductos = [];
          clavesSubProductos = [];

          var _seUsaronSustitutos = $('#cbAgregarSustitutos').bootstrapSwitch('state');
          if (_seUsaronSustitutos) {
            for (var _i4 in listaSustitutos) {
              var _rutaSustitutos = db.ref("formulaciones/" + producto + "/subProductos/" + listaClavesSubProductos[_i4] + "/sustitutos/" + clavesSustitutos[_i4]);
              _rutaSustitutos.onDisconnect().set(listaSustitutos[_i4]);
            }

            listaSustitutos = [];
            listaClavesSubProductos = [];
            clavesSustitutos = [];
          }
          $.toaster({ priority: 'success', title: 'Mensaje de información', message: 'La fórmula se guardó correctamente' });
          $('#producto').val('');
          $('#nombre').val('');
          $('#categoria').val('');
          $('#producto').attr('readonly', true);
          $('#nombre').attr('readonly', true);
          $('#categoria').attr('readonly', true);
          $('#subProductos').attr('readonly', true);
          $('#cantidad').attr('readonly', true);
          $('#tipoFormulacion').attr('readonly', true);
          $('#añadirSubProducto').attr('disabled', true);
          $('#claveSubProductoSustituir').val('');
          $('#tabla-subProductos tbody').html('');
          $('#tabla-sustitutos tbody').html('');
          $('#cbAgregarSustitutos').bootstrapSwitch('state', false);
        }
      });
    }
  });
}

function mostrarProductos(categoria) {
  var tabla = $("#tabla-" + categoria).DataTable({
    "lengthChange": false,
    "language": {
      "url": "//cdn.datatables.net/plug-ins/a5734b29083/i18n/Spanish.json"
    },
    "pageLength": 5
  });

  var jamonesRef = db.ref('formulaciones');
  jamonesRef.orderByChild('categoria').equalTo(categoria.toUpperCase()).on('value', function (snapshot) {
    var productos = snapshot.val();
    var filas = "";

    tabla.clear();

    for (var producto in productos) {
      filas += "<tr>\n                  <td>" + producto + "</td>\n                  <td>" + productos[producto].nombre + "</td>\n                  <td class=\"text-center\"><button type=\"button\" class=\"btn btn-warning btn-sm\" onclick=\"abrirModalEditar('" + producto + "')\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button></td>\n                  <td class=\"text-center\"><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"abrirModalEliminar('" + producto + "')\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></button></td>\n                </tr>";
    }
    tabla.rows.add($(filas)).columns.adjust().draw();
  });
}

/*function mostrarSubProductos() {
  let tabla = $('#tabla-subProductos').DataTable({
    destroy: true,
    "scrollY": "200px",
    "scrollCollapse": true,
    "searching": false,
    "paging": false
  })

  let subProductosRef = db.ref('subProductos');
  subProductosRef.on('value', function(snapshot) {
    let subProductos = snapshot.val();
    let filas = "";
    tabla.clear();

    for(let subProducto in subProductos) {
      filas += `<tr>
                  <td><input type="checkbox"></td>
                  <td>${subProducto}</td>
                  <td>${subProductos[subProducto].nombre}</td>
                  <td><select class="form-control input-sm tipoFormulacion"></select></td>
                  <td><input class="form-control input-sm" type="number"></td>
                </tr>`;
    }
    tabla.rows.add($(filas)).columns.adjust().draw();
    //$('#tabla-subProductos tbody').html(filas);
  });
}*/

function abrirModalAgregrar() {
  $('#modalAgregarFormula').modal('show');
  //mostrarSubProductos();

  llenarSelectSubProductos();
  llenarSelectCategorias();
  llenarSelectTiposFormulaciones();
}

function mostrarSustitutos(claveProducto) {
  var tabla = $("#tabla-sustitutos-editar").DataTable({
    destroy: true,
    "lengthChange": false,
    "scrollY": "200px",
    "scrollCollapse": true,
    "language": {
      "url": "//cdn.datatables.net/plug-ins/a5734b29083/i18n/Spanish.json"
    },
    "ordering": false
  });

  var formulaRef = db.ref("formulaciones/" + claveProducto);
  formulaRef.on('value', function (snapshot) {
    var formula = snapshot.val();

    var subProductos = formula.subProductos;
    var filas = "";
    tabla.clear();

    for (var subProducto in subProductos) {
      var sustitutos = subProductos[subProducto].sustitutos;
      if (sustitutos != undefined) {
        for (var sustituto in sustitutos) {

          filas += "<tr id=\"tr-" + sustituto + "\">\n                      <td>" + sustituto + "</td>\n                      <td><input id=\"nombre-" + sustituto + "\" readonly class=\"form-control input-sm\" value=\"" + sustitutos[sustituto].nombre + "\"></td>\n                      <td><input id=\"tipoFormulacion-" + sustituto + "\" readonly class=\"form-control input-sm\" value=\"" + sustitutos[sustituto].tipoFormulacion + "\"></td>\n                      <td><input id=\"valorConstante-" + sustituto + "\" readonly class=\"form-control input-sm\" value=\"" + sustitutos[sustituto].valorConstante + "\"></td>\n                      <td class=text-center><button type=\"button\" class=\"btn btn-warning btn-sm\" onclick=\"habilitarEditado('nombre-" + sustituto + "', 'tipoFormulacion-" + sustituto + "', 'valorConstante-" + sustituto + "')\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Editar\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button></td>\n                      <td class=text-center><button type=\"button\" class=\"btn btn-success btn-sm\" onclick=\"guardarEditadoSustituto('" + subProducto + "', '" + sustituto + "', 'nombre-" + sustituto + "', 'tipoFormulacion-" + sustituto + "', 'valorConstante-" + sustituto + "')\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Guardar\"><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i></button></td>\n                      <td class=\"text-center\"><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"eliminarSustituto('" + subProducto + "', '" + sustituto + "')\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Eliminar\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></button></td>\n                    </tr>";
        }
      }
    }

    //$('#tabla-subProductos-editar tbody').html(filas);
    tabla.rows.add($(filas)).columns.adjust().draw();
    $('[data-toggle="tooltip"]').tooltip();
  });
}

function abrirModalEditar(claveProducto) {
  llenarSelectSubProductos();
  llenarSelectCategorias();
  llenarSelectTiposFormulaciones();

  var tabla = $("#tabla-subProductos-editar").DataTable({
    destroy: true,
    "lengthChange": false,
    "scrollY": "200px",
    "scrollCollapse": true,
    "language": {
      "url": "//cdn.datatables.net/plug-ins/a5734b29083/i18n/Spanish.json"
    },
    "ordering": false
  });
  $('#modalEditarFormula').modal('show');
  $("#nombreEditar").attr('readonly', false);
  $("#categoriaEditar").attr('readonly', false);
  var formulaRef = db.ref("formulaciones/" + claveProducto);
  formulaRef.on('value', function (snapshot) {
    var formula = snapshot.val();

    $('#productoEditar').val(claveProducto);
    $('#nombreEditar').val(formula.nombre);
    $('#categoriaEditar').val(formula.categoria);
    $('#btnGuardarCambios').attr('onclick', "guardarCambiosFormula('" + claveProducto + "')");

    var subProductos = formula.subProductos;
    var filas = "";
    tabla.clear();

    for (var subProducto in subProductos) {
      filas += "<tr id=\"tr-" + subProducto + "\">\n                  <td>" + subProducto + "</td>\n                  <td><input id=\"nombre-" + subProducto + "\" readonly class=\"form-control input-sm\" value=\"" + subProductos[subProducto].nombre + "\"></td>\n                  <td><input id=\"tipoFormulacion-" + subProducto + "\" readonly class=\"form-control input-sm\" value=\"" + subProductos[subProducto].tipoFormulacion + "\"></td>\n                  <td><input id=\"valorConstante-" + subProducto + "\" readonly class=\"form-control input-sm\" value=\"" + subProductos[subProducto].valorConstante + "\"></td>\n                  <td class=\"text-center\"><button type=\"button\" class=\"btn btn-warning btn-sm\" onclick=\"habilitarEditado('nombre-" + subProducto + "', 'tipoFormulacion-" + subProducto + "', 'valorConstante-" + subProducto + "')\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Editar\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i></button></td>\n                  <td class=\"text-center\"><button type=\"button\" class=\"btn btn-success btn-sm\" onclick=\"guardarEditado('" + subProducto + "', 'nombre-" + subProducto + "', 'tipoFormulacion-" + subProducto + "', 'valorConstante-" + subProducto + "')\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Guardar\"><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i></button></td>\n                  <td class=\"text-center\"><button type=\"button\" class=\"btn btn-danger btn-sm\" onclick=\"eliminarSubProducto('" + subProducto + "')\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Eliminar\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></button></td>\n                </tr>";

      $('#claveSubProductoSustituirEditar').append("<option value=\"" + subProducto + "\">" + subProducto + " - " + subProductos[subProducto].nombre + "</option>");
    }

    //$('#tabla-subProductos-editar tbody').html(filas);
    tabla.rows.add($(filas)).columns.adjust().draw();
    $('[data-toggle="tooltip"]').tooltip();
  });

  mostrarSustitutos(claveProducto);
}

function eliminarSubProducto(claveSubProducto) {
  var producto = $('#productoEditar').val();
  var formulaRef = db.ref("formulaciones/" + producto + "/subProductos");
  formulaRef.child(claveSubProducto).remove();
}

function eliminarSustituto(claveSubProducto, claveSustituto) {
  var producto = $('#productoEditar').val();
  var formulaRef = db.ref("formulaciones/" + producto + "/subProductos/" + claveSubProducto + "/sustitutos/");
  formulaRef.child(claveSustituto).remove();
}

$('#modalEditarFormula').on('shown.bs.modal', function () {
  $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
  $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

function habilitarEditado(idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante) {
  $("#" + idCampoNombre).attr('readonly', false);
  $("#" + idCampoTipoFormulacion).attr('readonly', false);
  $("#" + idCampoValorConstante).attr('readonly', false);
  //console.log($(`#${idCampoNombre}`).val());
}

function guardarEditadoSustituto(idSubProducto, idSustituto, idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante) {
  var campoNombre = $("#" + idCampoNombre).val();
  var campoTipoFormulacion = $("#" + idCampoTipoFormulacion).val();
  var campoValorConstante = $("#" + idCampoValorConstante).val();
  $('#modalConfirmarGuardarSustituto').modal('show');
  $('#btnGuardarSustituto').attr('onclick', "guardarSustitutoEditado('" + idSubProducto + "', '" + idSustituto + "', '" + campoNombre + "', '" + campoTipoFormulacion + "', '" + campoValorConstante + "', '" + idCampoNombre + "', '" + idCampoTipoFormulacion + "', '" + idCampoValorConstante + "')");
  //console.log(idSubProducto);
}

function guardarEditado(idSubProducto, idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante) {
  var campoNombre = $("#" + idCampoNombre).val();
  var campoTipoFormulacion = $("#" + idCampoTipoFormulacion).val();
  var campoValorConstante = $("#" + idCampoValorConstante).val();
  $('#modalConfirmarGuardar').modal('show');
  $('#btnGuardar').attr('onclick', "guardarSubProductoEditado('" + idSubProducto + "', '" + campoNombre + "', '" + campoTipoFormulacion + "', '" + campoValorConstante + "', '" + idCampoNombre + "', '" + idCampoTipoFormulacion + "', '" + idCampoValorConstante + "')");
  //console.log(idSubProducto);
}

function abrirModalEliminar(claveProducto) {
  $('#modalConfirmarEliminar').modal('show');
  $('#btnEliminar').attr('onclick', "eliminarFormula('" + claveProducto + "')");
}

function guardarSustitutoEditado(idSubProducto, idSustituto, campoNombre, campoTipoFormulacion, campoValorConstante, idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante) {
  var producto = $('#productoEditar').val();
  var rutaFormula = db.ref("formulaciones/" + producto + "/subProductos/" + idSubProducto + "/sustitutos/" + idSustituto);
  //console.log(rutaFormula);
  var datos = {
    nombre: campoNombre,
    tipoFormulacion: campoTipoFormulacion,
    valorConstante: campoValorConstante
  };
  rutaFormula.update(datos);

  $("#" + idCampoNombre).attr('readonly', true);
  $("#" + idCampoTipoFormulacion).attr('readonly', true);
  $("#" + idCampoValorConstante).attr('readonly', true);

  $.toaster({ priority: 'success', title: 'Mensaje de información', message: 'La fórmula se guardó correctamente' });
  $('#modalConfirmarGuardarSustituto').modal('hide');
}

function guardarSubProductoEditado(idSubProducto, campoNombre, campoTipoFormulacion, campoValorConstante, idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante) {
  var producto = $('#productoEditar').val();
  var rutaFormula = db.ref("formulaciones/" + producto + "/subProductos/" + idSubProducto);

  var datos = {
    nombre: campoNombre,
    tipoFormulacion: campoTipoFormulacion,
    valorConstante: campoValorConstante
  };
  rutaFormula.update(datos);

  $("#" + idCampoNombre).attr('readonly', true);
  $("#" + idCampoTipoFormulacion).attr('readonly', true);
  $("#" + idCampoValorConstante).attr('readonly', true);

  $.toaster({ priority: 'success', title: 'Mensaje de información', message: 'La fórmula se guardó correctamente' });
  $('#modalConfirmarGuardar').modal('hide');
}

function guardarCambiosFormula() {
  var claveProducto = $('#productoEditar').val();
  var nombreProducto = $('#nombreEditar').val();
  var categoriaProducto = $('#categoriaEditar').val();

  var connectedRef = firebase.database().ref(".info/connected");
  connectedRef.on("value", function (snap) {
    if (snap.val() === true) {
      console.log("Hay conexion");

      var refEditarProducto = db.ref("formulaciones/" + claveProducto);
      refEditarProducto.update({
        nombre: nombreProducto,
        categoria: categoriaProducto
      });

      $('#modalEditarFormula').modal('hide');
    } else {
      console.log("No hay conexion");
      var _refEditarProducto = db.ref("formulaciones/" + claveProducto);
      _refEditarProducto.onDisconnect().update({
        nombre: nombreProducto,
        categoria: categoriaProducto
      });

      $('#modalEditarFormula').modal('show');
    }
  });
}

/*function abrirModalEditarSubProducto(claveProducto, idSubProducto) {
  $('#modalEditarSubProducto').modal('show');
  llenarSelectTiposFormulacionesModalEditar();

  let ruta = db.ref(`formulaciones/${claveProducto}/subProductos/${idSubProducto}`);
  ruta.on('value', function(snapshot) {
    let datos = snapshot.val();
    $('#nombreSPEditar').val(datos.nombre);
    $('#tipoFormulacionSPEditar').val(datos.tipoFormulacion);
    $('#valorConstanteSPEditar').val(datos.valorConstante);
  })
}*/

function eliminarFormula(claveProducto) {
  var formulasRef = db.ref('formulaciones');
  formulasRef.child(claveProducto).remove();
  $.toaster({ priority: 'success', title: 'Mensaje de información', message: 'La fórmula se eliminó correctamente' });
  $('#modalConfirmarEliminar').modal('hide');
}

function haySesion() {
  auth.onAuthStateChanged(function (user) {
    //si hay un usuario
    if (user) {
      mostrarContador();
      mostrarProductos("jamones");
      mostrarProductos("salchichas");
      mostrarProductos("chorizos");
      mostrarProductos("delicatessen");
      mostrarProductos("otros");
    } else {
      $(location).attr("href", "index.html");
    }
  });
}

haySesion();

function mostrarNotificaciones() {
  var usuario = auth.currentUser.uid;
  var notificacionesRef = db.ref('notificaciones/almacen/' + usuario + '/lista');
  notificacionesRef.on('value', function (snapshot) {
    var lista = snapshot.val();
    var lis = "";

    var arrayNotificaciones = [];
    for (var notificacion in lista) {
      arrayNotificaciones.push(lista[notificacion]);
    }

    arrayNotificaciones.reverse();

    for (var i in arrayNotificaciones) {
      var date = arrayNotificaciones[i].fecha;
      moment.locale('es');
      var fecha = moment(date, "MMMM DD YYYY, HH:mm:ss").fromNow();

      lis += '<li>' + '<a>' + '<div>' + '<i class="fa fa-comment fa-fw"></i> ' + arrayNotificaciones[i].mensaje + '<span class="pull-right text-muted small">' + fecha + '</span>' + '</div>' + '</a>' + '</li>';
    }

    $('#contenedorNotificaciones').empty().append('<li class="dropdown-header">Notificaciones</li><li class="divider"></li>');
    $('#contenedorNotificaciones').append(lis);
  });
}

function mostrarContador() {
  var uid = auth.currentUser.uid;
  var notificacionesRef = db.ref('notificaciones/almacen/' + uid);
  notificacionesRef.on('value', function (snapshot) {
    var cont = snapshot.val().cont;

    if (cont > 0) {
      $('#spanNotificaciones').html(cont).show();
    } else {
      $('#spanNotificaciones').hide();
    }
  });
}

$('#cbAgregarSustitutos').on('switchChange.bootstrapSwitch', function (event, state) {
  if (state) {
    $('#collapseSustitutos').collapse('show');
  } else {
    $('#collapseSustitutos').collapse('hide');

    $('#claveSubProductoSustituir').parent().removeClass('has-error');
    $('#helpBlockClaveSubProductoSustituir').addClass('hidden');
    $('#sustitutos').parent().removeClass('has-error');
    $('#helpBlockSustitutos').addClass('hidden');
    $('#cantidadSustituto').parent().removeClass('has-error');
    $('#helpBlockCantidadSustituto').addClass('hidden');
    $('#tipoFormulacionSustituto').parent().removeClass('has-error');
    $('#helpBlockTipoFormulacionSustituto').addClass('hidden');
  }
});

function verNotificaciones() {
  var uid = auth.currentUser.uid;
  var notificacionesRef = db.ref('notificaciones/almacen/' + uid);
  notificacionesRef.update({ cont: 0 });
}

$('#campana').click(function () {
  verNotificaciones();
});

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();

  $("#cbAgregarSustitutos").bootstrapSwitch();

  $.toaster({
    settings: {
      'timeout': 3000
    }
  });
});

$('#btnAgregarSubProducto').click(function () {
  $('#collapseAgregarSubProducto').collapse('toggle');
});

$('#btnAgregarSustituto').click(function () {
  $('#collapseAgregarSustituto').collapse('toggle');
});

$('#collapseAgregarSubProducto').on('show.bs.collapse', function () {
  $('#collapseAgregarSustituto').collapse('hide');
});

$('#collapseAgregarSustituto').on('show.bs.collapse', function () {
  $('#collapseAgregarSubProducto').collapse('hide');
});

$('#subProductosEditar').change(function () {
  var id = $(this).val();

  var subProductosRef = db.ref("subProductos/" + id);
  subProductosRef.once('value', function (snap) {
    var subProducto = snap.val();

    $('#nombreSubProductoEditar').val(subProducto.nombre);
  });

  if (id == undefined || id == null) {
    $('#subProductosEditar').parent().addClass('has-error');
    $('#helpBlockSubProductosEditar').removeClass('hidden');
  } else {
    $('#subProductosEditar').parent().removeClass('has-error');
    $('#helpBlockSubProductosEditar').addClass('hidden');
  }
});

$('#cantidadEditar').change(function () {
  var valorConstante = $(this).val();

  if (valorConstante.length > 0) {
    $('#cantidadEditar').parent().removeClass('has-error');
    $('#helpBlockCantidadEditar').addClass('hidden');
  } else {
    $('#cantidadEditar').parent().addClass('has-error');
    $('#helpBlockCantidadEditar').removeClass('hidden');
  }
});

$('#tipoFormulacionEditar').change(function () {
  var tipoFormulacion = $(this).val();

  if (tipoFormulacion == undefined || tipoFormulacion == null) {
    $('#tipoFormulacionEditar').parent().addClass('has-error');
    $('#helpBlockTipoFormulacionEditar').removeClass('hidden');
  } else {
    $('#tipoFormulacionEditar').parent().removeClass('has-error');
    $('#helpBlockTipoFormulacionEditar').addClass('hidden');
  }
});

function agregarSubProductoEditar() {
  var claveProducto = $('#productoEditar').val();
  var id = $('#subProductosEditar').val();
  var nombre = $('#nombreSubProductoEditar').val();
  var valorConstante = $('#cantidadEditar').val();
  var tipoFormulacion = $('#tipoFormulacionEditar').val();

  if (id != null && id != undefined && valorConstante.length > 0 && tipoFormulacion != null && tipoFormulacion != undefined) {
    var datos = {
      nombre: nombre,
      valorConstante: Number(valorConstante),
      tipoFormulacion: tipoFormulacion
    };

    var rutaSubProductos = db.ref("formulaciones/" + claveProducto + "/subProductos/");
    rutaSubProductos.once('value', function (snapshot) {
      var subProductos = snapshot.val();
      var bandera = false;
      for (var clave in subProductos) {
        if (id == clave) {
          $.toaster({ priority: 'danger', title: 'Mensaje de información', message: 'Esta fórmula ya contiene este subproducto' });
          $('#subProductosEditar').val('');
          $('#nombreSubProductoEditar').val('');
          $('#cantidadEditar').val('');
          $('#tipoFormulacionEditar').val('');
          break;
        }
      }
      if (bandera == false) {
        var subProductoRef = db.ref("formulaciones/" + claveProducto + "/subProductos/" + id);
        subProductoRef.set(datos);

        $('#subProductosEditar').val('');
        $('#nombreSubProductoEditar').val('');
        $('#cantidadEditar').val('');
        $('#tipoFormulacionEditar').val('');
      }
    });
  } else {
    if (id == undefined || id == null) {
      $('#subProductosEditar').parent().addClass('has-error');
      $('#helpBlockSubProductosEditar').removeClass('hidden');
    } else {
      $('#subProductosEditar').parent().removeClass('has-error');
      $('#helpBlockSubProductosEditar').addClass('hidden');
    }
    if (valorConstante.length > 0) {
      $('#cantidadEditar').parent().removeClass('has-error');
      $('#helpBlockCantidadEditar').addClass('hidden');
    } else {
      $('#cantidadEditar').parent().addClass('has-error');
      $('#helpBlockCantidadEditar').removeClass('hidden');
    }
    if (tipoFormulacion == undefined || tipoFormulacion == null) {
      $('#tipoFormulacionEditar').parent().addClass('has-error');
      $('#helpBlockTipoFormulacionEditar').removeClass('hidden');
    } else {
      $('#tipoFormulacionEditar').parent().removeClass('has-error');
      $('#helpBlockTipoFormulacionEditar').addClass('hidden');
    }
  }
}

function agregarSustitutoEditar() {
  var claveProducto = $('#productoEditar').val();
  var claveSubProducto = $('#claveSubProductoSustituirEditar').val();
  var claveSustituto = $('#sustitutosEditar').val();
  var nombreSustituto = $('#nombreSustitutoEditar').val();
  var valorConstanteSustituto = $('#cantidadSustitutoEditar').val();
  var tipoFormulacionSustituto = $('#tipoFormulacionSustitutoEditar').val();

  console.log(nombreSustituto);

  if (claveSubProducto != null && claveSubProducto != undefined && claveSustituto != null && claveSustituto != undefined && valorConstanteSustituto.length > 0 && tipoFormulacionSustituto != null && tipoFormulacionSustituto != undefined) {
    var datos = {
      nombre: nombreSustituto,
      valorConstante: Number(valorConstanteSustituto),
      tipoFormulacion: tipoFormulacionSustituto
    };

    var rutaSustitutos = db.ref("formulaciones/" + claveProducto + "/subProductos/" + claveSubProducto + "/sustitutos/");
    rutaSustitutos.once('value', function (snapshot) {
      var sustitutos = snapshot.val();
      var bandera = false;
      for (var sustituto in sustitutos) {
        if (claveSustituto == sustituto) {
          bandera = true;
          $.toaster({ priority: 'danger', title: 'Mensaje de información', message: 'Este subProducto ya contiene este sustituto' });
          $('#claveSubProductoSustituirEditar').val('');
          $('#sustitutosEditar').val('');
          $('#nombreSustitutoEditar').val('');
          $('#tipoFormulacionSustitutoEditar').val('');
          $('#cantidadSustitutoEditar').val('');
          break;
        }
      }
      if (bandera == false) {
        var sustitutoRef = db.ref("formulaciones/" + claveProducto + "/subProductos/" + claveSubProducto + "/sustitutos/" + claveSustituto);
        sustitutoRef.set(datos);

        $('#claveSubProductoSustituirEditar').val('');
        $('#sustitutosEditar').val('');
        $('#nombreSustitutoEditar').val('');
        $('#tipoFormulacionSustitutoEditar').val('');
        $('#cantidadSustitutoEditar').val('');
      }
    });
  } else {
    if (claveSubProducto == undefined || claveSubProducto == null) {
      $('#claveSubProductoSustituirEditar').parent().addClass('has-error');
      $('#helpBlockClaveSubProductoSustituirEditar').removeClass('hidden');
    } else {
      $('#claveSubProductoSustituirEditar').parent().removeClass('has-error');
      $('#helpBlockClaveSubProductoSustituirEditar').addClass('hidden');
    }
    if (claveSustituto == undefined || claveSustituto == null) {
      $('#sustitutosEditar').parent().addClass('has-error');
      $('#helpBlockSustitutosEditar').removeClass('hidden');
    } else {
      $('#sustitutosEditar').parent().removeClass('has-error');
      $('#helpBlockSustitutosEditar').addClass('hidden');
    }
    if (valorConstanteSustituto.length > 0) {
      $('#cantidadSustitutoEditar').parent().removeClass('has-error');
      $('#helpBlockCantidadSustitutoEditar').addClass('hidden');
    } else {
      $('#cantidadSustitutoEditar').parent().addClass('has-error');
      $('#helpBlockCantidadSustitutoEditar').removeClass('hidden');
    }
    if (tipoFormulacionSustituto == undefined || tipoFormulacion == null) {
      $('#tipoFormulacionSustitutoEditar').parent().addClass('has-error');
      $('#helpBlockTipoFormulacionSustitutoEditar').removeClass('hidden');
    } else {
      $('#tipoFormulacionSustitutoEditar').parent().removeClass('has-error');
      $('#helpBlockTipoFormulacionSustitutoEditar').addClass('hidden');
    }
  }
}

$('#claveSubProductoSustituirEditar').change(function () {
  var id = $(this).val();

  if (id == undefined || id == null) {
    $('#claveSubProductoSustituirEditar').parent().addClass('has-error');
    $('#helpBlockClaveSubProductoSustituirEditar').removeClass('hidden');
  } else {
    $('#claveSubProductoSustituirEditar').parent().removeClass('has-error');
    $('#helpBlockClaveSubProductoSustituirEditar').addClass('hidden');
  }
});

$('#sustitutosEditar').change(function () {
  var id = $(this).val();

  var subProductoRef = db.ref("subProductos/" + id);
  subProductoRef.once('value', function (snap) {
    var subProducto = snap.val();
    $('#nombreSustitutoEditar').val(subProducto.nombre);
  });

  if (id == undefined || id == null) {
    $('#sustitutosEditar').parent().addClass('has-error');
    $('#helpBlockSustitutosEditar').removeClass('hidden');
  } else {
    $('#sustitutosEditar').parent().removeClass('has-error');
    $('#helpBlockSustitutosEditar').addClass('hidden');
  }
});

$('#cantidadSustitutoEditar').change(function () {
  var valorConstante = $(this).val();

  if (valorConstante.length > 0) {
    $('#cantidadSustitutoEditar').parent().removeClass('has-error');
    $('#helpBlockCantidadSustitutoEditar').addClass('hidden');
  } else {
    $('#cantidadSustitutoEditar').parent().addClass('has-error');
    $('#helpBlockCantidadSustitutoEditar').removeClass('hidden');
  }
});

$('#tipoFormulacionSustitutoEditar').change(function () {
  var tipoFormulacion = $(this).val();

  if (tipoFormulacion == undefined || tipoFormulacion == null) {
    $('#tipoFormulacionSustitutoEditar').parent().addClass('has-error');
    $('#helpBlockTipoFormulacionSustitutoEditar').removeClass('hidden');
  } else {
    $('#tipoFormulacionSustitutoEditar').parent().removeClass('has-error');
    $('#helpBlockTipoFormulacionSustitutoEditar').addClass('hidden');
  }
});