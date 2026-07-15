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

// URL base de la API
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export const IMAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
  
export {
    filas,
    antivirus,
    protocolos
}
