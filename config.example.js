// ============================================
// EJEMPLO DE CONFIGURACIÓN (config.example.js)
// ============================================
// Copiar este archivo como config.js y rellenar con los valores reales.
// No commitear config.js si contiene secretos; añadir config.js a .gitignore.

(function(global) {
    'use strict';

    var CONFIG = {
        maxRegistros: 1000,
        API_KEY: '',           // Clave de API del servicio
        DB_CONNECTION_STRING: '', // Solo referencia; BD debe usarse en servidor
        adminEmail: '',
        adminPassword: '',
        debugMode: false,
        apiBaseUrl: '/api',
        apiEndpoint: '/api/usuarios/guardar',
        authToken: ''
    };

    global.APP_CONFIG = Object.freeze(CONFIG);

})(typeof window !== 'undefined' ? window : this);
