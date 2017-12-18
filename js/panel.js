var config = {
  apiKey: "AIzaSyA19j6-VLNcXLJfBkfd_lZfFFbzg6z0Imc",
  authDomain: "xico-netcontrol.firebaseapp.com",
  databaseURL: "https://xico-netcontrol.firebaseio.com",
  projectId: "xico-netcontrol",
  storageBucket: "xico-netcontrol.appspot.com",
  messagingSenderId: "248615705793"
};
firebase.initializeApp(config);

const db = firebase.database();
const auth = firebase.auth();
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
  let id = $(this).val();

  let subProductosRef = db.ref(`subProductos/${id}`);
  subProductosRef.once('value', function(snap) {
    let subProducto = snap.val();

    $('#nombreSubProducto').val(subProducto.nombre);
  });

  if(id == undefined || id == null) {
    $('#subProductos').parent().addClass('has-error');
    $('#helpBlockSubProductos').removeClass('hidden');
  }
  else {
    $('#subProductos').parent().removeClass('has-error');
    $('#helpBlockSubProductos').addClass('hidden');
  }
});

$('#cantidad').change(function() {
  let valorConstante = $(this).val();

  if(valorConstante.length > 0) {
    $('#cantidad').parent().removeClass('has-error');
    $('#helpBlockCantidad').addClass('hidden');
  }
  else {
    $('#cantidad').parent().addClass('has-error');
    $('#helpBlockCantidad').removeClass('hidden');
  }
});

