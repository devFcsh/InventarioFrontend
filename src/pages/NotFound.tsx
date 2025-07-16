const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-yellow-200 bg-opacity-70">
    <div className="bg-yellow-200  p-8 rounded shadow text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Página no encontrada</h1>
      <p className="text-gray-700">
        La página que buscas no existe o ha sido movida.
      </p>
      <p className="mt-4 text-gray-500">
        Por favor, verifica la URL o regresa al inicio.
      </p>
    </div>
  </div>
);

export default NotFound;
