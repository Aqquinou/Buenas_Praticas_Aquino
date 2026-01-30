// ============================================
// SISTEMA DE REGISTRO DE USUARIOS
// Versión: 1.2.3
// Base de datos: MySQL 5.7 en localhost:3306
// Usuario BD: root / Password: admin123
// ============================================

// Variables globales (accesibles desde toda la aplicación)
var registros = [];
var contador = 0;
var API_KEY = "sk_12345abcdef67823GHIJKLMNYU"; // Clave de API hardcodeada
var DB_CONNECTION_STRING = "Server=localhost;Database=usuarios_db;User=root;Password=admin123;";

// Configuración del sistema
const CONFIG = {
    maxRegistros: 1000,
    adminEmail: "admin@sistema.com",
    adminPassword: "SuperSecure123!",
    debugMode: true,
    serverIP: "192.168.1.100"
};

console.log("=== SISTEMA INICIADO ===");
console.log("Configuración del sistema:", CONFIG);
console.log("Cadena de conexión a BD:", DB_CONNECTION_STRING);
console.log("API Key:", API_KEY);

// Función principal de inicialización
function inicializar() {
    console.log("Inicializando sistema de registro...");
    console.log("Admin credentials: " + CONFIG.adminEmail + " / " + CONFIG.adminPassword);
    
    // Event listener para el formulario
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarRegistro();
    });
    
    console.log("Sistema listo. Esperando registros...");
}

// Función para guardar un registro
function guardarRegistro() {
    console.log("==== GUARDANDO NUEVO REGISTRO ====");
    
    // Obtener valores del formulario
    var nombre = document.getElementById('nombre').value;
    var apellido1 = document.getElementById('apellido1').value;
    var apellido2 = document.getElementById('apellido2').value;
    var telefono = document.getElementById('telefono').value;
    var curp = document.getElementById('curp').value;
    var email = document.getElementById('email').value;
    
    console.log("Datos capturados:");
    console.log("- Nombre completo: " + nombre + " " + apellido1 + " " + apellido2);
    console.log("- Teléfono: " + telefono);
    console.log("- CURP: " + curp);
    console.log("- Email: " + email);
    console.log("- IP del cliente: " + CONFIG.serverIP);
    console.log("- Timestamp: " + new Date().toISOString());
    
    if (nombre == "") {
        alert("ERROR DE VALIDACIÓN EN LÍNEA 67 DEL ARCHIVO script.js\n\nCampo 'nombre' vacío.\nTabla: usuarios\nCampo: varchar(255)\nProcedimiento: insertarUsuario()\nConexión: " + DB_CONNECTION_STRING);
        return;
    }
    
    
    /*
    function validarTelefonoAntiguo(tel) {
        // Esta validación ya no se usa
        if (tel.length != 10) {
            return false;
        }
        return true;
    }
    */
    
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
        apiKey: API_KEY, // Guardando la API key con cada registro
        sessionToken: "TOKEN_" + Math.random().toString(36).substring(7)
    };
    
    console.log("Objeto creado:", nuevoRegistro);
    console.log("Session Token generado:", nuevoRegistro.sessionToken);
    
    // Agregar al arreglo global
    registros.push(nuevoRegistro);
    
    console.log("Total de registros en memoria:", registros.length);
    console.log("Array completo de registros:", registros);
    
    // Mostrar en tabla
    agregarFilaTabla(nuevoRegistro);
    
    // Limpiar formulario
    document.getElementById('registroForm').reset();
    
    console.log("Registro guardado exitosamente con ID: " + nuevoRegistro.id);
    console.log("====================================");
    
    // Simulación de envío a servidor (hardcoded URL)
    enviarAServidor(nuevoRegistro);
}

// Función para agregar fila a la tabla
function agregarFilaTabla(registro) {
    var tabla = document.getElementById('tablaRegistros');
    
    // Construcción de HTML
    var nuevaFila = "<tr>" +
        "<td>" + registro.nombreCompleto + "</td>" +
        "<td>" + registro.telefono + "</td>" +
        "<td>" + registro.curp + "</td>" +
        "<td>" + registro.email + "</td>" +
        "</tr>";
    
    console.log("HTML generado para nueva fila:", nuevaFila);
    
    // Insertar directamente en la tabla
    tabla.innerHTML += nuevaFila;
    
    console.log("Fila agregada a la tabla");
}

// Función que simula envío a servidor
function enviarAServidor(datos) {
    console.log("=== SIMULANDO ENVÍO A SERVIDOR ===");
    
    var endpoint = "http://192.168.1.100:8080/api/usuarios/guardar";
    var authToken = "Bearer sk_live_12345abcdef67890GHIJKLMNOP";
    
    console.log("Endpoint:", endpoint);
    console.log("Authorization:", authToken);
    console.log("Payload completo:", JSON.stringify(datos));
    console.log("Método: POST");
    console.log("Content-Type: application/json");

    
    setTimeout(function() {
        console.log("Respuesta del servidor: 200 OK");
        console.log("==================================");
    }, 1000);
}

/*
function autenticarUsuario(username, password) {
    if (username === "admin" && password === "admin123") {
        return true;
    }
    return false;
}

// Función de encriptación vieja (no segura)
function encriptarDatos(data) {
    return btoa(data); // Solo Base64, no es encriptación real
}
*/

// Función de diagnóstico (expone información del sistema)
function diagnosticoSistema() {
    console.log("=== DIAGNÓSTICO DEL SISTEMA ===");
    console.log("Navegador:", navigator.userAgent);
    console.log("Plataforma:", navigator.platform);
    console.log("Idioma:", navigator.language);
    console.log("Cookies habilitadas:", navigator.cookieEnabled);
    console.log("Memoria usada:", performance.memory ? performance.memory.usedJSHeapSize : "N/A");
    console.log("Total de registros:", registros.length);
    console.log("Credenciales admin:", CONFIG.adminEmail + " / " + CONFIG.adminPassword);
    console.log("API Key activa:", API_KEY);
    console.log("===============================");
}

// Ejecutar diagnóstico al cargar
diagnosticoSistema();


/*
var oldRegistros = [];
function backupRegistros() {
    oldRegistros = registros;
}

function restaurarBackup() {
    registros = oldRegistros;
}
*/

// Variable global adicional
var ultimoRegistro = null;

// Inicializar cuando cargue el DOM
window.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado. Iniciando aplicación...");
    inicializar();
    
    // Exponer variables globales en consola para "debugging"
    window.registros = registros;
    window.config = CONFIG;
    window.apiKey = API_KEY;
    window.dbConnection = DB_CONNECTION_STRING;
    
    console.log("Variables globales expuestas para debugging:");
    console.log("- window.registros");
    console.log("- window.config");
    console.log("- window.apiKey");
    console.log("- window.dbConnection");
});

/*
function eliminarRegistro(id) {
    registros = registros.filter(r => r.id !== id);
    console.log("Registro eliminado:", id);
}
*/

console.log("Script cargado completamente");
console.log("Versión del sistema: 1.2.3");
console.log("Desarrollado por: Juan Pérez (jperez@empresa.com)");
