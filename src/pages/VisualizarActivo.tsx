import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useUsos from "../hooks/useUsos";
import useUsuariosPorUso from "../hooks/useUsuariosPorUso";
import { useObtenerComputadora } from "../features/Equipos/Activos/EditarActivo/hooks/useComputadora";
import { useObtenerComputadoraActivo } from "../features/Equipos/Activos/EditarActivo/hooks/useObtenerEquipoSimpleActivo";
import { useObtenerRedActivo } from "../features/Equipos/Activos/EditarActivo/hooks/useObtenerEquipoRedActivo";
import { Periferico, Uso, Usuario } from "../types";
import VisualizarComputadoraActivo from "../features/Equipos/Activos/EditarActivo/pages/VisualizarComputadoraActivo";
import VisualizarActivoRed from "../features/Equipos/Activos/EditarActivo/pages/VisualizarActivoRed";
import VisualizarActivoSimple from "../features/Equipos/Activos/EditarActivo/pages/VisualizarActivoSimple";
import Loader from "./Loader";

const computadores: string[] = ["Laptop", "Computadora"];

const VisualizarActivo = () => {
  const [perifericoId, setPerifericoId] = useState<string | null>(null);
  const [selectedUso, setSelectedUso] = useState<Uso | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const location = useLocation();
  const {
    equipoId,
    perifericos,
    equipoName,
  }: { equipoId: string; perifericos: Periferico[]; equipoName: string } = location.state || {};
  const { usos } = useUsos();
  const { usuarios } = useUsuariosPorUso(selectedUso?.id_uso || "");

  if (equipoName === "Computadora" || equipoName === "Laptop") {
    const { equipo, componentes, loading, error } = useObtenerComputadora(equipoId);

    useEffect(() => {
      if (equipo && perifericos.length > 0) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipo.id_periferico
        );
        setPerifericoId(selectedPeriferico?.id_periferico || null);
      }
    }, [equipo, perifericos]);

    useEffect(() => {
      if (equipo && usos.length > 0) {
        const selectedUso = usos.find((uso) => uso?.id_uso === equipo.id_uso);
        setSelectedUso(selectedUso || null);
      }
    }, [equipo, usos]);

    useEffect(() => {
      if (equipo && usuarios.length > 0) {
        const selectedUsuario = usuarios.find(
          (usuario) => usuario?.id_usuario === equipo?.id_usuario
        );
        setSelectedUsuario(selectedUsuario || null);
      }
    }, [equipo, usuarios]);

    if (loading) return <Loader/>;
    if (error) return <div>Error al cargar los datos del equipo</div>;
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Visualizar Activo</h1>
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Periférico:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre || ""}</div>
            </div>
            <div>
              <label className="font-semibold">Uso:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{selectedUso?.nombre || ""}</div>
            </div>
            <div>
              <label className="font-semibold">Usuario:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{selectedUsuario?.nombre || ""}</div>
            </div>
          </div>
          {perifericoId &&
          computadores.includes(
            perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre ?? ""
          ) ? (
            equipo && (
              <VisualizarComputadoraActivo
                equipo={equipo}
                componentes={componentes}
              />
            )
          ) : (
            perifericoId && (
              <h1>Visualizando otro activo</h1>
            )
          )}
        </div>
      </div>
    );
  }
  else if (equipoName === "Switch" || equipoName === "AP") {
    const { equipoRedActivo, loadingActivoRed, errorActivoRed } = useObtenerRedActivo(equipoId);

    useEffect(() => {
      if (equipoRedActivo && perifericos.length > 0) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipoRedActivo.id_periferico
        );
        setPerifericoId(selectedPeriferico?.id_periferico || null);
      }
    }, [equipoRedActivo, perifericos]);

    if (loadingActivoRed) return <Loader/>;
    if (errorActivoRed) return <div>Error al cargar los datos del equipo</div>;
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Visualizar Activo</h1>
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Periférico:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre || ""}</div>
            </div>
          </div>
          {perifericoId && equipoRedActivo && (
            <VisualizarActivoRed
              perifericoName={equipoName}
              equipoRedActivo={equipoRedActivo}
            />
          )}
        </div>
      </div>
    );
  }
  else {
    const { equipoSimpleActivo, loadingActivoSimple, errorActivoSimple } = useObtenerComputadoraActivo(equipoId);

    useEffect(() => {
      if (equipoSimpleActivo && perifericos.length > 0) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipoSimpleActivo.id_periferico
        );
        setPerifericoId(selectedPeriferico?.id_periferico || null);
      }
    }, [equipoSimpleActivo, perifericos]);

    useEffect(() => {
      if (equipoSimpleActivo && usos.length > 0) {
        const selectedUso = usos.find((uso) => uso?.id_uso === equipoSimpleActivo.id_uso);
        setSelectedUso(selectedUso || null);
      }
    }, [equipoSimpleActivo, usos]);

    useEffect(() => {
      if (equipoSimpleActivo && usuarios.length > 0) {
        const selectedUsuario = usuarios.find(
          (usuario) => usuario?.id_usuario === equipoSimpleActivo?.id_usuario
        );
        setSelectedUsuario(selectedUsuario || null);
      }
    }, [equipoSimpleActivo, usuarios]);

    if (loadingActivoSimple) return <Loader/>;
    if (errorActivoSimple) return <div>Error al cargar los datos del equipo</div>;
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Visualizar Activo</h1>
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Periférico:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre || ""}</div>
            </div>
            <div>
              <label className="font-semibold">Uso:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{selectedUso?.nombre || ""}</div>
            </div>
            <div>
              <label className="font-semibold">Usuario:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">{selectedUsuario?.nombre || ""}</div>
            </div>
          </div>
          {perifericoId && equipoSimpleActivo && (
            <VisualizarActivoSimple
              perifericoName={equipoName}
              equipoSimpleActivo={equipoSimpleActivo}
            />
          )}
        </div>
      </div>
    );
  }
};

export default VisualizarActivo;