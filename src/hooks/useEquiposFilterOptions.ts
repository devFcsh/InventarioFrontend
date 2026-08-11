import { useEffect, useMemo, useState } from "react";
import { Marca, Modelo, Periferico, Serie, Usuario } from "../types";
import clienteAxios from ".";

type EquiposFilterOptionsParams = {
  perifericos: Periferico[];
  marcas: Marca[];
  modelos: Modelo[];
  series: Serie[];
  usuarios?: Usuario[];
  perifericoNombre: string;
  marcaNombre: string;
  modeloNombre: string;
  serieNombre: string;
  usuarioId?: string;
  estado?: "activo" | "baja";
};

export const useEquiposFilterOptions = ({
  perifericos,
  marcas,
  modelos,
  series,
  perifericoNombre,
  marcaNombre,
  modeloNombre,
  serieNombre,
  usuarios = [],
  usuarioId = "",
  estado,
}: EquiposFilterOptionsParams) => {
  const perifericoSeleccionado = useMemo(
    () => perifericos.find((option) => option?.nombre === perifericoNombre),
    [perifericos, perifericoNombre],
  );
  const marcaSeleccionada = useMemo(
    () => marcas.find((option) => option?.nombre === marcaNombre),
    [marcas, marcaNombre],
  );
  const modeloSeleccionado = useMemo(
    () => modelos.find((option) => option?.nombre === modeloNombre),
    [modelos, modeloNombre],
  );
  const serieSeleccionada = useMemo(
    () => series.find((option) => option?.nombre === serieNombre),
    [series, serieNombre],
  );

  const perifericoId = perifericoSeleccionado?.id_periferico || "";
  const marcaId = marcaSeleccionada?.id_marca || "";
  const modeloId = modeloSeleccionado?.id_modelo || "";
  const serieId = serieSeleccionada?.id_serie || "";

  const [relatedOptions, setRelatedOptions] = useState<{
    perifericos: Periferico[];
    marcas: Marca[];
    modelos: Modelo[];
    series: Serie[];
    usuarios: Usuario[];
  } | null>(null);

  useEffect(() => {
    if (!perifericoId && !marcaId && !modeloId && !serieId && !usuarioId) {
      setRelatedOptions(null);
      return;
    }

    let cancelled = false;

    const fetchRelatedOptions = async () => {
      try {
        const { data } = await clienteAxios.get("/equipos/opcionesFiltros", {
          params: {
            perifericoId: perifericoId || undefined,
            marcaId: marcaId || undefined,
            modeloId: modeloId || undefined,
            serieId: serieId || undefined,
            usuarioId: usuarioId || undefined,
            estado,
          },
        });

        if (!cancelled) {
          setRelatedOptions({
            perifericos: data.perifericos ?? [],
            marcas: data.marcas ?? [],
            modelos: data.modelos ?? [],
            series: data.series ?? [],
            usuarios: data.usuarios ?? [],
          });
        }
      } catch {
        if (!cancelled) setRelatedOptions(null);
      }
    };

    fetchRelatedOptions();

    return () => {
      cancelled = true;
    };
  }, [perifericoId, marcaId, modeloId, serieId, usuarioId, estado]);

  return {
    perifericosDisponibles: relatedOptions?.perifericos ?? perifericos,
    marcasDisponibles: relatedOptions?.marcas ?? marcas,
    modelosDisponibles: relatedOptions?.modelos ?? modelos,
    seriesDisponibles: relatedOptions?.series ?? series,
    usuariosDisponibles: relatedOptions?.usuarios ?? usuarios,
  };
};
