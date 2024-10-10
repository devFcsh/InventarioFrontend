import { useState } from "react";
import Bajas from "./Bajas";
import Bodega from "./Bodega";
import Activos from "./Activos";

const Equipos = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>("Activos");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Activos":
        return <Activos />;
      case "Bodega":
        return <Bodega />;
      case "Bajas":
        return <Bajas />;
      default:
        return <div>Selecciona una opción</div>;
    }
  };

  return (
    <div className="flex flex-col items-center mt-5 px-4">
      <div className="flex flex-wrap justify-center mb-4 w-full max-w-2xl space-x-2">
        <button
          onClick={() => setSelectedComponent("Activos")}
          className={`py-2 px-4 w-40 h-10 mt-2 sm:mt-0 rounded-lg  font-normal ${
            selectedComponent === "Activos"
              ? "bg-bluebtn text-white"
              : "bg-gray-200 text-black"
          } hover:bg-bluebtn hover:text-white`}
        >
          Activos
        </button>
        <button
          onClick={() => setSelectedComponent("Bodega")}
          className={`py-2 px-4 w-40 h-10 mt-2 sm:mt-0 rounded-lg  font-normal ${
            selectedComponent === "Bodega"
              ? "bg-bluebtn text-white"
              : "bg-gray-200 text-black"
          } hover:bg-bluebtn hover:text-white`}
        >
          Bodega
        </button>
        <button
          onClick={() => setSelectedComponent("Bajas")}
          className={`py-2 px-4 w-40 h-10 mt-2 sm:mt-0 rounded-lg font-normal ${
            selectedComponent === "Bajas"
              ? "bg-bluebtn text-white"
              : "bg-gray-200 text-black"
          } hover:bg-bluebtn hover:text-white`}
        >
          Bajas
        </button>
      </div>

      <div className="w-full max-w-6xl">{renderComponent()}</div>
    </div>
  );
};

export default Equipos;
