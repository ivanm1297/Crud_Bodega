/*  ---------------------- FUNCIONES EMPLEADOS---------------------------------- */
function cargarUsuarios() {
    //Realizar la solicitud AJAX para obtener los usuarios
    fetch('/getEmpleados')
        .then((response) => response.text())//Obtener el contenido de admin-reg.ejs como texto
        .then((html) => {
            //Actualizar la seccion 'actualizable' con el contenido de admin-reg.ejs
            document.getElementById('actualizable').innerHTML = html;
            document.getElementById('actualizable').style.display = 'block';
            $('#tabla_admin').DataTable({
                "language": {
                    "lengthMenu": "<p id='leg'>ORDEN</p>MENU ",
                    "zeroRecords": "lo sentimos. No se encontraron registros que coinsidan",
                    "info": "PAGINA _PAGE_ DE _PAGES_",
                    "infoEmpty": "No hay registros aun",
                    "infoFiltered": "(Mostrando TOTAL coincidencias de un total de MAX registros)",
                    "search": "<p id='leg'>CRITERIO DE BÚSQUEDA</p>",
                    "LoadingRecords": "Cargando...",
                    "Processing": "Precesando...",
                    "SearchPlaceholder": "Comience a teclear...",
                    "paginate": {
                        "precious": "ANTERIOR",
                        "next": "SIGUIENTE"

                    },
                },
                "pageLength": 4,
                "drawCallback": function (settings) {
                    const btnEliminarArray = document.querySelectorAll('.btn-eliminar')

                    //Elimina los eventos anteriores para evitar duplicados
                    btnEliminarArray.forEach((btnEliminar) => {
                        btnEliminar.removeEventListener('click', eliminarUsuario)
                    })

                }
            })
            function eliminarUsuario(event) {
                event.preventDefault()

                const userId = this.getAttribute('data-id');
                const usuarioEnSesionId = document.getElementById('usuarioEnSesion').getAttribute('data-id')


                if (userId === usuarioEnSesionId) {
                    alert("No puedes borrar tu propio registro");
                    return
                }

                if (confirm('¿Estas seguro de que deseas eliminar este usuario?')) {
                    fetch(`/eliminar_admin/${userId}`, {
                        method: 'DELETE',
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Error al eliminar el usuario');
                            }
                            return response.json();
                        })
                        .then((data) => {
                            alert(data.message);
                            cargarUsuarios()
                        })
                        .catch((error) => {
                            alert(error.message);
                        })
                }
            }

            const btnEliminarArray = document.querySelectorAll('.btn-eliminar');
            btnEliminarArray.forEach((btnEliminar) => {
                btnEliminar.addEventListener('click', eliminarUsuario)
            })
        })
        .catch(error => console.error('Error al cargar los usuarios:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnCargarUsuarios').addEventListener('click', function () {
        cargarUsuarios()
    })
})

// Instrucciones para el formulario multipasos de los administradores
const modal_empleado = new bootstrap.Modal(document.getElementById('empleados'));


function onCancel() {
    // Reset wizard
    $('#smartwizard_empleado').smartWizard("reset");

    // Reset form
    document.getElementById("form-empleado-1").reset();
    window.location = "/admin";
}
function closeModal() {
    // Reset wizard
    $('#smartwizard_empleado').smartWizard("reset");
    // Reset form
    document.getElementById("form-empleado-1").reset();
    modal_empleado.hide();
}

