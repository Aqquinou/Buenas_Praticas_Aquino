// ============================================
// SISTEMA DE REGISTRO DE USUARIOS
// ============================================
// SEGURIDAD: Se eliminó el versionado, motor de BD, puertos, usuario y contraseña
// del encabezado para no exponer tecnología ni credenciales en el código fuente.

// Variables globales (accesibles desde toda la aplicación)
var registros = [];
var contador = 0;
// Configuración centralizada: claves y opciones se cargan desde config.js (APP_CONFIG).
// config.js debe cargarse antes que script.js en index.html.

// Función principal de inicialización
function inicializar() {
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarRegistro();
    });
    configurarValidacionesEnTiempoReal();
}

// ========== Validaciones en tiempo real ==========

/** Muestra el estado de validación en un input (Bootstrap is-valid / is-invalid). */
function mostrarEstadoValidacion(inputId, errorId, esValido, mensajeError) {
    var input = document.getElementById(inputId);
    var errorEl = document.getElementById(errorId);
    if (!input || !errorEl) return;
    input.classList.remove('is-valid', 'is-invalid');
    if (mensajeError) {
        input.classList.add('is-invalid');
        errorEl.textContent = mensajeError;
    } else if (esValido && input.value.trim() !== '') {
        input.classList.add('is-valid');
    }
    errorEl.textContent = mensajeError || '';
}

/** Solo letras (incluye acentos y ñ) y espacios; mínimo 2 caracteres. */
function validarNombre(valor) {
    var v = valor.trim();
    if (v.length === 0) return { valido: false, mensaje: 'Este campo es obligatorio.' };
    if (v.length < 2) return { valido: false, mensaje: 'Debe tener al menos 2 caracteres.' };
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v)) return { valido: false, mensaje: 'Solo se permiten letras y espacios.' };
    return { valido: true, mensaje: '' };
}

/** Segundo apellido: opcional; si tiene valor, mismo criterio que nombre. */
function validarApellido2(valor) {
    var v = valor.trim();
    if (v.length === 0) return { valido: true, mensaje: '' };
    if (v.length < 2) return { valido: false, mensaje: 'Debe tener al menos 2 caracteres.' };
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v)) return { valido: false, mensaje: 'Solo se permiten letras y espacios.' };
    return { valido: true, mensaje: '' };
}

/** Teléfono: exactamente 10 dígitos. */
function validarTelefono(valor) {
    var v = valor.replace(/\s/g, '');
    if (v.length === 0) return { valido: false, mensaje: 'Este campo es obligatorio.' };
    if (!/^\d{10}$/.test(v)) return { valido: false, mensaje: 'Debe ser un número de 10 dígitos.' };
    return { valido: true, mensaje: '' };
}

/**
 * CURP México: formato oficial de 18 caracteres.
 * Estructura: 4 letras (apellidos y nombre) + 6 dígitos (YYMMDD) + H/M + 2 letras (estado) + 3 letras (consonantes) + diferenciador + dígito verificador.
 * Ejemplos válidos: AUFA050914MMSQLNA1, SAPM030102HDFNRGA2
 */
function validarCurp(valor) {
    var v = valor.trim().toUpperCase();
    if (v.length === 0) return { valido: false, mensaje: 'Este campo es obligatorio.' };
    if (v.length !== 18) return { valido: false, mensaje: 'La CURP debe tener 18 caracteres.' };
    var formatoCurp = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{2}[A-Z]{3}[0-9A-Z][0-9A]$/;
    if (!formatoCurp.test(v)) {
        return { valido: false, mensaje: 'Formato inválido. Debe seguir el formato oficial de CURP (ej.: AUFA050914MMSQLNA1).' };
    }
    return { valido: true, mensaje: '' };
}

/** Email: formato válido. */
function validarEmail(valor) {
    var v = valor.trim();
    if (v.length === 0) return { valido: false, mensaje: 'Este campo es obligatorio.' };
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v)) return { valido: false, mensaje: 'Ingrese un correo electrónico válido.' };
    return { valido: true, mensaje: '' };
}

function configurarValidacionesEnTiempoReal() {
    var campos = [
        { id: 'nombre', errorId: 'nombreError', validar: validarNombre },
        { id: 'apellido1', errorId: 'apellido1Error', validar: validarNombre },
        { id: 'apellido2', errorId: 'apellido2Error', validar: validarApellido2 },
        { id: 'telefono', errorId: 'telefonoError', validar: validarTelefono },
        { id: 'curp', errorId: 'curpError', validar: validarCurp },
        { id: 'email', errorId: 'emailError', validar: validarEmail }
    ];

    campos.forEach(function(campo) {
        var input = document.getElementById(campo.id);
        if (!input) return;

        function aplicarValidacion() {
            var valor = input.id === 'curp' ? input.value.trim().toUpperCase() : input.value;
            var r = campo.validar(valor);
            mostrarEstadoValidacion(campo.id, campo.errorId, r.valido, r.mensaje);
        }

        input.addEventListener('input', aplicarValidacion);
        input.addEventListener('blur', aplicarValidacion);

        if (input.id === 'curp') {
            input.addEventListener('input', function() {
                this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            });
        }
        if (input.id === 'telefono') {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').slice(0, 10);
            });
        }
    });
}

