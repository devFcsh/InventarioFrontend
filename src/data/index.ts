const filas = [
    { id: 0, name: "Todos" },
    { id: 10, name: "10" },
    { id: 20, name: "20" },
    { id: 50, name: "50" },
    { id: 100, name: "100" },
  ];

const protocolos = [
    { id: "0", nombre: "Estático" },
    { id: "1", nombre: "Dinámico" },
  ];

const antivirus = [
    { id_antivirus: "1", nombre: "Activado" },
    { id_antivirus: "2", nombre: "Desactivado" },
  ]

// VITE_BACKEND_URL puede incluir o no el sufijo /api.
// Normalizamos las URLs para mantener separadas la API y la autenticaciÃ³n.
const configuredBackendUrl = (
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

export const BACKEND_BASE_URL = configuredBackendUrl.replace(/\/api\/?$/, '');
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;
export const AUTH_BASE_URL = BACKEND_BASE_URL;
export const IMAGE_BASE_URL = BACKEND_BASE_URL;
  
export {
    filas,
    antivirus,
    protocolos
}
