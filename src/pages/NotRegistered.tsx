const NotRegistered = () => (
<div className="min-h-screen flex items-center justify-center bg-yellow-200 bg-opacity-70">
    <div className="p-8 rounded shadow text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Usuario no registrado</h1>
      <p className="text-gray-700">
        Tu usuario ha sido autenticado por CAS, pero no está registrado en el sistema de inventario.
      </p>
      <p className="mt-4 text-gray-500">
        Si crees que esto es un error, contacta al administrador del sistema.
      </p>
    </div>
  </div>
);

export default NotRegistered;