$(function () {
    // Leave step event is used for validating the forms
    $("#smartwizard_empleado").on("leaveStep", function (e, anchorObject, currentStepIdx, nextStepIdx, stepDirection) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 1;
        const progressPercentage = (nextStepIdx / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        // Validate only on forward movement
        if (stepDirection == 'forward') {
            let form = document.getElementById('form-empleado-' + (currentStepIdx + 1));
            if (form) {
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    $('#smartwizard_empleado').smartWizard("setState", [currentStepIdx], 'error');
                    $("#smartwizard_empleado").smartWizard('fixHeight');
                    return false;
                }
                $('#smartwizard_empleado').smartWizard("unsetState", [currentStepIdx], 'error');
            }
        }
    });

    // Step show event
    $("#smartwizard_empleado").on("showStep", function (e, anchorObject, stepIndex, stepDirection, stepPosition) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 1;
        const progressPercentage = (stepIndex / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        $("#prev-btn-admin").removeClass('disabled').prop('disabled', false);
        $("#next-btn-admin").removeClass('disabled').prop('disabled', false);
        if (stepPosition === 'first') {
            $("#prev-btn-admin").addClass('disabled').prop('disabled', true);
        } else if (stepPosition === 'last') {
            $("#next-btn-admin").addClass('disabled').prop('disabled', true);
        } else {
            $("#prev-btn-admin").removeClass('disabled').prop('disabled', false);
            $("#next-btn-admin").removeClass('disabled').prop('disabled', false);
        }


    });

    // Smart Wizard
    $('#smartwizard_empleado').smartWizard({
        selected: 0,
        enableURLhash: false,
        // autoAdjustHeight: false,
        theme: 'dots', // basic, arrows, square, round, dots
        transition: {
            animation: 'zoom'
        },
        toolbar: {
            showNextButton: false, // show/hide a Next button
            showPreviousButton: false, // show/hide a Previous button
            position: 'bottom', // none/ top/ both bottom

        },
        anchor: {
            enableNavigation: true, // Enable/Disable anchor navigation
            enableNavigationAlways: false, // Activates all anchors clickable always
            enableDoneState: true, // Add done state on visited steps
            markPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
            unDoneOnBackNavigation: true, // While navigate back, done state will be cleared
            enableDoneStateNavigation: true // Enable/Disable the done state navigation
        },
    });
    $("#prev-btn-admin").on("click", function () {
        // Navigate previous
        $('#smartwizard_empleado').smartWizard("prev");
        return true;
    });

    $("#next-btn-admin").on("click", function () {
        // Navigate next
        $('#smartwizard_empleado').smartWizard("next");
        return true;
    });

    $("#state_selector").on("change", function () {
        $('#smartwizard_empleado').smartWizard("setState", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

    $("#style_selector").on("change", function () {
        $('#smartwizard_empleado').smartWizard("setStyle", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

})

function registrarEmpleado() {
    // Obtén los datos de todos los formularios utilizando jQuery
    const form1Data = $("#form-empleado-1").serialize();

    // Combina los datos de todos los formularios en un solo objeto FormData
    const userData = new FormData();
    userData.append('nombre_empleado', $("#nombre_empleado").val());
    userData.append('apellidos_empleado', $("#apellidos_empleado").val());
    userData.append('domicilio_empleado', $("#domicilio_empleado").val());
    userData.append('correo_empleado', $("#correo_empleado").val());
    userData.append('telefono_empleado', $("#telefono_empleado").val());
    userData.append('psw_empleado', $("#psw_empleado").val());
    //userData.append('foto_admin', $("#foto_admin")[0].files[0]); // Agrega la fotografía al FormData

    // Envía la solicitud Ajax para registrar el usuario
    $.ajax({
        url: "/registro", // La URL a la que enviarás la solicitud POST
        type: "POST",
        data: userData, // Utiliza el objeto FormData que contiene todos los datos, incluida la fotografía
        processData: false, // No proceses los datos
        contentType: false, // No configures automáticamente el tipo de contenido
        success: function (response) {
            // Si el registro fue exitoso, muestra una confirmación o redirige al usuario
            alert(response.message);
            window.location = "/admin";
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON && xhr.responseJSON.error) {
                alert(xhr.responseJSON.error); // Muestra el mensaje de error en una alerta
            } else {
                alert("Error al registrar el empleado. Inténtalo de nuevo.");
            }
        }
    });
}

/* -------------------------------------------------------------------------------*/
//formulario de actualización
const modal_empleado_act = new bootstrap.Modal(document.getElementById('empleados_act'));

function onCancel_act() {
    // Reset wizard
    $('#smartwizard_empleado_act').smartWizard("reset");

    // Reset form
    document.getElementById("form-empleado-act-1").reset();
    window.location = "/admin";
}

function closeModal_act() {
    // Reset wizard
    $('#smartwizard_empleado_act').smartWizard("reset");
    // Reset form
    document.getElementById("form-empleado-act-1").reset();
    modal_empleado_act.hide();
}

$(function () {
    // Leave step event is used for validating the forms
    $("#smartwizard_empleado_act").on("leaveStep", function (e, anchorObject, currentStepIdx, nextStepIdx, stepDirection) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 1;
        const progressPercentage = (nextStepIdx / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        // Validate only on forward movement
        if (stepDirection == 'forward') {
            let form = document.getElementById('form-empleado-act-' + (currentStepIdx + 1));
            if (form) {
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    $('#smartwizard_empleado_act').smartWizard("setState", [currentStepIdx], 'error');
                    $("#smartwizard_empleado_act").smartWizard('fixHeight');
                    return false;
                }
                $('#smartwizard_empleado_act').smartWizard("unsetState", [currentStepIdx], 'error');
            }
        }
    });

    // Step show event
    $("#smartwizard_empleado_act").on("showStep", function (e, anchorObject, stepIndex, stepDirection, stepPosition) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 1;
        const progressPercentage = (stepIndex / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        $("#prev-btn-empleado-act").removeClass('disabled').prop('disabled', false);
        $("#next-btn-empleado-act").removeClass('disabled').prop('disabled', false);
        if (stepPosition === 'first') {
            $("#prev-btn-empleado-act").addClass('disabled').prop('disabled', true);
        } else if (stepPosition === 'last') {
            $("#next-btn-empleado-act").addClass('disabled').prop('disabled', true);
        } else {
            $("#prev-btn-empleado-act").removeClass('disabled').prop('disabled', false);
            $("#next-btn-empleado-act").removeClass('disabled').prop('disabled', false);
        }


    });

    // Smart Wizard
    $('#smartwizard_empleado_act').smartWizard({
        selected: 0,
        enableURLhash: false,
        // autoAdjustHeight: false,
        theme: 'dots', // basic, arrows, square, round, dots
        transition: {
            animation: 'zoom'
        },
        toolbar: {
            showNextButton: false, // show/hide a Next button
            showPreviousButton: false, // show/hide a Previous button
            position: 'bottom', // none/ top/ both bottom

        },
        anchor: {
            enableNavigation: true, // Enable/Disable anchor navigation
            enableNavigationAlways: false, // Activates all anchors clickable always
            enableDoneState: true, // Add done state on visited steps
            markPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
            unDoneOnBackNavigation: true, // While navigate back, done state will be cleared
            enableDoneStateNavigation: true // Enable/Disable the done state navigation
        },
    });
    $("#prev-btn-empleado-act").on("click", function () {
        // Navigate previous
        $('#smartwizard_empleado_act').smartWizard("prev");
        return true;
    });

    $("#next-btn-empleado-act").on("click", function () {
        // Navigate next
        $('#smartwizard_empleado_act').smartWizard("next");
        return true;
    });

    $("#state_selector").on("change", function () {
        $('#smartwizard_empleado_act').smartWizard("setState", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

    $("#style_selector").on("change", function () {
        $('#smartwizard_empleado_act').smartWizard("setStyle", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

});

function llenar_modal(empleadoId){
    const postData ={
        empleadoId
    };
    $.ajax({
        type: 'POST',
        url:'/postEmpleadoById',
        data: { userId: empleadoId},
        success : function(response){
            try {
                modal_empleado_act.show();
                llenarCamposModal(response)
                //abrir el modal
                //$("#administradores_act").modal("show");
            } catch (error) {
                console.error('Error al procesar la respuesta:', error);
            }
        },
        error: function(error){
            console.log('Error al obtener los detalles del empleado:', error);
        }
    });
}
function llenarCamposModal(empleado){
    $("#empleadoId_act").val(empleado._id);
    $("#nombre_empleado_act").val(empleado.nombre_empleado);
    $("#apellidos_empleado_act").val(empleado.aps_empleado);
    $("#domicilio_empleado_act").val(empleado.domicilio_empleado);
    $("#correo_empleado_act").val(empleado.correo);
    $("#telefono_empleado_act").val(empleado.telefono);
}

$('#actualizar-btn-empleado-act').on('click', function(){
    const id = $('#empleadoId_act').val()
    const nombre = $('#nombre_empleado_act').val()
    const apellidos = $('#apellidos_empleado_act').val()
    const domicilio = $("#domicilio_empleado_act").val()
    const correo = $('#correo_empleado_act').val()
    const telefono = $('#telefono_empleado_act').val()

    const formData = new FormData();
    formData.append('empleadoId_act', id);
    formData.append('nombre_empleado_act', nombre);
    formData.append('apellidos_empleado_act', apellidos);
    formData.append('domicilio_empleado_act', domicilio);
    formData.append('correo_empleado_act', correo);
    formData.append('telefono_empleado_act', telefono);

    $.ajax({
        type: 'POST',
        url: '/actualizarEmpleado',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response){
            console.log('Usuario actualizado:', response);
            closeModal_act();
            cargarUsuarios();
        },
        error: function (error){
            console.log('Error al actualizar el usuario:', error);
        }
    });
});

/*  ---------------------------------------------------- FUNCIONES LOTES   -------------------- */

function cargarLotes() {
    //Realizar la solicitud AJAX para obtener los usuarios
    fetch('/getLotes')
        .then((response) => response.text())//Obtener el contenido de admin-reg.ejs como texto
        .then((html) => {
            //Actualizar la seccion 'actualizable' con el contenido de admin-reg.ejs
            document.getElementById('actualizable').innerHTML = html;
            document.getElementById('actualizable').style.display = 'block';
            $('#tabla_lotes').DataTable({
                "language": {
                    "lengthMenu": "<p id='leg'>ORDEN</p>MENU ",
                    "zeroRecords": "lo sentimos. No se encontraron registros que coinsidan",
                    "info": "PAGINA _PAGE_ DE _PAGES_",
                    "infoEmpty": "No hay registros aun",
                    "infoFiltered": "(Mostrando TOTAL coincidencias de un total de MAX registros)",
                    "search": "<p id='leg'>CRITERIO DE BÚSQUEDA</p>",
                    "LoadingRecords": "Cargando...",
                    "Processing": "Precesando...",
                    "SearchPlaceholder": "Comience a teclear...",
                    "paginate": {
                        "precious": "ANTERIOR",
                        "next": "SIGUIENTE"

                    },
                },
                "pageLength": 4,
                "drawCallback": function (settings) {
                    const btnEliminarArray = document.querySelectorAll('.btn-eliminar-lote')

                    //Elimina los eventos anteriores para evitar duplicados
                    btnEliminarArray.forEach((btnEliminar) => {
                        btnEliminar.removeEventListener('click', eliminarLote)
                    })

                }
            })
            function eliminarLote(event) {
                event.preventDefault()

                const userId = this.getAttribute('data-id');
            // const usuarioEnSesionId = document.getElementById('usuarioEnSesion').getAttribute('data-id')


                if (confirm('¿Estas seguro de que deseas eliminar este lote?')) {
                    fetch(`/eliminar_lote/${userId}`, {
                        method: 'DELETE',
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Error al eliminar el Lote');
                            }
                            return response.json();
                        })
                        .then((data) => {
                            alert(data.message);
                            cargarLotes()
                        })
                        .catch((error) => {
                            alert(error.message);
                        })
                }
            }

            const btnEliminarArray = document.querySelectorAll('.btn-eliminar-lote');
            btnEliminarArray.forEach((btnEliminar) => {
                btnEliminar.addEventListener('click', eliminarLote)
            })
        })
        .catch(error => console.error('Error al cargar los lotes:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btnCargarLotes').addEventListener('click', function () {
        cargarLotes()
    })
})


// Instrucciones para el formulario multipasos de registro de lotes
const modal_lote = new bootstrap.Modal(document.getElementById('lotes'));


function onCancel_lote() {
    // Reset wizard
    $('#smartwizard_lote').smartWizard("reset");

    // Reset form
    document.getElementById("form-lote-1").reset();
    window.location = "/admin";
}
function closeModal() {
    // Reset wizard
    $('#smartwizard_lote').smartWizard("reset");
    // Reset form
    document.getElementById("form-lote-1").reset();
    modal_lote.hide();
}

$(function () {
    // Leave step event is used for validating the forms
    $("#smartwizard_lote").on("leaveStep", function (e, anchorObject, currentStepIdx, nextStepIdx, stepDirection) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 1;
        const progressPercentage = (nextStepIdx / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        // Validate only on forward movement
        if (stepDirection == 'forward') {
            let form = document.getElementById('form-lote-' + (currentStepIdx + 1));
            if (form) {
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    $('#smartwizard_lote').smartWizard("setState", [currentStepIdx], 'error');
                    $("#smartwizard_lote").smartWizard('fixHeight');
                    return false;
                }
                $('#smartwizard_lote').smartWizard("unsetState", [currentStepIdx], 'error');
            }
        }
    });

    // Step show event
    $("#smartwizard_lote").on("showStep", function (e, anchorObject, stepIndex, stepDirection, stepPosition) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 1;
        const progressPercentage = (stepIndex / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        $("#prev-btn-admin").removeClass('disabled').prop('disabled', false);
        $("#next-btn-admin").removeClass('disabled').prop('disabled', false);
        if (stepPosition === 'first') {
            $("#prev-btn-admin").addClass('disabled').prop('disabled', true);
        } else if (stepPosition === 'last') {
            $("#next-btn-admin").addClass('disabled').prop('disabled', true);
        } else {
            $("#prev-btn-admin").removeClass('disabled').prop('disabled', false);
            $("#next-btn-admin").removeClass('disabled').prop('disabled', false);
        }


    });

    // Smart Wizard
    $('#smartwizard_lote').smartWizard({
        selected: 0,
        enableURLhash: false,
        // autoAdjustHeight: false,
        theme: 'dots', // basic, arrows, square, round, dots
        transition: {
            animation: 'zoom'
        },
        toolbar: {
            showNextButton: false, // show/hide a Next button
            showPreviousButton: false, // show/hide a Previous button
            position: 'bottom', // none/ top/ both bottom

        },
        anchor: {
            enableNavigation: true, // Enable/Disable anchor navigation
            enableNavigationAlways: false, // Activates all anchors clickable always
            enableDoneState: true, // Add done state on visited steps
            markPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
            unDoneOnBackNavigation: true, // While navigate back, done state will be cleared
            enableDoneStateNavigation: true // Enable/Disable the done state navigation
        },
    });

    $("#state_selector").on("change", function () {
        $('#smartwizard_lote').smartWizard("setState", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

    $("#style_selector").on("change", function () {
        $('#smartwizard_lote').smartWizard("setStyle", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

})

function registrarlote() {
    // Obtén los datos de todos los formularios utilizando jQuery
    const form1Data = $("#form-lote-1").serialize();

    // Combina los datos de todos los formularios en un solo objeto FormData
    const loteData = new FormData();
    loteData.append('fecha_expiracion', $("#fecha_expiracion").val());
    loteData.append('hora_expiracion', $("#hora_expiracion").val());
    loteData.append('responsable', $("#responsable").val());
    loteData.append('observaciones', $("#observaciones").val());

    // Envía la solicitud Ajax para registrar el usuario
    $.ajax({
        url: "/registroLote", // La URL a la que enviarás la solicitud POST
        type: "POST",
        data: loteData, // Utiliza el objeto FormData que contiene todos los datos, incluida la fotografía
        processData: false, // No proceses los datos
        contentType: false, // No configures automáticamente el tipo de contenido
        success: function (response) {
            // Si el registro fue exitoso, muestra una confirmación o redirige al usuario
            alert(response.message);
            window.location = "/admin";
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON && xhr.responseJSON.error) {
                alert(xhr.responseJSON.error); // Muestra el mensaje de error en una alerta
            } else {
                alert("Error al registrar el lote. Inténtalo de nuevo.");
            }
        }
    });
}