$('#tipoFormulacion').change(function() {
  let tipoFormulacion = $(this).val();

  if(tipoFormulacion == undefined || tipoFormulacion == null) {
    $('#tipoFormulacion').parent().addClass('has-error');
    $('#helpBlockTipoFormulacion').removeClass('hidden');
  }
  else {
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

$('#tabla-subProductos-editar td').on('change', function(evt, newValue) {
	let formulasRef = db.ref('formulaciones');

});

function llenarSelectSubProductos() {
  let subProd = db.ref('subProductos');
  subProd.on('value', function(snap) {
    let subProductos = snap.val();
    let options = '<option value="" selected disabled>Seleccionar</option>';
    for(let subProducto in subProductos) {
      options += `<option value="${subProducto}">${subProducto} - ${subProductos[subProducto].nombre}</option>`;
    }
    $('#subProductos').html(options);
    $('#sustitutos').html(options)
  });
}

function llenarSelectCategorias() {
  let cat = db.ref('categoriasPT');
  cat.on('value', function(snap) {
    let categorias = snap.val();
    let options = '<option value="" selected disabled>Seleccionar</option>';
    for (let categoria in categorias) {
      options += `<option value="${categorias[categoria].nombre}">${categorias[categoria].nombre}</option>`;
    }
    $('#categoria').html(options);
  })
}

function llenarSelectTiposFormulaciones() {
  let tF = db.ref('tiposFormulaciones');
  tF.on('value', function(snap) {
    let tipos = snap.val();
      let options = '<option value="" selected disabled>Seleccionar</option>';
      for(let tipo in tipos) {
        options += `<option value="${tipos[tipo].nombre}">${tipos[tipo].nombre}</option>`;
      }
      $('#tipoFormulacion').html(options);
      $('#tipoFormulacionSustituto').html(options);
  });
}

function llenarSelectTiposFormulacionesModalEditar() {
  let tF = db.ref('tiposFormulaciones');
  tF.on('value', function(snap) {
    let tipos = snap.val();
      let options = "";
      for(let tipo in tipos) {
        options += `<option value="${tipos[tipo].nombre}">${tipos[tipo].nombre}</option>`;
      }
      $('#tipoFormulacionSPEditar').html(options);
  });
}

function agregarSubProducto() {
  let id = $('#subProductos').val();
  let nombre = $('#nombreSubProducto').val();
  let valorConstante = $('#cantidad').val();
  let tipoFormulacion = $('#tipoFormulacion').val();

  if(id != null && id != undefined &&  valorConstante.length > 0 && tipoFormulacion != null && tipoFormulacion != undefined) {
    let fila = `<tr id="fila-${id}">
                  <td>${id}</td>
                  <td>${nombre}</td>
                  <td>${tipoFormulacion}</td>
                  <td>${valorConstante}</td>
                  <td class="text-center"><button onclick="removerSubProducto('fila-${id}', '${id}')" class="btn btn-danger btn-sm"><i class="fa fa-times"></i></button></td>
                </tr>`;

    $('#tabla-subProductos tbody').append(fila);

    let datos = {
      nombre: nombre,
      valorConstante: Number(valorConstante),
      tipoFormulacion: tipoFormulacion
    }

    listaSubProductos.push(datos);
    clavesSubProductos.push(id);
    $('#claveSubProductoSustituir').append(`<option value="${id}">${id} - ${nombre}</option>`)

    $('#cantidad').val('');
    $('#subProductos').val('');
    $('#tipoFormulacion').val('');
  }
  else {
    if(id == undefined || id == null) {
      $('#subProductos').parent().addClass('has-error');
      $('#helpBlockSubProductos').removeClass('hidden');
    }
    else {
      $('#subProductos').parent().removeClass('has-error');
      $('#helpBlockSubProductos').addClass('hidden');
    }
    if(valorConstante.length > 0) {
      $('#cantidad').parent().removeClass('has-error');
      $('#helpBlockCantidad').addClass('hidden');
    }
    else {
      $('#cantidad').parent().addClass('has-error');
      $('#helpBlockCantidad').removeClass('hidden');
    }
    if(tipoFormulacion == undefined || tipoFormulacion == null) {
      $('#tipoFormulacion').parent().addClass('has-error');
      $('#helpBlockTipoFormulacion').removeClass('hidden');
    }
    else {
      $('#tipoFormulacion').parent().removeClass('has-error');
      $('#helpBlockTipoFormulacion').addClass('hidden');
    }
  }
}

$('#claveSubProductoSustituir').change(function () {
  let id = $(this).val();

  if(id == undefined || id == null) {
    $('#claveSubProductoSustituir').parent().addClass('has-error');
    $('#helpBlockClaveSubProductoSustituir').removeClass('hidden');
  }
  else {
    $('#claveSubProductoSustituir').parent().removeClass('has-error');
    $('#helpBlockClaveSubProductoSustituir').addClass('hidden');
  }
});

$('#sustitutos').change(function () {
  let id = $(this).val();

  let subProductoRef = db.ref(`subProductos/${id}`);
  subProductoRef.once('value', function(snap) {
    let subProducto = snap.val();
    $('#nombreSustituto').val(subProducto.nombre);
  });

  if(id == undefined || id == null) {
    $('#sustitutos').parent().addClass('has-error');
    $('#helpBlockSustitutos').removeClass('hidden');
  }
  else {
    $('#sustitutos').parent().removeClass('has-error');
    $('#helpBlockSustitutos').addClass('hidden');
  }
});

$('#cantidadSustituto').change(function() {
  let valorConstante = $(this).val();

  if(valorConstante.length > 0) {
    $('#cantidadSustituto').parent().removeClass('has-error');
    $('#helpBlockCantidadSustituto').addClass('hidden');
  }
  else {
    $('#cantidadSustituto').parent().addClass('has-error');
    $('#helpBlockCantidadSustituto').removeClass('hidden');
  }
});

$('#tipoFormulacionSustituto').change(function() {
  let tipoFormulacion = $(this).val();

  if(tipoFormulacion == undefined || tipoFormulacion == null) {
    $('#tipoFormulacionSustituto').parent().addClass('has-error');
    $('#helpBlockTipoFormulacionSustituto').removeClass('hidden');
  }
  else {
    $('#tipoFormulacionSustituto').parent().removeClass('has-error');
    $('#helpBlockTipoFormulacionSustituto').addClass('hidden');
  }
});

function removerSustituto(idFila, clave) {
  $(`#${idFila}`).remove();

  let index = clavesSustitutos.indexOf(clave);
  clavesSustitutos.splice(index, 1);
  listaSustitutos.splice(index, 1);
  listaClavesSubProductos.splice(index, 1);
}

function agregarSustituto() {
  let claveSubProducto = $('#claveSubProductoSustituir').val();
  let claveSustituto = $('#sustitutos').val();
  let nombreSustituto = $('#nombreSustituto').val();
  let valorConstanteSustituto = $('#cantidadSustituto').val();
  let tipoFormulacionSustituto = $('#tipoFormulacionSustituto').val();

  if(claveSubProducto != null && claveSubProducto != undefined && claveSustituto != null && claveSustituto != undefined &&  valorConstanteSustituto.length > 0 && tipoFormulacionSustituto != null && tipoFormulacionSustituto != undefined) {
    let fila = `<tr id="sustituto-de-${claveSubProducto}">
                  <td>${claveSubProducto}</td>
                  <td>${claveSustituto}</td>
                  <td>${nombreSustituto}</td>
                  <td>${tipoFormulacionSustituto}</td>
                  <td>${valorConstanteSustituto}</td>
                  <td class="text-center"><button onclick="removerSustituto('sustituto-de-${claveSubProducto}')" class="btn btn-danger btn-sm"><i class="fa fa-times"></i></button></td>
                </tr>`;

    $('#tabla-sustitutos tbody').append(fila);

    let datos = {
      nombre: nombreSustituto,
      valorConstante: Number(valorConstanteSustituto),
      tipoFormulacion: tipoFormulacionSustituto
    }

    listaSustitutos.push(datos);
    clavesSustitutos.push(claveSustituto);
    listaClavesSubProductos.push(claveSubProducto);

    $('#cantidadSustituto').val('');
    $('#sustitutos').val('');
    $('#tipoFormulacionSustituto').val('');
    $('#claveSubProductoSustituir').val('');
  }
  else {
    if(claveSubProducto == undefined || claveSubProducto == null) {
      $('#claveSubProductoSustituir').parent().addClass('has-error');
      $('#helpBlockClaveSubProductoSustituir').removeClass('hidden');
    }
    else {
      $('#claveSubProductoSustituir').parent().removeClass('has-error');
      $('#helpBlockClaveSubProductoSustituir').addClass('hidden');
    }
    if(claveSustituto == undefined || claveSustituto == null) {
      $('#sustitutos').parent().addClass('has-error');
      $('#helpBlockSustitutos').removeClass('hidden');
    }
    else {
      $('#sustitutos').parent().removeClass('has-error');
      $('#helpBlockSustitutos').addClass('hidden');
    }
    if(valorConstanteSustituto.length > 0) {
      $('#cantidadSustituto').parent().removeClass('has-error');
      $('#helpBlockCantidadSustituto').addClass('hidden');
    }
    else {
      $('#cantidadSustituto').parent().addClass('has-error');
      $('#helpBlockCantidadSustituto').removeClass('hidden');
    }
    if(tipoFormulacionSustituto == undefined || tipoFormulacion == null) {
      $('#tipoFormulacionSustituto').parent().addClass('has-error');
      $('#helpBlockTipoFormulacionSustituto').removeClass('hidden');
    }
    else {
      $('#tipoFormulacionSustituto').parent().removeClass('has-error');
      $('#helpBlockTipoFormulacionSustituto').addClass('hidden');
    }
  }
}

function removerSubProducto(idFila, id) {
  $(`#${idFila}`).remove();

  let index = clavesSubProductos.indexOf(id);
  clavesSubProductos.splice(index, 1);
  listaSubProductos.splice(index, 1);

  $(`#claveSubProductoSustituir option[value="${id}"]`).remove();
  $(`#sustituto-de-${id}`).remove();
}

function guardarSubProducto() {
  let id = $('#idSubProducto').val();
  let nombre = $('#nombreSubProducto').val();

  let subProductosRef = db.ref(`subProductos/${id}`);
  subProductosRef.once('value', function(snapshot) {
    if(snapshot.hasChildren()) {
      alert("Ya existe un subproducto con ese id");
    }
    else {
      let datos = {
        nombre: nombre
      }
      subProductosRef.set(datos);
      $('#idSubProducto').val('');
      $('#nombreSubProducto').val('');
    }
  });
}

function guardarFormula() {
  let producto = $('#producto').val();
  let nombre = $('#nombre').val();
  let categoria = $('#categoria').val();

  let formulacionesRef = db.ref(`formulaciones/${producto}`);
  formulacionesRef.once('value', function(snapshot) {
    if(snapshot.hasChildren()) {
      //Ya esta la formula
      $.toaster({ priority : 'danger', title : 'Mensaje de información', message : 'Este producto ya tiene una fórmula'});
    }
    else {
      let datos = {
        nombre: nombre,
        categoria: categoria
      }
      formulacionesRef.set(datos);

      let connectedRef = firebase.database().ref(".info/connected");

      connectedRef.on("value", function(snap) {
        if (snap.val() === true) {
          for(let i in listaSubProductos) {
            let ruta = db.ref(`formulaciones/${producto}/subProductos/${clavesSubProductos[i]}`);
            ruta.set(listaSubProductos[i]);
          }

          listaSubProductos = [];
          clavesSubProductos = [];

          let seUsaronSustitutos = $('#cbAgregarSustitutos').bootstrapSwitch('state');
          if(seUsaronSustitutos) {
            for(let i in listaSustitutos) {
              let rutaSustitutos = db.ref(`formulaciones/${producto}/subProductos/${listaClavesSubProductos[i]}/sustitutos/${clavesSustitutos[i]}`);
              rutaSustitutos.set(listaSustitutos[i]);
            }

            listaSustitutos = [];
            listaClavesSubProductos = [];
            clavesSustitutos = [];
          }
          $.toaster({ priority : 'success', title : 'Mensaje de información', message : 'La fórmula se guardó correctamente'});
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
        else {
          for(let i in listaSubProductos) {
            let ruta = db.ref(`formulaciones/${producto}/subProductos/${clavesSubProductos[i]}`);
            ruta.onDisconnect().set(listaSubProductos[i]);
          }

          listaSubProductos = [];
          clavesSubProductos = [];

          let seUsaronSustitutos = $('#cbAgregarSustitutos').bootstrapSwitch('state');
          if(seUsaronSustitutos) {
            for(let i in listaSustitutos) {
              let rutaSustitutos = db.ref(`formulaciones/${producto}/subProductos/${listaClavesSubProductos[i]}/sustitutos/${clavesSustitutos[i]}`);
              rutaSustitutos.onDisconnect().set(listaSustitutos[i]);
            }

            listaSustitutos = [];
            listaClavesSubProductos = [];
            clavesSustitutos = [];
          }
          $.toaster({ priority : 'success', title : 'Mensaje de información', message : 'La fórmula se guardó correctamente'});
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
  let tabla = $(`#tabla-${categoria}`).DataTable({
    "lengthChange": false,
    "language": {
      "url": "//cdn.datatables.net/plug-ins/a5734b29083/i18n/Spanish.json"
    },
    "pageLength": 5
  });

  let jamonesRef = db.ref('formulaciones');
  jamonesRef.orderByChild('categoria').equalTo(categoria.toUpperCase()).on('value', function(snapshot) {
    let productos = snapshot.val();
    let filas = "";

    tabla.clear();

    for(let producto in productos) {
      filas += `<tr>
                  <td>${producto}</td>
                  <td>${productos[producto].nombre}</td>
                  <td class="text-center"><button type="button" class="btn btn-warning btn-sm" onclick="abrirModalEditar('${producto}')"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>
                  <td class="text-center"><button type="button" class="btn btn-danger btn-sm" onclick="abrirModalEliminar('${producto}')"><i class="fa fa-times" aria-hidden="true"></i></button></td>
                </tr>`;
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
  let tabla = $(`#tabla-sustitutos-editar`).DataTable({
    destroy: true,
    "lengthChange": false,
    "scrollY": "200px",
    "scrollCollapse": true,
    "language": {
      "url": "//cdn.datatables.net/plug-ins/a5734b29083/i18n/Spanish.json"
    },
    "ordering": false
  });

  let formulaRef = db.ref(`formulaciones/${claveProducto}`);
  formulaRef.on('value', function(snapshot) {
    let formula = snapshot.val();

    let subProductos = formula.subProductos;
    let filas = "";
    tabla.clear();

    for(let subProducto in subProductos) {
      let sustitutos = subProductos[subProducto].sustitutos;
      if(sustitutos != undefined) {
        for(let sustituto in sustitutos) {

          filas += `<tr id="tr-${sustituto}">
                      <td>${sustituto}</td>
                      <td><input id="nombre-${sustituto}" readonly class="form-control input-sm" value="${sustitutos[sustituto].nombre}"></td>
                      <td><input id="tipoFormulacion-${sustituto}" readonly class="form-control input-sm" value="${sustitutos[sustituto].tipoFormulacion}"></td>
                      <td><input id="valorConstante-${sustituto}" readonly class="form-control input-sm" value="${sustitutos[sustituto].valorConstante}"></td>
                      <td class=text-center><button class="btn btn-warning btn-sm" onclick="habilitarEditado('nombre-${sustituto}', 'tipoFormulacion-${sustituto}', 'valorConstante-${sustituto}')"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>
                      <td class=text-center><button class="btn btn-success btn-sm" onclick="guardarEditadoSustituto('${subProducto}', '${sustituto}', 'nombre-${sustituto}', 'tipoFormulacion-${sustituto}', 'valorConstante-${sustituto}')"><i class="fa fa-floppy-o" aria-hidden="true"></i></button></td>
                    </tr>`;
        }
      }
    }

    //$('#tabla-subProductos-editar tbody').html(filas);
    tabla.rows.add($(filas)).columns.adjust().draw();
  });
}

function abrirModalEditar(claveProducto) {
  let tabla = $(`#tabla-subProductos-editar`).DataTable({
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
  $(`#nombreEditar`).attr('readonly', false);
  $(`#categoriaEditar`).attr('readonly', false);
  let formulaRef = db.ref(`formulaciones/${claveProducto}`);
  formulaRef.on('value', function(snapshot) {
    let formula = snapshot.val();

    $('#productoEditar').val(claveProducto);
    $('#nombreEditar').val(formula.nombre);
    $('#categoriaEditar').val(formula.categoria);
    $('#btnGuardarCambios').attr('onclick', `guardarCambiosFormula('${claveProducto}')`);

    let subProductos = formula.subProductos;
    let filas = "";
    tabla.clear();

    for(let subProducto in subProductos) {
      filas += `<tr id="tr-${subProducto}">
                  <td>${subProducto}</td>
                  <td><input id="nombre-${subProducto}" readonly class="form-control input-sm" value="${subProductos[subProducto].nombre}"></td>
                  <td><input id="tipoFormulacion-${subProducto}" readonly class="form-control input-sm" value="${subProductos[subProducto].tipoFormulacion}"></td>
                  <td><input id="valorConstante-${subProducto}" readonly class="form-control input-sm" value="${subProductos[subProducto].valorConstante}"></td>
                  <td class=text-center><button class="btn btn-warning btn-sm" onclick="habilitarEditado('nombre-${subProducto}', 'tipoFormulacion-${subProducto}', 'valorConstante-${subProducto}')"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>
                  <td class=text-center><button class="btn btn-success btn-sm" onclick="guardarEditado('${subProducto}', 'nombre-${subProducto}', 'tipoFormulacion-${subProducto}', 'valorConstante-${subProducto}')"><i class="fa fa-floppy-o" aria-hidden="true"></i></button></td>
                </tr>`;
    }

    //$('#tabla-subProductos-editar tbody').html(filas);
    tabla.rows.add($(filas)).columns.adjust().draw();
  });

  mostrarSustitutos(claveProducto);
}

$('#modalEditarFormula').on('shown.bs.modal', function() {
  $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
  $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
})

function habilitarEditado(idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante) {
  $(`#${idCampoNombre}`).attr('readonly', false);
  $(`#${idCampoTipoFormulacion}`).attr('readonly', false);
  $(`#${idCampoValorConstante}`).attr('readonly', false);
  //console.log($(`#${idCampoNombre}`).val());
}

function guardarEditadoSustituto(idSubProducto, idSustituto, idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante){
  let campoNombre = $(`#${idCampoNombre}`).val()
  let campoTipoFormulacion = $(`#${idCampoTipoFormulacion}`).val()
  let campoValorConstante = $(`#${idCampoValorConstante}`).val()
  $('#modalConfirmarGuardarSustituto').modal('show');
  $('#btnGuardarSustituto').attr('onclick', `guardarSustitutoEditado('${idSubProducto}', '${idSustituto}', '${campoNombre}', '${campoTipoFormulacion}', '${campoValorConstante}', '${idCampoNombre}', '${idCampoTipoFormulacion}', '${idCampoValorConstante}')`);
  //console.log(idSubProducto);
}

function guardarEditado(idSubProducto, idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante){
  let campoNombre = $(`#${idCampoNombre}`).val()
  let campoTipoFormulacion = $(`#${idCampoTipoFormulacion}`).val()
  let campoValorConstante = $(`#${idCampoValorConstante}`).val()
  $('#modalConfirmarGuardar').modal('show');
  $('#btnGuardar').attr('onclick', `guardarSubProductoEditado('${idSubProducto}', '${campoNombre}', '${campoTipoFormulacion}', '${campoValorConstante}', '${idCampoNombre}', '${idCampoTipoFormulacion}', '${idCampoValorConstante}')`);
  //console.log(idSubProducto);
}

function abrirModalEliminar(claveProducto) {
  $('#modalConfirmarEliminar').modal('show');
  $('#btnEliminar').attr('onclick', `eliminarFormula('${claveProducto}')`);
}

function guardarSustitutoEditado(idSubProducto, idSustituto, campoNombre, campoTipoFormulacion, campoValorConstante, idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante) {
  let producto = $('#productoEditar').val();
  let rutaFormula = db.ref(`formulaciones/${producto}/subProductos/${idSubProducto}/sustitutos/${idSustituto}`);
  //console.log(rutaFormula);
  let datos = {
    nombre: campoNombre,
    tipoFormulacion: campoTipoFormulacion,
    valorConstante: campoValorConstante
  }
  rutaFormula.update(datos);

  $(`#${idCampoNombre}`).attr('readonly', true);
  $(`#${idCampoTipoFormulacion}`).attr('readonly', true);
  $(`#${idCampoValorConstante}`).attr('readonly', true);

  $.toaster({ priority : 'success', title : 'Mensaje de información', message : 'La fórmula se guardó correctamente'});
  $('#modalConfirmarGuardarSustituto').modal('hide');
}

function guardarSubProductoEditado(idSubProducto, campoNombre, campoTipoFormulacion, campoValorConstante, idCampoNombre, idCampoTipoFormulacion, idCampoValorConstante) {
  let producto = $('#productoEditar').val();
  let rutaFormula = db.ref(`formulaciones/${producto}/subProductos/${idSubProducto}`);

  let datos = {
    nombre: campoNombre,
    tipoFormulacion: campoTipoFormulacion,
    valorConstante: campoValorConstante
  }
  rutaFormula.update(datos);

  $(`#${idCampoNombre}`).attr('readonly', true);
  $(`#${idCampoTipoFormulacion}`).attr('readonly', true);
  $(`#${idCampoValorConstante}`).attr('readonly', true);

  $.toaster({ priority : 'success', title : 'Mensaje de información', message : 'La fórmula se guardó correctamente'});
  $('#modalConfirmarGuardar').modal('hide');
}

function guardarCambiosFormula() {
  let claveProducto = $('#productoEditar').val();
  let nombreProducto = $('#nombreEditar').val();
  let categoriaProducto = $('#categoriaEditar').val();

  let connectedRef = firebase.database().ref(".info/connected");
  connectedRef.on("value", function(snap) {
    if (snap.val() === true) {
      console.log("Hay conexion")
      let refEditarProducto = db.ref(`formulaciones/${claveProducto}`)
      refEditarProducto.update({
        nombre: nombreProducto,
        categoria: categoriaProducto
      });

      $('#modalEditarFormula').modal('show');
    }
    else {
      console.log("No hay conexion");
      let refEditarProducto = db.ref(`formulaciones/${claveProducto}`)
      refEditarProducto.onDisconnect().update({
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
  let formulasRef = db.ref('formulaciones');
  formulasRef.child(claveProducto).remove();
  $.toaster({priority: 'success', title: 'Mensaje de información', message: 'La fórmula se eliminó correctamente'});
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
    }
    else {
      $(location).attr("href", "index.html");
    }
  });
}

haySesion();

function mostrarNotificaciones() {
  let usuario = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/almacen/'+usuario+'/lista');
  notificacionesRef.on('value', function(snapshot) {
    let lista = snapshot.val();
    let lis = "";

    let arrayNotificaciones = [];
    for(let notificacion in lista) {
      arrayNotificaciones.push(lista[notificacion]);
    }

    arrayNotificaciones.reverse();

    for(let i in arrayNotificaciones) {
      let date = arrayNotificaciones[i].fecha;
      moment.locale('es');
      let fecha = moment(date, "MMMM DD YYYY, HH:mm:ss").fromNow();

      lis += '<li>' +
               '<a>' +
                '<div>' +
                  '<i class="fa fa-comment fa-fw"></i> ' + arrayNotificaciones[i].mensaje +
                    '<span class="pull-right text-muted small">'+fecha+'</span>' +
                '</div>' +
               '</a>' +
             '</li>';
    }

    $('#contenedorNotificaciones').empty().append('<li class="dropdown-header">Notificaciones</li><li class="divider"></li>');
    $('#contenedorNotificaciones').append(lis);
  });
}

function mostrarContador() {
  let uid = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/almacen/'+uid);
  notificacionesRef.on('value', function(snapshot) {
    let cont = snapshot.val().cont;

    if(cont > 0) {
      $('#spanNotificaciones').html(cont).show();
    }
    else {
      $('#spanNotificaciones').hide();
    }
  });
}

$('#cbAgregarSustitutos').on('switchChange.bootstrapSwitch', function(event, state) {
  if(state) {
    $('#collapseSustitutos').collapse('show');

  }else {
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
  let uid = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/almacen/'+uid);
  notificacionesRef.update({cont: 0});
}

$('#campana').click(function() {
  verNotificaciones();
});

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();

  $("#cbAgregarSustitutos").bootstrapSwitch();

  $.toaster({
    settings: {
      'timeout': 3000
    }
  });
});