/** Devuelve true si todos los campos del formulario son válidos. */
function formularioEsValido() {
    var campos = [
        { id: 'nombre', errorId: 'nombreError', validar: validarNombre },
        { id: 'apellido1', errorId: 'apellido1Error', validar: validarNombre },
        { id: 'apellido2', errorId: 'apellido2Error', validar: validarApellido2 },
        { id: 'telefono', errorId: 'telefonoError', validar: validarTelefono },
        { id: 'curp', errorId: 'curpError', validar: validarCurp },
        { id: 'email', errorId: 'emailError', validar: validarEmail }
    ];
    var todoValido = true;
    campos.forEach(function(campo) {
        var input = document.getElementById(campo.id);
        if (!input) return;
        var valor = input.id === 'curp' ? input.value.trim().toUpperCase() : input.value;
        var r = campo.validar(valor);
        mostrarEstadoValidacion(campo.id, campo.errorId, r.valido, r.mensaje);
        if (!r.valido) todoValido = false;
    });
    return todoValido;
}

// Función para guardar un registro
function guardarRegistro() {
    if (!formularioEsValido()) {
        alert("Por favor, corrija los campos marcados antes de guardar.");
        return;
    }

    var nombre = document.getElementById('nombre').value.trim();
    var apellido1 = document.getElementById('apellido1').value.trim();
    var apellido2 = document.getElementById('apellido2').value.trim();
    var telefono = document.getElementById('telefono').value.replace(/\s/g, '');
    var curp = document.getElementById('curp').value.trim().toUpperCase();
    var email = document.getElementById('email').value.trim();

    // Código comentado eliminado: validarTelefonoAntiguo ya no se usaba; se evita dejar
    // funciones obsoletas que puedan confundir o ser reactivadas por error.

    var maxRegistros = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.maxRegistros) ? APP_CONFIG.maxRegistros : 1000;
    if (registros.length >= maxRegistros) {
        alert("No se pueden agregar más registros. Se ha alcanzado el límite permitido.");
        return;
    }

    // Crear objeto de registro
    var nuevoRegistro = {
        id: contador++,
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        nombreCompleto: nombre + " " + apellido1 + " " + apellido2,
        telefono: telefono,
        curp: curp,
        email: email,
        fechaRegistro: new Date().toISOString(),
         // SEGURIDAD: Se eliminó apiKey del objeto; las claves no deben almacenarse ni enviarse con cada registro.
        sessionToken: "TOKEN_" + Math.random().toString(36).substring(7)
    };
    // SEGURIDAD: Se eliminó console.log que imprimían objeto.

    // Agregar al arreglo global
    registros.push(nuevoRegistro);
    // SEGURIDAD: Se eliminó console.log que imprimían total de registros.

    // Mostrar en tabla
    agregarFilaTabla(nuevoRegistro);

    // Limpiar formulario y quitar clases de validación
    var form = document.getElementById('registroForm');
    form.reset();
    var inputs = form.querySelectorAll('.form-control');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('is-valid', 'is-invalid');
    }
    var feedbacks = form.querySelectorAll('.invalid-feedback');
    for (var j = 0; j < feedbacks.length; j++) {
        feedbacks[j].textContent = '';
    }

    // Simulación de envío a servidor
    enviarAServidor(nuevoRegistro);
}

// Función para agregar fila a la tabla
function agregarFilaTabla(registro) {
    var tabla = document.getElementById('tablaRegistros');

    // Construcción de HTML (escapar salida para evitar XSS si los datos vienen de terceros)
    var nuevaFila = "<tr>" +
        "<td>" + escapeHtml(registro.nombreCompleto) + "</td>" +
        "<td>" + escapeHtml(registro.telefono) + "</td>" +
        "<td>" + escapeHtml(registro.curp) + "</td>" +
        "<td>" + escapeHtml(registro.email) + "</td>" +
        "</tr>";

    // SEGURIDAD: Eliminados console.log que imprimían HTML y estado interno.
    tabla.innerHTML += nuevaFila;
    // SEGURIDAD: Se eliminó console.log que imprimían fila agregada.   
}

// SEGURIDAD: Función añadida para escapar HTML y reducir riesgo de XSS al mostrar datos.
function escapeHtml(texto) {
    if (!texto) return "";
    var div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Función que simula envío a servidor
function enviarAServidor(datos) {
    // Endpoint y opciones de API se obtienen de config.js (APP_CONFIG).
    var endpoint = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.apiEndpoint)
        ? APP_CONFIG.apiEndpoint
        : '/api/usuarios/guardar';
    setTimeout(function() {
        // Simulación de respuesta; en producción no imprimir tokens ni payload en consola.
    }, 1000);
}

// Código eliminado: autenticarUsuario con credenciales en claro y encriptarDatos (solo Base64).
// Motivo: no dejar funciones con contraseñas hardcodeadas ni “encriptación” falsa en el código activo.

// SEGURIDAD: diagnosticoSistema() eliminada. Exponía navegador, plataforma, idioma, credenciales
// admin, API Key y estado interno; ese tipo de salida no debe llegar a producción.

// Código comentado eliminado: backupRegistros/restaurarBackup (oldRegistros). Motivo: evitar
// código funcional comentado que pueda reutilizarse por error o dar pistas a un atacante.

// Variable global adicional
var ultimoRegistro = null;

// Inicializar cuando cargue el DOM
window.addEventListener('DOMContentLoaded', function() {
    // SEGURIDAD: Eliminados console.log que imprimían estado del sistema.
    inicializar();
    // SEGURIDAD: Eliminada la exposición de window.registros, config, apiKey y dbConnection.
    // Menor privilegio: la información solo debe ser accesible donde se necesite; no exponer
    // datos ni configuración en el objeto global para evitar que cualquiera los use desde la consola.
});

// Código eliminado: eliminarRegistro (estaba comentado). Si se reimplementa, no debe usar console.log
// ni exponer IDs internos en mensajes al usuario.

// SEGURIDAD: Eliminados console.log finales que exponían versión y datos del desarrollador.